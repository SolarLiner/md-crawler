import { lstatSync, readdirSync } from "fs";
import * as path from "path";
import { isSome, Option } from "fp-ts/lib/Option";

export type CrawlTransform<T> = (fpath: string) => Option<T>;

export default function crawl<T>(transform: CrawlTransform<T>, root: string): T[] {
  const paths = getPaths(root);
  return paths.map(transform).filter(isSome).map(e => e.value);
}

export function getPaths(root: string): string[] {
  const paths = readdirSync(root).map(f => path.join(root, f));
  const [dirs, files] = partitionDirs(paths);
  const subdirs = dirs.map(getPaths);
  //return Promise.all(subdirs).then(flatten).then(ds => [root].concat(ds, files));
  return flatten([...subdirs, files]);
}

const partition = <T>(pred: (a: T) => boolean) => (fs: T[]): [T[], T[]] => fs.reduce<[T[], T[]]>(([a, b], x) => pred(x) ? [[...a, x], b] : [a, [...b, x]], [[], []]);
const partitionDirs = partition<string>(x => lstatSync(x).isDirectory());

function flatten<T>(arr: T[][]): T[] {
  const n = arr.reduce((acc, xs) => acc.concat(xs), []);
  return n;
}
