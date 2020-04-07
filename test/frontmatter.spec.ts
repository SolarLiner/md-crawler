import test from "ava";
import frontmatter, { load, read } from "../src/frontmatter";
import { join } from "path";

test("Parses frontmatter", t => {
  const input = "---\nhello\n---\ncontents";
  const fm = load(input);
  t.is(fm.contents, "contents");
  t.is(fm.frontmatter, "hello");
});

test("Does not throw on malformed frontmatter", t => {
  const input = `---
hello
--
contents`;
  t.notThrows(() => {
    const f = load(input);
    t.is(f.frontmatter, "");
    t.is(f.contents, input.trim());
  });
});

test("Loads frontmatter", async t => {
  const fpath = join(__dirname, "data/file.md");
  const fm = await read(fpath, "utf-8");
  t.snapshot(fm);
});

test("Maps frontmatter", t => {
  const f = load("---hello---contents");
  t.is(frontmatter.map(f, String.prototype.toUpperCase.call).frontmatter, "HELLO");
});
