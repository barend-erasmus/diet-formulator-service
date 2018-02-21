import { injectable } from 'inversify';
import * as Memcached from 'memcached';
import 'reflect-metadata';
import * as zlib from 'zlib';
import { ICache } from '../interfaces/cache';

@injectable()
export class MemcachedCache implements ICache {

    private client: any = null;

    constructor(
        private url: string,
    ) {
        this.client = new Memcached(this.url, {

        });
    }

    public async add(key: string, value: any, expiry: number, userName: string): Promise<void> {
        new Promise((resolve, reject) => {
            this.client.set(key, this.deflateObjectToString(value), expiry ? expiry : 2592000, (err: Error, data: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        }).then(() => {

        });
    }

    public async addUsingObjectKey(key: any, value: any, expiry: number, userName: string): Promise<void> {
        const uniqueKey: string = this.buildUniqueKey(key, userName);

        this.add(uniqueKey, value, expiry, userName);
    }

    public async get(key: string, userName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err: Error, data: any) => {
                if (err) {
                    reject(err);
                    return;
                }

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
        const keys: string[] = Object.keys(obj).sort();

        const uniqueKey: string = keys.map((x) => `${x}=${obj[x]}`).join('|');

        return `${userName}-${uniqueKey}`;
    }

    private deflateObjectToString(obj: any): string {
        return zlib.deflateSync(JSON.stringify(obj)).toString('base64');
    }

    private inflateStringToObject(str: any): any {
        return JSON.parse(zlib.inflateSync(new Buffer(str, 'base64')).toString());
    }
}
