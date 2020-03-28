import crawlMarkdown from "../src";
import {join} from "path";
import * as t from "io-ts";
import {Either, isLeft} from "fp-ts/lib/Either";
import {flow} from "fp-ts/lib/function";
import {writeFileSync} from "fs";

const DateId = new t.Type<Date, Date, unknown>(
  "DateId",
  (u): u is Date => u instanceof Date,
  (u, c) => u instanceof Date ? t.success(u) : t.failure(u, c),
  (v) => v
);

const FrontmatterT = t.type({
  title: t.string,
  author: t.string,
  date: DateId,
}, "Frontmatter");

main().catch(console.error);

async function main() {
  const data = await crawlMarkdown(join(__dirname, "content"), flow(FrontmatterT.decode, unwrap));
  writeFileSync(join(__dirname, "data.json"), JSON.stringify(data, null, 2));
}

function unwrap<T, E>(e: Either<E, T>): T {
  if (isLeft(e)) throw new Error(`${e.left}`);
  return e.right;
}
