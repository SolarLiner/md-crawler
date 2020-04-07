import { fromNullable, isLeft } from "fp-ts/lib/Either";
import { Applicative1 } from "fp-ts/lib/Applicative";
import { Monad1 } from "fp-ts/lib/Monad";
import { readFileSync } from "fs";

const FRONTMATTER_RE = /(?:(?:^-{3}([\w\W]*?)-{3})?([\w\W]*))/;

export const URI = "Frontmatter";
export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  // noinspection JSUnusedGlobalSymbols
  interface URItoKind<A> {
    Frontmatter: Frontmatter<A>
  }
}

export interface Frontmatter<A> {
  frontmatter: A;
  contents: string;
}

const match = (re: RegExp) => (content: string) => fromNullable("Frontmatter parsing failed")(content.match(re));
const matchFrontmatter = match(FRONTMATTER_RE);

const mergeFilenames = (a: string, b: string) => {
  if (a === "<unknown>") {
    return b;
  }
  if (b === "<unkown>") {
    return a;
  }
  return a + " <> " + b;
};

const map = <A, B>(fa: Frontmatter<A>, f: (a: A) => B): Frontmatter<B> => ({ ...fa, frontmatter: f(fa.frontmatter) });

const of = <A>(a: A): Frontmatter<A> => ({ contents: `${a}`, frontmatter: a });
const ap = <A, B>(fab: Frontmatter<(a: A) => B>, fa: Frontmatter<A>): Frontmatter<B> => map(fa, fab.frontmatter);
const chain = <A, B>(ma: Frontmatter<A>, f: (a: A) => Frontmatter<B>): Frontmatter<B> => {
  const { contents: fnameA, frontmatter: { contents: fnameB, frontmatter } } = map(ma, f);
  return { contents: mergeFilenames(fnameA, fnameB), frontmatter };
};

const frontmatter: Applicative1<URI> & Monad1<URI> = {
  URI,
  map,
  of,
  ap,
  chain
};

export default frontmatter;

export const read = (filename: string, encoding?: string): Frontmatter<string> => {
  const contents = readFileSync(filename).toString(encoding);
  return ({ contents, frontmatter: contents });
};
export const load = (contents: string) => ({ frontmatter: contents, contents });
export const parse = (c: string): Frontmatter<string> => {
  const matches = matchFrontmatter(c);
  if (isLeft(matches)) return { contents: c, frontmatter: "" };
  else {
    const [_, frontmatter, contents] = matches.right.map(v => typeof v === "undefined" ? "" : v.trim());
    return { frontmatter, contents };
  }
};
