import { injectable } from 'inversify';
import 'reflect-metadata';
import * as request from 'request-promise';
import { IGeoGateway } from '../interfaces/geo-gateway';

@injectable()
export class FreeGeoGateway implements IGeoGateway {

    public async getCountryCodeFromIPAddress(ipAddress: string): Promise<string> {
        const response = await request({
            json: true,
            method: 'GET',
            uri: `http://freegeoip.net/json/${ipAddress}`,
        });

        return response.country_code;
    }

    public async getGeoCodeFromIPAddress(ipAddress: string): Promise<string> {
        const response = await request({
            json: true,
            method: 'GET',
            uri: `http://freegeoip.net/json/${ipAddress}`,
        });

        return `${response.country_code} - ${response.region_code} - ${response.city}`;
    }
}
