import Dexie, { type Table } from 'dexie';

export interface Child {
  id?: number;
  name: string;
  age: number;
  createdAt: Date;
}

class KidsClosetDB extends Dexie {
  children!: Table<Child>;

  constructor() {
    super('KidsClosetDB');
    this.version(1).stores({
      children: '++id, name, age, createdAt',
    });
  }
}

export const db = new KidsClosetDB();
