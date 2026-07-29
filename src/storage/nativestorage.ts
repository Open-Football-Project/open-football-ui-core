import { FutballeroUIStorage } from ".";

const inMemory = new Map<string, any>();

export const nativeStorage: FutballeroUIStorage = {
  async get(key) {
    return inMemory.get(key) ?? null;
  },
  async set(key, value) {
    inMemory.set(key, value);
  },
  async remove(key) {
    inMemory.delete(key);
  },
};
