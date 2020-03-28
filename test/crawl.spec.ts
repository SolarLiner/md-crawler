import test from "ava";
import crawl from "../src/crawl"
import * as path from "path";
import {some} from "fp-ts/lib/Option";

test("crawls directories", async t => {
  const root = path.join(__dirname, "data");
  const res = await crawl(some, root);
  t.snapshot(res);
});
