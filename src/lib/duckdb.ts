import * as duckdb from "@duckdb/duckdb-wasm";
import { QueryResult } from "@/types";
import { CREATE_TABLES_SQL, SEED_CRIMES_SQL, SEED_PEOPLE_SQL } from "./seedData";

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

async function createDb(): Promise<duckdb.AsyncDuckDB> {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);

  const workerBlob = new Blob([`importScripts("${bundle.mainWorker}");`], {
    type: "text/javascript",
  });
  const workerUrl = URL.createObjectURL(workerBlob);

  const worker = new Worker(workerUrl);
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);

  const conn = await db.connect();
  await conn.query(CREATE_TABLES_SQL);
  await conn.query(SEED_PEOPLE_SQL);
  await conn.query(SEED_CRIMES_SQL);
  await conn.close();

  return db;
}

export function getDb(): Promise<duckdb.AsyncDuckDB> {
  if (!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
}

function serializeValue(value: unknown): unknown {
  if (typeof value === "bigint") return Number(value);
  return value;
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const trimmed = sql.trim();
  if (!trimmed) {
    return { columns: [], rows: [], rowCount: 0, error: "Type a query before running it." };
  }

  if (!/^(select|with|describe|show|explain|summarize)\b/i.test(trimmed)) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      error: "Detectives read the evidence — they don't tamper with it. Stick to SELECT.",
    };
  }

  try {
    const db = await getDb();
    const conn = await db.connect();
    try {
      const arrowResult = await conn.query(trimmed);
      const columns = arrowResult.schema.fields.map((f) => f.name);
      const rows = arrowResult.toArray().map((row) => {
        const obj = row.toJSON() as Record<string, unknown>;
        const clean: Record<string, unknown> = {};
        for (const key of columns) {
          clean[key] = serializeValue(obj[key]);
        }
        return clean;
      });
      return { columns, rows, rowCount: rows.length };
    } finally {
      await conn.close();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error running query.";
    return { columns: [], rows: [], rowCount: 0, error: message };
  }
}
