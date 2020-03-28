import {readFile as _rf} from "fs";
import {promisify} from "util";
import {chain, fromNullable, isLeft, left, right} from "fp-ts/lib/Either";

const readFile = promisify(_rf);
const FRONTMATTER_RE = /(?:(?:^-{3}([\w\W]*?)-{3})?([\w\W]*))/;

export default class Frontmatter<A> {
  constructor(public readonly frontmatter: A, public readonly contents: string) {
  }

  public static parse(contents: string): Frontmatter<string> {
    const res = (parseFrontmatter(contents));
    if (isLeft(res)) throw new Error(res.left);
    else return Frontmatter.wrap(res.right);
  }

  public static async load(filename: string, encoding?: string): Promise<Frontmatter<string>> {
    const contents = await readFile(filename);
    return Frontmatter.parse(contents.toString(encoding));
  }

  public static wrap<T>({contents, data}: FrontmatterData<T>): Frontmatter<T> {
    return new Frontmatter(data, contents);
  }

  public map<B>(f: (x: A) => B): Frontmatter<B> {
    return new Frontmatter(f(this.frontmatter), this.contents);
  }
}

interface FrontmatterData<T> {
  contents: string;
  data: T;
}

const match = (re: RegExp) => (content: string) => fromNullable("Frontmatter parsing failed")(content.match(re));
const matchFrontmatter = match(FRONTMATTER_RE);
const loadFrontmatter = chain((match: RegExpMatchArray) => {
  if (match.length === 3) {
    const data = valid(match[1]) ? match[1].trim() : "";
    const contents = match[2].trim();
    return right({data, contents});
  } else return left(`Failed to parse frontmatter\ninput: ${match[0]}\nnumber of matches: ${match.length - 1}\nmatches: ["${match.slice(1).join('","')}"]`);
});
const parseFrontmatter = (contents: string) => loadFrontmatter(matchFrontmatter(contents));
const valid = <T>(x: T | null | undefined) => !(typeof x === "undefined") && x !== null;
