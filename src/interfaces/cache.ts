export interface ICache {
    add(key: string, value: any, expiry: number, userName: string): Promise<void>;
    addUsingObjectKey(key: any, value: any, expiry: number, userName: string): Promise<void>;
    clearAllByUserName(userName: string): Promise<void>;
    get(key: string, userName: string): Promise<any>;
    getUsingObjectKey(key: any, userName: string): Promise<any>;
}
