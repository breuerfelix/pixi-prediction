import shortid from 'shortid';

class Unique {
  static ids: Set<string> = new Set();
  id: string = null;

  constructor(id: string = null) {
    if (id != null) {
      if (Unique.ids.has(id)) {
        throw 'ID ALEADY IN USE';
      }

      this.id = id;
      return;
    }

    do {
      this.id = shortid.generate();
    } while (Unique.ids.has(this.id));
  }
}

export default Unique;
