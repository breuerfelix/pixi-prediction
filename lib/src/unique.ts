import shortid from 'shortid';


const IDS = new Set<string>();

export function generateID(): string {
  let ID = null;
  do {
    ID = shortid.generate();
  } while (IDS.has(ID));

  IDS.add(ID);
  return ID;
}
