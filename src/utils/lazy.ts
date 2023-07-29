export interface LazyInitializer<T> {
  (): T;
}

export class Lazy<T> {
  private instance: T | null = null;
  private initializer: LazyInitializer<T>;

  constructor(initializer: LazyInitializer<T>) {
    this.initializer = initializer;
  }

  get value(): T {
    if (this.instance == null) {
      this.instance = this.initializer();
    }

    return this.instance;
  }
}
