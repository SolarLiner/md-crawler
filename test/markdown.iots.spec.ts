import test from "ava";
import * as iots from "io-ts";
import {loadMD} from "../src/markdown";
import {Either, isRight} from "fp-ts/lib/Either";
import {flow} from "fp-ts/lib/function"
import {join} from "path";

const frontmatter = iots.type({
  title: iots.string,
  author: iots.string,
  tags: iots.array(iots.string, "tags")
});

function eitherUnwrap<T>(either: Either<any, T>): T {
  if (isRight(either)) return either.right;
  throw new Error(either.left);
}

const decodeOrThrow = flow(frontmatter.decode, eitherUnwrap);

test("Can load and verify types with io-ts", async t => {
  const fpath = join(__dirname, "data", "file.md");
  try {
    const f = await loadMD(fpath, decodeOrThrow);
    t.is(f.title, "This is a test");
    t.is(f.author, "SolarLiner");
    t.deepEqual(f.tags, ["tag1", "tag2"]);
  } catch (err) {
    t.fail(err);
  }
});
