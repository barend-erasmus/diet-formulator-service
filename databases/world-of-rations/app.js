const fs = require('fs');
const pg = require('pg');

(async () => {

    const tableNames = ['nutrients', 'ingredientGroups', 'ingredients', 'ingredientValues', 'dietGroups', 'diets', 'dietValues', 'comparisonDiets', 'suggestedValues', 'supplements'];

    for (const tableName of tableNames) {

        const content = fs.readFileSync(`./table-exports/${tableName}.csv`, 'utf8');

        const lines = content.split(/\r?\n/);

        const headerLine = lines[0];

        const columns = headerLine.split(';');

        const pool = new pg.Pool({
            user: 'diet-formulator',
            host: 'localhost',
            database: 'diet-formulator',
            password: '&UNtpV9B-XeF?%Ks',
            port: 5432,
        });

        const client = await pool.connect();

        try {
            console.log('Beginning transaction');

            await client.query(`ALTER TABLE public."${tableName}" DISABLE TRIGGER ALL;`);

            await client.query('BEGIN');

            for (let i = 1; i < lines.length - 1; i++) {
                const values = lines[i].split(';');
                const query = `INSERT INTO public."${tableName}" (${columns.map((x) => `"${x}"`).join(', ')}) VALUES (${values.map((x) => x === '' ? 'NULL' : (isNaN(x) ? `'${x}'` : x)).join(', ')});`
                console.log(`${tableName} - ${i} of ${lines.length - 1} (${i / (lines.length - 1) * 100})`);
                await client.query(query);
            }

            console.log('Committing transaction');

            await client.query('COMMIT');
            
            console.log('Successfully commited transaction');

        } catch (e) {
            console.log('Rolling back transaction');

            await client.query('ROLLBACK');
        } finally {
            await client.query(`ALTER TABLE public."${tableName}" ENABLE TRIGGER ALL;`);

            client.release();
        }

    }

})().catch(e => console.error(e.message));

