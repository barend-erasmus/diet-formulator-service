export interface ICache {
    add(key: string, value: any, expiry: number): Promise<void>;
    addUsingObjectKey(key: any, value: any, expiry: number): Promise<void>;
    get(key: string): Promise<any>;
    getUsingObjectKey(key: any): Promise<any>;
}
