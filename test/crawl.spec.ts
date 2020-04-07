import test from "ava";
import crawl from "../src/crawl";
import * as path from "path";
import { relative } from "path";
import { some } from "fp-ts/lib/Option";

test("crawls directories", t => {
  const root = path.join(__dirname, "data");
  const res = crawl(some, root).map(f => relative(root, f));
  t.snapshot(res);
});
