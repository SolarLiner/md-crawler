import {promisify} from "util";
import {lstat as _l, readdir as _rd} from "fs";
import * as path from "path";
import {isSome, Option} from "fp-ts/lib/Option";

const lstat = promisify(_l);
const readdir = promisify(_rd);

export type CrawlTransform<T> = (fpath: string) => Option<T>;

export default async function crawl<T>(transform: CrawlTransform<T>, root: string): Promise<T[]> {
  const paths = await getPaths(root);
  return paths.map(transform).filter(isSome).map(e => e.value);
}

export async function getPaths(root: string): Promise<string[]> {
  const paths = await readdir(root).then(fs => fs.map(f => path.join(root, f)));
  const [dirs, files] = await partitionAsync(paths, async file => (await lstat(file)).isDirectory());
  const subdirs = dirs.map(getPaths);
  return Promise.all(subdirs).then(flatten).then(ds => [root].concat(ds, files));
}

async function partitionAsync<T>(arr: T[], pred: (x: T) => Promise<boolean>): Promise<[T[], T[]]> {
  const a = new Array<T>();
  const b = new Array<T>();
  for (const x of arr) {
    if (await pred(x)) {
      a.push(x);
    } else {
      b.push(x);
    }
  }
  return [a, b];
}

function flatten<T>(arr: T[][]): T[] {
  const n = arr.reduce((acc, xs) => acc.concat(xs), []);
  return n;
}
