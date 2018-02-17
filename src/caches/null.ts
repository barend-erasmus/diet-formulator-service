import { injectable } from 'inversify';
import 'reflect-metadata';
import { ICache } from '../interfaces/cache';

@injectable()
export class NullCache implements ICache {

    public async add(key: string, value: any, expiry: number): Promise<void> {

    }

    public async addUsingObjectKey(key: any, value: any, expiry: number): Promise<void> {

    }

    public async get(key: string): Promise<any> {
        return null;
    }

    public async getUsingObjectKey(key: string): Promise<any> {
        return null;
    }
}
