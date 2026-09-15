"use client";

/* Browser-only session restoration must run after hydration; storage errors update UI. */
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sseData, type ChatMessage } from "@/lib/chat/protocol";
import type { Source } from "@/lib/chat/knowledge";
import styles from "./Chatbot.module.css";

type Message = ChatMessage & { sources?: Source[]; state?: "done" | "error" | "stopped" };
const STORAGE = "kang:chat:v1";
const safePath = (href: string) => href === "/about" || /^\/(articles|projects)\/[a-z0-9-]+$/.test(href);
// Only plain text is rendered: model-generated URLs/HTML/Markdown are never interactive.
function displayText(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/https?:\/\/[^\s<>]+|www\.[^\s<>]+/gi, "[链接请见下方资料]").replace(/\/(?:articles|projects)\/[a-z0-9-]+/gi, "[链接请见下方资料]");
}

export function Chatbot() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const session = useRef("");
  const request = useRef<AbortController | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const follow = useRef(true);
  const theme = pathname === "/about" || pathname.startsWith("/articles") ? "light" : "dark";

  useEffect(() => {
    session.current = crypto.randomUUID();
    try {
      const raw = sessionStorage.getItem(STORAGE);
      if (raw && raw.length < 150000) {
        const saved = JSON.parse(raw);
        if (typeof saved.id === "string" && /^[0-9a-f-]{36}$/.test(saved.id) && Array.isArray(saved.messages)) {
          session.current = saved.id;
          const restored: Message[] = saved.messages.slice(-30).filter((m: Message) =>
            m && ["user", "assistant"].includes(m.role) && typeof m.content === "string" && m.content.length <= 6000,
          ).map((m: Message) => ({ role: m.role, content: m.content, state: m.state === "done" ? "done" : "stopped", sources: Array.isArray(m.sources) ? m.sources.filter((s) => typeof s.title === "string" && typeof s.href === "string" && safePath(s.href)).slice(0, 4) : [] }));
          setMessages(restored);
        }
      }
    } catch { setStorageWarning(true); }
    setReady(true);
    return () => request.current?.abort();
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(STORAGE, JSON.stringify({ id: session.current, messages: messages.slice(-30) })); }
    catch { setStorageWarning(true); }
  }, [messages, ready]);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    if (!node) return;
    node.showModal();
    input.current?.focus({ preventScroll: true });
    const returnFocus = trigger.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = window.__lenis;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    return () => {
      node.close();
      document.body.style.overflow = oldOverflow;
      if (!wasStopped) lenis?.start();
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (open && follow.current && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open, busy]);

  function close() { setOpen(false); }
  function clear() {
    if (request.current) return;
    session.current = crypto.randomUUID();
    setMessages([]); setError(""); setDraft("");
    input.current?.focus();
  }

  async function send(retry = false) {
    if (request.current || !ready) return;
    const previous = retry ? messages.slice(0, -2) : messages;
    const question = retry ? messages.at(-2)?.content : draft.trim();
    if (!question || question.length > 2000) return;
    // Only complete pairs are sent back; failed/partial responses never become evidence.
    const history: ChatMessage[] = [];
    for (let i = 0; i < previous.length - 1; i++) {
      if (previous[i].role === "user" && previous[i + 1].role === "assistant" && previous[i + 1].state === "done") {
        history.push({ role: "user", content: previous[i].content }, { role: "assistant", content: previous[i + 1].content }); i++;
      }
    }
    while (history.length > 14 || history.reduce((n, m) => n + m.content.length, question.length) > 12000) history.splice(0, 2);
    const controller = new AbortController();
    request.current = controller;
    input.current?.focus({ preventScroll: true });
    setBusy(true); setError(""); setDraft(""); follow.current = true;
    const base: Message[] = [...previous, { role: "user" as const, content: question }].slice(-29);
    let answer: Message = { role: "assistant", content: "" };
    const update = () => setMessages([...base, { ...answer }]);
    update();
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ sessionId: session.current, messages: [...history, { role: "user", content: question }] }) });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "连接失败，请稍后重试。");
      }
      if (!response.body) throw new Error("浏览器未收到响应，请重试。");
      let completed = false;
      for await (const data of sseData(response.body)) {
        const event = JSON.parse(data);
        if (event.type === "sources") answer.sources = event.sources.filter((s: Source) => safePath(s.href));
        else if (event.type === "delta") { answer.content += event.text; if (answer.content.length > 6000) throw new Error("回答过长，请缩小问题范围。"); }
        else if (event.type === "error") throw new Error(event.error);
        else if (event.type === "done") { completed = true; answer.state = "done"; }
        update();
      }
      if (!completed) throw new Error("连接中断，请重试。");
    } catch (err) {
      answer = { ...answer, state: controller.signal.aborted ? "stopped" : "error" };
      setError(controller.signal.aborted ? "已停止生成，可以重试或继续提问。" : err instanceof Error ? err.message : "连接失败，请重试。");
      controller.abort(); update();
    } finally { request.current = null; setBusy(false); }
  }

  const retryable = !busy && messages.at(-1)?.role === "assistant" && messages.at(-1)?.state !== "done";
  return (
    <div className={styles.root} data-theme={theme}>
      <button ref={trigger} type="button" className={styles.launcher} aria-haspopup="dialog" aria-controls="kang-chat" aria-expanded={open} disabled={!ready} onClick={() => setOpen(true)}>
        <span aria-hidden="true" className={styles.logo} /> 问问 KANG AI
      </button>
      <dialog ref={dialog} id="kang-chat" className={styles.panel} aria-labelledby="kang-chat-title" data-lenis-prevent onCancel={(event) => { event.preventDefault(); close(); }} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], textarea, input, [tabindex="0"]'));
        const first = nodes[0]; const last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <header className={styles.header}>
          <h2 id="kang-chat-title">问问 KANG AI</h2>
          <div className={styles.actions}><button onClick={clear} disabled={busy}>新会话</button><button onClick={close} aria-label="收起 KANG AI">×</button></div>
        </header>
        <div className={`${styles.log} ${messages.length === 0 ? styles.empty : ""}`} ref={log} role="log" aria-label="对话记录" aria-live="off" tabIndex={0} onScroll={() => { const el = log.current!; follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 70; }}>
          {messages.length === 0 && <h3 className={styles.greeting}>想了解我什么？</h3>}
          {messages.map((message, index) => <article key={index} className={`${styles.message} ${message.role === "user" ? styles.user : ""}`} aria-label={message.role === "user" ? "你的问题" : "AI 回答"}>
            <p className={styles.eyebrow}>{message.role === "user" ? "你" : "李康"}</p>
            <p className={styles.answer}>{displayText(message.content) || (busy ? "让我想想…" : "这次没能回复，请再试一次。")}</p>
            {message.state && message.state !== "done" && <small>此回答未完成</small>}
            {!!message.sources?.length && <nav className={styles.sources} aria-label="本次参考资料（非逐句引证）"><small>本次参考资料</small>{message.sources.map((source) => <Link key={source.href} href={source.href} onClick={close}>{source.title} ↗</Link>)}</nav>}
          </article>)}
        </div>
        <footer className={styles.footer}>
          {error && <p role="status" className={styles.status}>{error}</p>}
          {retryable && <button className={styles.retry} onClick={() => void send(true)}>重试上一问题</button>}
          <form onSubmit={(e) => { e.preventDefault(); void send(); }}>
            <label className={styles.srOnly} htmlFor="kang-chat-input">向 KANG AI 提问</label>
            <textarea ref={input} id="kang-chat-input" value={draft} maxLength={2000} rows={2} placeholder="发消息…" onChange={(e) => setDraft(e.target.value)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !composing.current && e.keyCode !== 229) { e.preventDefault(); void send(); } }} />
            {busy ? <button type="button" className={styles.send} onClick={() => { request.current?.abort(); input.current?.focus({ preventScroll: true }); }}>停止</button> : <button className={styles.send} type="submit" disabled={!draft.trim() || !ready}>发送 ↗</button>}
          </form>
          {storageWarning && <p className={styles.note}>浏览器存储不可用，刷新后会话可能丢失。</p>}
        </footer>
      </dialog>
    </div>
  );
}
