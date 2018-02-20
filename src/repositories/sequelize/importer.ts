import * as fs from 'fs';
import * as path from 'path';
import * as pg from 'pg';

export class Importer {

    constructor(
        private host: string,
        private userName: string,
        private password: string,
        private directory: string,
    ) {

    }

    public async import(): Promise<void> {
        const tableNames = ['nutrients', 'ingredientGroups', 'ingredients', 'ingredientValues', 'dietGroups', 'diets', 'dietValues', 'comparisonDiets', 'suggestedValues', 'supplements'];

        const pool = await this.getPool();

        // await client.query(`DROP SCHEMA public CASCADE;`);
        // await client.query(`CREATE SCHEMA public;`);

        for (const tableName of tableNames) {
            const data = this.parseFile(`${tableName}.csv`);

            const query = null;

            try {
                await pool.query(`ALTER TABLE public."${tableName}" DISABLE TRIGGER ALL;`);

                await pool.query('BEGIN');

                const queries = this.buildQueries(tableName, data);

                const chunkSize = 200;

                for (let i = 0; i < queries.length; i += chunkSize) {
                    const tempQueries = queries.slice(i, i + chunkSize);

                    await pool.query(tempQueries.join('\r\n'));
                }

                await pool.query('COMMIT');
            } catch (err) {
                await pool.query('ROLLBACK');
                console.error(err);
            } finally {
                await pool.query(`ALTER TABLE public."${tableName}" ENABLE TRIGGER ALL;`);
                // pool.close();
            }
        }
    }

    private buildQueries(tableName: string, data: {
        columns: string[],
        header: string,
        lines: string[],
    }): string[] {
        const queries = [];

        const columns = data.columns;

        for (let i = 1; i < data.lines.length - 1; i++) {
            const values = data.lines[i].split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            queries.push(`INSERT INTO public."${tableName}" (${columns.map((x) => `"${x}"`).join(', ')}) VALUES (${values.map((x, index) => this.parseValue(data, index, x)).join(', ')});`);
        }

        return queries;
    }

    private async getPool(): Promise<any> {
        const pool = new pg.Pool({
            database: 'world-of-rations',
            host: this.host,
            password: this.password,
            port: 5432,
            user: this.userName,
        });

        return pool;
    }

    private parseFile(file: string): {
        columns: string[],
        header: string,
        lines: string[],
    } {
        const content = fs.readFileSync(path.join(this.directory, file), 'utf8');

        const lines = content.split(/\r?\n/);

        const header = lines[0];

        const columns = header.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        return {
            columns,
            header,
            lines,
        };
    }

    private parseValue(data: {
        columns: string[],
        header: string,
        lines: string[],
    },                 columnIndex: number, value: any): string {
        return value === '' ? 'NULL' : (isNaN(value) ? `'${value.replace(new RegExp(`'`, 'g'), `''`)}'` : value);
    }
}
