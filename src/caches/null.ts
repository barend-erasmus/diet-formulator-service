import { injectable } from 'inversify';
import 'reflect-metadata';
import { ICache } from '../interfaces/cache';

@injectable()
export class NullCache implements ICache {

    public async add(key: string, value: any, expiry: number, userName: string): Promise<void> {

    }

    public async addUsingObjectKey(key: any, value: any, expiry: number, userName: string): Promise<void> {

    }

    public async clearAll(userName: string): Promise<void> {

    }

    public async get(key: string, userName: string): Promise<any> {
        return null;
    }

    public async getUsingObjectKey(key: string, userName: string): Promise<any> {
        return null;
    }
}
