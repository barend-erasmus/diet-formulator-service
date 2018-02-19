import { injectable } from 'inversify';
import 'reflect-metadata';
import { ICache } from '../interfaces/cache';

@injectable()
export class MemoryCache implements ICache {

    private static items: {} = {};

    public async add(key: string, value: any, expiry: number): Promise<void> {
        MemoryCache.items[key] = value;
    }

    public async addUsingObjectKey(key: any, value: any, expiry: number): Promise<void> {
        const uniqueKey: string = this.buildUniqueKey(key);

        this.add(uniqueKey, value, expiry);
    }

    public async get(key: string): Promise<any> {
        if (MemoryCache.items[key]) {
            return MemoryCache.items[key];
        }

        return null;
    }

    public async getUsingObjectKey(key: string): Promise<any> {
        const uniqueKey: string = this.buildUniqueKey(key);

        return this.get(uniqueKey);
    }

    private buildUniqueKey(obj: any): string {
        const keys: string[] = Object.keys(obj).sort();

        const uniqueKey: string = keys.map((x) => `${x}=${obj[x]}`).join('|');

        return uniqueKey;
    }
}
