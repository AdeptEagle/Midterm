declare module 'csv-parser' {
  import { Transform } from 'stream';

  interface Options {
    separator?: string;
    newline?: string;
    quote?: string;
    escape?: string;
    headers?: boolean | string[];
    mapHeaders?: ({ header, index }: { header: string; index: number }) => string | null;
    mapValues?: ({ header, index, value }: { header: string; index: number; value: string }) => string;
    strict?: boolean;
  }

  function csvParser(options?: Options): Transform;

  export = csvParser;
}
