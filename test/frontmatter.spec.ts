import test from "ava";
import Frontmatter from "../src/frontmatter";
import {join} from "path";

test("Parses frontmatter", t => {
  const input = "---\nhello\n---\ncontents";
  const fm = Frontmatter.parse(input);
  t.is(fm.contents, "contents");
  t.is(fm.frontmatter, "hello");
});

test("Does not throw on malformed frontmatter", t => {
  const input = `---
hello
--
contents`;
  t.notThrows(() => {
    const f = Frontmatter.parse(input);
    t.is(f.frontmatter, "");
    t.is(f.contents, input.trim());
  });
});

test("Loads frontmatter", async t => {
  const fpath = join(__dirname, "data/file.md");
  const fm = await Frontmatter.load(fpath, "utf-8");
  t.snapshot(fm);
});

test("Maps frontmatter", t => {
  const f = Frontmatter.parse("---hello---contents");
  t.is(f.map(f => f.toUpperCase()).frontmatter, "HELLO");
});
