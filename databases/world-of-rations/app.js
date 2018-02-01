const fs = require('fs');
const pg = require('pg');
const csv = require('csv-parser');

(async () => {

    const tableNames = ['nutrients', 'ingredientGroups', 'ingredients', 'ingredientValues', 'dietGroups', 'diets', 'dietValues', 'comparisonDiets', 'suggestedValues', 'supplements'];

    for (const tableName of tableNames) {

        const content = fs.readFileSync(`./table-exports/${tableName}.csv`, 'utf8');

        const lines = content.split(/\r?\n/);

        const headerLine = lines[0];

        const columns = headerLine.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const indexOfApplicationId = columns.indexOf('applicationId');

        const pool = new pg.Pool({
            user: 'sa',
            host: 'developersworkspace.co.za',
            database: 'diet-formulator-2018',
            password: 'i8@lltheteaspoon$',
            port: 5432,
        });

        const client = await pool.connect();

        let query = null;

        try {
            console.log(`Beginning transaction - ${tableName}`);

            await client.query(`ALTER TABLE public."${tableName}" DISABLE TRIGGER ALL;`);

            await client.query('BEGIN');

            for (let i = 1; i < lines.length - 1; i++) {
                const values = lines[i].split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                query = `INSERT INTO public."${tableName}" (${columns.filter((x, index) => index !== indexOfApplicationId).map((x) => `"${x}"`).join(', ')}) VALUES (${values.filter((x, index) => index !== indexOfApplicationId).map((x) => x === '' ? 'NULL' : (isNaN(x) ? `'${x.replace(new RegExp(`'`, 'g'), `''`)}'` : x)).join(', ')});`
                // console.log(`${tableName} - ${i} of ${lines.length - 1} (${i / (lines.length - 1) * 100})`);
                await client.query(query);
            }

            console.log('Committing transaction');

            await client.query('COMMIT');

            console.log('Successfully commited transaction');

        } catch (e) {
            console.log('Rolling back transaction');
            console.error(query);

            await client.query('ROLLBACK');
        } finally {
            await client.query(`ALTER TABLE public."${tableName}" ENABLE TRIGGER ALL;`);

            client.release();
        }

    }

})().catch(e => console.error(e.message));


