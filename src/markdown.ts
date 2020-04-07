import { Frontmatter, read } from "./frontmatter";
import { safeLoad as _rawSafeLoad } from "js-yaml";
import { none, option, Option, some } from "fp-ts/lib/Option";
import { flow } from "fp-ts/lib/function";

export interface Validator<T> {
  (data: object): Option<T>
}

export type MarkdownFile<T> = { filename: string } & MarkdownData<T>;
export type MarkdownData<T> = T & { contents: string };

function safeLoad(s: string): Option<object> {
  try {
    return some(_rawSafeLoad(s));
  } catch {
    return none;
  }
}

const validate = <T>(validator: Validator<T>) => ({ contents, frontmatter }: Frontmatter<string>): Option<Frontmatter<T>> =>
  option.map(
    option.chain(
      safeLoad(frontmatter),
      validator
    ),
    frontmatter => ({ contents, frontmatter })
  );
export const readMarkdown = <T>(validator: Validator<T>) => (filename: string, encoding?: string): Option<MarkdownFile<T>> =>
  option.map(
    validate(validator)(read(filename, encoding)),
    flow(toMarkdownData, m => ({ ...m, filename }))
  );

const toMarkdownData = <T>(fm: Frontmatter<T>): MarkdownData<T> => ({ ...fm.frontmatter, contents: fm.contents });
