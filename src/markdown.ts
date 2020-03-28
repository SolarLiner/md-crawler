import Frontmatter from "./frontmatter";
import {safeLoad} from "js-yaml";

export interface Validator<T> {
  (data: any): T
}

export type MarkdownFile<T> = { filename: string } & MarkdownData<T>;
export type MarkdownData<T> = T & { contents: string };

export async function loadMD<T>(fpath: string, validator: Validator<T>): Promise<MarkdownFile<T>> {
  return {
    ...doValidation(await Frontmatter.load(fpath), validator),
    filename: fpath,
  };
}

export function parseMD<T>(contents: string, validator: Validator<T>): MarkdownData<T> {
  return doValidation(Frontmatter.parse(contents), validator);
}

export function doValidation<T>(f: Frontmatter<string>, validator: Validator<T>): MarkdownData<T> {
  const validated = f.map(safeLoad).map(validator);
  return {
    ...validated.frontmatter,
    contents: validated.contents
  };
}
