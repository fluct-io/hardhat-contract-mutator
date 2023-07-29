import { HardhatAdapter } from "../core/HardhatAdapter";
import { HardhatRuntimeEnvironment, Paths } from "../core/types";

describe("Hardhat Adapter", () => {
  const createHRE = (paths: Partial<Paths>): HardhatRuntimeEnvironment => ({
    config: {
      paths: {
        root: paths.root || "/test-project",
        sources: paths.sources || "/test-project/contracts",
      },
    },
  });

  it("should set root path", () => {
    const root = "test-project-hyper-1";
    const hre = createHRE({ root });
    const adapter = new HardhatAdapter(hre);

    const actualRoot = adapter.root;

    expect(actualRoot).toBe(root);
  });

  it("should set sources path", () => {
    const sources = "test-project-hyper-1/sources";
    const hre = createHRE({ sources });
    const adapter = new HardhatAdapter(hre);

    const actualSources = adapter.sources;

    expect(actualSources).toBe(sources);
  });
});
