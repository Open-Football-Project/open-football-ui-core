export interface FootballProjectUIStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export { webStorage } from "./webstorage";
export { nativeStorage } from "./nativestorage";
