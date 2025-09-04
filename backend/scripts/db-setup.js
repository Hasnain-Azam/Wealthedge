import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await client.connect();
    await client.query(sql);
    console.log('Database schema applied.');
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
