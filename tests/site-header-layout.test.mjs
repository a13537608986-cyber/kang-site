import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const headerPath = new URL("../components/layout/SiteHeader.tsx", import.meta.url);

test("desktop navigation is viewport-centered and uses a stronger weight", async () => {
  const source = await readFile(headerPath, "utf8");

  assert.match(
    source,
    /<nav[^>]+data-desktop-nav[^>]+className="[^"]*absolute[^"]*left-1\/2[^"]*-translate-x-1\/2[^"]*font-semibold[^"]*"/s,
  );
  assert.match(source, /<header[^>]+className={`fixed inset-x-0/s);
});

test("desktop header matches the 88px reference height while mobile stays compact", async () => {
  const source = await readFile(headerPath, "utf8");

  assert.match(
    source,
    /className={`fixed inset-x-0 top-0 z-50 h-16[^`]*md:h-\[88px\]/,
  );
  assert.match(source, /className="container-k flex h-full items-center justify-between"/);
});
