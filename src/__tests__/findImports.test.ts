import { findImports } from "../core/findImports";

jest.mock("../core/FileSystem");

const MOCK_FILES: Record<string, string> = {
  "/test-project/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol":
    "ERC721",
  "/test-project/contracts/Counter.sol": "COUNTER",
};

const createPaths = () => ({
  root: "/test-project",
  sources: "/test-project/contracts",
});

describe("Find Imports", () => {
  beforeEach(() => {
    require("../core/FileSystem").__setMockFiles(MOCK_FILES);
  });

  it("should find absolute imports", () => {
    const { contents: actualImportContent } = findImports(createPaths())(
      "@openzeppelin/contracts/token/ERC721/ERC721.sol"
    );

    expect(actualImportContent).toBe(
      MOCK_FILES[
        "/test-project/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"
      ]
    );
  });

  it("should find relative imports", () => {
    const { contents: actualImportContent } = findImports(createPaths())(
      "./Counter.sol"
    );

    expect(actualImportContent).toBe(
      MOCK_FILES["/test-project/contracts/Counter.sol"]
    );
  });
});
