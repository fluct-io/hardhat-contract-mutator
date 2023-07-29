import { CompilationInputProviderSolidity } from "../core/CompilationInputProviderSolidity";

jest.mock("../core/FileSystem");

const MOCK_FILES: Record<string, string> = {
  "/test-project/contracts/MyContract.sol": "pragma solidity ^0.8.0;",
  "/test-project/contracts/miscellaneous.txt": "Lorem ipsum dolor sit amet",
};

const createPaths = () => ({
  root: "/test-project",
  sources: "/test-project/contracts",
});

describe("Compilation Input Provider", () => {
  beforeEach(() => {
    require("../core/FileSystem").__setMockFiles(MOCK_FILES);
  });

  it("should provide language", () => {
    const provider = new CompilationInputProviderSolidity(createPaths());

    const { language: actualLanguage } = provider.provide();

    expect(actualLanguage).toBe("Solidity");
  });

  it("should provide universal output selection", () => {
    const provider = new CompilationInputProviderSolidity(createPaths());

    const {
      settings: { outputSelection: actualOutputSelection },
    } = provider.provide();

    expect(actualOutputSelection).toStrictEqual({
      "*": {
        "*": ["*"],
      },
    });
  });

  it("should provide sources", () => {
    const provider = new CompilationInputProviderSolidity(createPaths());

    const { sources: actualSources } = provider.provide();

    expect(actualSources).toStrictEqual({
      "MyContract.sol": { content: "pragma solidity ^0.8.0;" },
    });
  });
});
