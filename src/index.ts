import { MarkdownFile, readMarkdown, Validator } from "./markdown";
import crawl from "./crawl";
import { flow } from "fp-ts/lib/function";
import { none, option, some } from "fp-ts/lib/Option";
import { lstatSync } from "fs";

export type MarkdownNode<T> = MarkdownFile<T> & { id: string };


export default function crawlMarkdown<T>(validator: Validator<T>, root: string) {
  return crawl(flow(wrapIf(isFile), o => option.chain(o, readMarkdown(validator)), o => option.map(o, addId)), root);
}

const splitext = (x: string) => x.substring(0, x.indexOf("."));
const addId = <T>(f: MarkdownFile<T>): MarkdownNode<T> => ({ ...f, id: splitext(f.filename) });
const isFile: (x: string) => boolean = flow(lstatSync, s => !s.isDirectory());
const wrapIf = <T>(pred: (x: T) => boolean) => (x: T) => pred(x) ? some(x) : none;
