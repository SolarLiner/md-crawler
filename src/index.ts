import {loadMD, MarkdownFile, Validator} from "./markdown";
import {relative} from "path";
import crawl from "./crawl";
import {flow} from "fp-ts/lib/function";
import {none, some} from "fp-ts/lib/Option";
import {lstatSync} from "fs";

export type MarkdownNode<T> = MarkdownFile<T> & { id: string };


export default async function crawlMarkdown<T>(root: string, validator: Validator<T>): Promise<Array<MarkdownNode<T>>> {
  const files = await crawl(flow(wrapIf(isFile)), root);
  const mdFiles = await Promise.all(files.map(f => loadMD(f, validator)));
  return mdFiles.map(f => ({...f, id: splitext(relative(root, f.filename))}));
}

const splitext = (x: string) => x.substring(0, x.indexOf("."));
const isFile: (x: string) => boolean = flow(lstatSync, s => !s.isDirectory());
const wrapIf = <T>(pred: (x: T) => boolean) => (x: T) => pred(x) ? some(x) : none;
