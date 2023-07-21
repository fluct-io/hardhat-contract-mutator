import { HardhatRuntimeEnvironment, Paths } from "./types";

export class HardhatAdapter implements Paths {
  readonly hre: HardhatRuntimeEnvironment;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
  }

  public get root(): string {
    return this.hre.config.paths.root;
  }

  public get sources(): string {
    return this.hre.config.paths.sources;
  }
}
