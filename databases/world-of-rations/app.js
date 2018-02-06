const fs = require('fs');
const pg = require('pg');
const titleCase = require('title-case');

(async () => {

    const tableNames = ['nutrients', 'ingredientGroups', 'ingredients', 'ingredientValues', 'dietGroups', 'diets', 'dietValues', 'comparisonDiets', 'suggestedValues', 'supplements'];

    for (const tableName of tableNames) {

        const tableData = getTableData(tableName);

        const client = await getClient();

        let query = null;

        try {
            await client.query(`ALTER TABLE public."${tableName}" DISABLE TRIGGER ALL;`);

            await beginTransaction(client, tableName);

            let queries = buildQueries(tableName, tableData);

            const chunkSize = 200;

            for (let i = 0; i < queries.length; i += chunkSize) {
                const tempQueries = queries.slice(i, i + chunkSize);

                await client.query(tempQueries.join('\r\n'));

                // console.log(`${tableName} - ${i} of ${queries.length} (${i / (queries.length) * 100})`);
            }

            await commitTransaction(client);
        } catch (err) {
            await rollbackTransaction(client);
            console.error(err);
        } finally {
            await client.query(`ALTER TABLE public."${tableName}" ENABLE TRIGGER ALL;`);
            client.release();
        }
    }
})().catch(e => console.error(e.message));

async function beginTransaction(client, tableName) {
    console.log(`Beginning transaction - ${tableName}`);

    await client.query('BEGIN');
}

function buildQueries(tableName, tableData) {
    let queries = [];

    const columns = getFilteredColumns(tableData);

    for (let i = 1; i < tableData.lines.length - 1; i++) {
        let values = tableData.lines[i].split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        values = getFilteredValues(tableData, values);

        queries.push(`INSERT INTO public."${tableName}" (${columns.map((x) => `"${x}"`).join(', ')}) VALUES (${values.map((x, index) => parseValue(tableData, index, x)).join(', ')});`);
    }

    return queries;
}

function parseValue(tableData, columnIndex, value) {
    
    // if (value && tableData.columns[columnIndex] === 'name') {
    //     value = toTitleCase(value);
    // }

    return value === '' ? 'NULL' : (isNaN(value) ? `'${value.replace(new RegExp(`'`, 'g'), `''`)}'` : value);
}

function toTitleCase(str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

function getFilteredColumns(tableData) {

    const indexOfApplicationId = tableData.columns.indexOf('applicationId');

    return tableData.columns.filter((x, index) => index !== indexOfApplicationId);
}

function getFilteredValues(tableData, values) {

    const indexOfApplicationId = tableData.columns.indexOf('applicationId');

    return values.filter((x, index) => index !== indexOfApplicationId)
}

async function commitTransaction(client) {
    console.log('Committing transaction');

    await client.query('COMMIT');

    console.log('Successfully commited transaction');
}

async function getClient() {

    const pool = new pg.Pool({
        user: 'sa',
        host: 'developersworkspace.co.za',
        database: 'diet-formulator-2018',
        password: 'i8@lltheteaspoon$',
        port: 5432,
    });

    const client = await pool.connect();

    return client;
}

function getTableData(tableName) {
    const content = fs.readFileSync(`./table-exports/${tableName}.csv`, 'utf8');

    const lines = content.split(/\r?\n/);

    const header = lines[0];

    const columns = header.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    return {
        columns,
        header,
        lines,
    };
}

async function rollbackTransaction(client) {
    console.log('Rolling back transaction');

    await client.query('ROLLBACK');
}
