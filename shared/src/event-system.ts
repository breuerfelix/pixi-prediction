export class EventSystem<T> {
  events = new Map<T, Set<Function>>();

  on(event: T, callback: Function): () => void {
    let set = this.events.get(event);

    if (!set) {
      set = new Set();
      this.events.set(event, set);
    }

    set.add(callback);
    return (): boolean => set.delete(callback);
  }

  off(callback: Function): void {
    this.events.forEach(set => {
      if (set.has(callback)) {
        set.delete(callback);
      }
    });
  }

  emit(event: T, ...data: any[]): void {
    const set = this.events.get(event);
    if (!set) return;

    set.forEach(callback => callback(...data));
  }
}

export default EventSystem;
