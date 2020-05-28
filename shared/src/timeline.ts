interface Data<T> {
  data: T;
  mutable: boolean;
}

export class Timeline<T> {
  data = new Map<number, Data<T>>();
  timestamps = new Array<number>();

  set(timestamp: number, data: T, mutable = true): void {
    if (!this.data.has(timestamp)) {
      this.timestamps.push(timestamp);
      this.timestamps.sort();
    } else {
      const data = this.data.get(timestamp);
      if (!data.mutable) return;
    }

    this.data.set(timestamp, { mutable, data });
  }

  size(): number {
    return this.timestamps.length;
  }

  get(timestamp: number): T {
    if (this.data.has(timestamp)) {
      return this.data.get(timestamp).data;
    }

    // return the last timestamp in memory
    return this.data.get(
      this.timestamps[this.size() - 1],
    ).data;
  }

  clean(timestamp: number): void {
    // always keep the last sample
    while (this.timestamps.length > 1) {
      const firstItem = this.timestamps[0];

      if (firstItem >= timestamp) break;

      this.timestamps.shift();
      this.data.delete(firstItem);
    }
  }
}
