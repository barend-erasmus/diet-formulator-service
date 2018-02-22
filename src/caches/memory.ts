import { injectable } from 'inversify';
import 'reflect-metadata';
import { ICache } from '../interfaces/cache';

@injectable()
export class MemoryCache implements ICache {

    private static items: {} = {};

    public async add(key: string, value: any, expiry: number, userName: string): Promise<void> {
        MemoryCache.items[key] = value;
    }

    public async addUsingObjectKey(key: any, value: any, expiry: number, userName: string): Promise<void> {
        const uniqueKey: string = this.buildUniqueKey(key, userName);

        this.add(uniqueKey, value, expiry, userName);
    }

    public async clearAll(userName: string): Promise<void> {

    }

    public async get(key: string, userName: string): Promise<any> {
        if (MemoryCache.items[key]) {
            return MemoryCache.items[key];
        }

        return null;
    }

    public async getUsingObjectKey(key: string, userName: string): Promise<any> {
        const uniqueKey: string = this.buildUniqueKey(key, userName);

        return this.get(uniqueKey, userName);
    }

    private buildUniqueKey(obj: any, userName: string): string {
        const keys: string[] = Object.keys(obj).sort();

        const uniqueKey: string = keys.map((x) => `${x}=${obj[x]}`).join('|');

        return `${userName}-${uniqueKey}`;
    }
}
