/** 标签 / 元信息小徽章。DEMO 标记自动反色提示，便于识别占位内容。 */
export function Tag({ label }: { label: string }) {
  const isDemo = label === "DEMO";
  return (
    <span
      className={`type-label inline-flex items-center border px-2 py-1 ${
        isDemo
          ? "border-line-strong bg-fg text-bg"
          : "border-line text-fg-muted"
      }`}
    >
      {label}
    </span>
  );
}

export function TagRow({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="标签">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag label={tag} />
        </li>
      ))}
    </ul>
  );
}
