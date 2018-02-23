import { expect } from 'chai';
import 'mocha';
import { ICryptographyAlgorithm } from '../interfaces/cryptography';
import { AES128CTRCryptographyAlgorithm } from './aes-256-ctr';

describe('AES128CTRCryptographyAlgorithm', () => {

    let crytographyAlgoritm: ICryptographyAlgorithm = null;

    before(async () => {
        crytographyAlgoritm = new AES128CTRCryptographyAlgorithm('password');
    });

    describe('decrypt', () => {

        it('should return decrypted string', async () => {

            const result: string = crytographyAlgoritm.decrypt('f8c9d08f9e923824fd9aad');

            expect(result).to.be.eq('hello world');

        });

    });

    describe('encrypt', () => {

        it('should return encrypted string', async () => {

            const result: string = crytographyAlgoritm.encrypt('hello world');

            expect(result).to.be.eq('f8c9d08f9e923824fd9aad');

        });

    });
});
