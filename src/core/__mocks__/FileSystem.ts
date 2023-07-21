import path from "path";

let mockFiles: Record<string, string> = Object.create(null);

function __setMockFiles(newMockFiles: Record<string, string>) {
  mockFiles = { ...newMockFiles };
}

function readDir(p: string) {
  return Object.keys(mockFiles).map((f) => path.basename(f));
}

function readFile(p: string) {
  return mockFiles[p];
}

function stat(p: string) {
  const isFile = () => p in mockFiles;
  const isDirectory = () => !isFile();
  return { isFile, isDirectory };
}

module.exports = {
  __setMockFiles,
  readDir,
  readFile,
  stat,
};
