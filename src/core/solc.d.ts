declare module "solc" {
  type ReadCallbackResult = { contents: string } | { error: string };
  type ReadCallback = (path: string) => ReadCallbackResult;
  type Callbacks = { [x: string]: ReadCallback };
  export function compile(input: string, readCallback?: Callbacks): string;
}
