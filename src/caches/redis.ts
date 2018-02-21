import { injectable } from 'inversify';
import * as Redis from 'ioredis';
import 'reflect-metadata';
import { ICache } from '../interfaces/cache';

@injectable()
export class RedisCache implements ICache {

    private client: any = null;

    constructor(
        private url: string,
    ) {
        this.client = new Redis(this.url);
    }

    public async add(key: string, value: any, expiry: number, userName: string): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async addUsingObjectKey(key: any, value: any, expiry: number, userName: string): Promise<void> {
        const uniqueKey: string = this.buildUniqueKey(key, userName);

        this.add(uniqueKey, value, expiry, userName);
    }

    public async get(key: string, userName: string): Promise<any> {
        const result: string = await this.client.get(key);

        if (!result) {
            return null;
        }

        return JSON.stringify(result);
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
