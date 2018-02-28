export interface IGeoGateway {
    getCountryCodeFromIPAddress(ipAddress: string): Promise<string>;
    getGeoCodeFromIPAddress(ipAddress: string): Promise<string>;
}
