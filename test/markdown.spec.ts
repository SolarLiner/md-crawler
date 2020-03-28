import test from "ava";
import {parseMD} from "../src/markdown";

const assert = require("assert");

test("Loads markdown and validates frontmatter", t => {
  const input = "---hello---contents";
  t.notThrows(() => {
    const data = parseMD(input, x => assert(x === "hello", "verification failed"));
    t.is(data.contents, "contents");
  })
});
