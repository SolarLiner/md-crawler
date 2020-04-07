import test from "ava";
import * as iots from "io-ts";
import { readMarkdown } from "../src/markdown";
import { Either, isRight } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { join } from "path";
import { isSome, none, Option, Some, some } from "fp-ts/lib/Option";

const FTType = iots.type({
  title: iots.string,
  author: iots.string,
  tags: iots.array(iots.string, "tags")
});

function eitherUnwrap<T>(either: Either<any, T>): Option<T> {
  console.log(either);
  if (isRight(either)) return some(either.right);
  return none;
}

const decodeOrThrow = flow(FTType.decode, eitherUnwrap);
const reader = readMarkdown(decodeOrThrow);

test("Can load and verify types with io-ts", t => {
  const fpath = join(__dirname, "data", "file.md");
  try {
    const _f = reader(fpath);
    t.true(isSome(_f));
    const f = (_f as Some<iots.TypeOf<typeof FTType>>).value;
    t.is(f.title, "This is a test");
    t.is(f.author, "SolarLiner");
    t.deepEqual(f.tags, ["tag1", "tag2"]);
  } catch (err) {
    t.fail(err);
  }
});
