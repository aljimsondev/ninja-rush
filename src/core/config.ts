export interface ConfigOptions {
  blockSize?: number;
}

export class Config {
  blockSize = 48;
  constructor({ blockSize = 48 }: ConfigOptions = {}) {
    this.blockSize = blockSize;
  }

  setBlockSize(size: number) {
    this.blockSize = size;
  }
}
