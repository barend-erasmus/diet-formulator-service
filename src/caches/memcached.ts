import { injectable } from 'inversify';
import * as Memcached from 'memcached';
import 'reflect-metadata';
import * as zlib from 'zlib';
import { ICache } from '../interfaces/cache';
import { ILogger } from '../interfaces/logger';

@injectable()
export class MemcachedCache implements ICache {

    private client: any = null;

    constructor(
        private logger: ILogger,
        private url: string,
    ) {
        this.client = new Memcached(this.url, {

        });
    }

    public async add(key: string, value: any, expiry: number, userName: string): Promise<void> {
        new Promise((resolve, reject) => {
            this.client.set(key, this.deflateObjectToString(value), expiry ? expiry : 900, (err: Error, data: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.logger.debug(`MemcachedCache.add('${key}', ..., ${expiry}, ${userName})`);

                resolve();
            });
        }).then(() => {

        });
    }

    public async addUsingObjectKey(key: any, value: any, expiry: number, userName: string): Promise<void> {
        const uniqueKey: string = this.buildUniqueKey(key, userName);

        this.add(uniqueKey, value, expiry, userName);
    }

    public async clearAllByPattern(pattern: RegExp): Promise<void> {
        const keys: string[] = await this.keysAll();

        for (const key of keys) {
            if (pattern.test(key)) {
                await this.removeKey(key);
            }
        }
    }

    public async clearAllByUserName(key: string, userName: string): Promise<void> {
        const keys: string[] = await this.keysAll();

        for (const key of keys) {
            const pattern: RegExp = new RegExp(`${userName}-.*`);

            if (pattern.test(key)) {
                await this.removeKey(key);
            }
        }
    }

    public async get(key: string, userName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err: Error, data: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.logger.debug(`MemcachedCache.get('${key}', ${userName}) => ${data ? 'hit' : 'miss'}`);

                if (data) {
                    resolve(this.inflateStringToObject(data));
                } else {
                    resolve(null);
                }
            });
        });
    }

    public async getUsingObjectKey(key: string, userName: string): Promise<any> {
        const uniqueKey: string = this.buildUniqueKey(key, userName);

        return this.get(uniqueKey, userName);
    }

    private buildUniqueKey(obj: any, userName: string): string {
        const keys: string[] = Object.keys(obj).filter((key) => key !== 'key').sort();

        const uniqueKey: string = keys.map((x) => `${x}=${obj[x]}`).join('|');

        if (obj.key) {
            return `${userName}-${obj.key}-${uniqueKey}`;
        } else {
            return `${userName}-${uniqueKey}`;
        }
    }

    private deflateObjectToString(obj: any): string {
        const result: string = zlib.deflateSync(JSON.stringify(obj)).toString('base64');

        this.logger.debug(`MemcachedCache.deflateObjectToString(...) => ${result.length} bytes`);

        return result;
    }

    private inflateStringToObject(str: any): any {
        const result: any = JSON.parse(zlib.inflateSync(new Buffer(str, 'base64')).toString());

        return result;
    }

    private keys(server: string, slabId: number, n: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.client.cachedump(server, slabId, n, (err: Error, data: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (data.map) {
                    resolve(data.map((x) => x.key));
                } else {
                    resolve([data.key]);
                }
            });
        });
    }

    private async keysAll(): Promise<string[]> {
        let result: string[] = [];

        const slabs: any[] = await this.slabs();

        for (const slab of slabs) {
            for (const slabId of Object.keys(slab)) {
                if (slabId === 'server') {
                    continue;
                }

                const keys: string[] = await this.keys(slab.server, parseInt(slabId, undefined), slab[slabId].number);

                result = result.concat(keys);
            }
        }

        return result;
    }

    private removeKey(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.logger.debug(`MemcachedCache.removeKey('${key}')`);

                resolve();
            });
        });
    }

    private slabs(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.client.items((err: Error, data: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(data);
            });
        });
    }
}
