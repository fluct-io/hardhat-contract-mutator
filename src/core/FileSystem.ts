import fs from "fs";
import type { FileSystemStat } from "./types";

let instance: FileSystem;

class FileSystem {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  readDir(path: string): string[] {
    return fs.readdirSync(path);
  }
  stat(path: string): FileSystemStat {
    return fs.statSync(path);
  }
  readFile(path: string): string {
    return fs.readFileSync(path, "utf-8");
  }
}

const singletonFileSystem = Object.freeze(new FileSystem());

export default singletonFileSystem;
