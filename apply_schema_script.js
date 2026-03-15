const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Jexasd123-asdasd@db.bqcabqjbbgqdhwllwuhi.supabase.co:5432/postgres';

async function applySchema() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to database.');
        
        const sql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
        console.log('Applying schema...');
        
        await client.query(sql);
        console.log('Schema applied successfully!');
        
    } catch (err) {
        console.error('Error applying schema:', err.message);
    } finally {
        await client.end();
    }
}

applySchema();
