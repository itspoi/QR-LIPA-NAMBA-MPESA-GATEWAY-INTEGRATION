// ==========================================================
// Beginner-friendly example of a .d.ts declaration file
// ==========================================================
// This file is NOT the real implementation.
// It is only a TypeScript "blueprint" that tells the compiler:
// - what names exist
// - what methods they have
// - what arguments they accept
// - what they return
//
// Think of it like a library's manual written in TypeScript.
//
// This pattern is very similar to the structure you saw in
// node_modules/@types/better-sqlite3/index.d.ts
// ==========================================================

// This line says: "We are creating a namespace called DemoDB."
// A namespace groups related types together so they are organized.
// Example: DemoDB.Database, DemoDB.Statement, DemoDB.RunResult
//
declare namespace DemoDB {

    // This interface describes the result of a SQL run operation.
    // It says: when a query runs, it returns an object with these properties.
    interface RunResult {
        changes: number;        // how many rows changed
        lastInsertRowid: number; // the id of the last row inserted
    }

    // This interface describes a prepared SQL statement.
    // The generic type <BindParameters, Result> means:
    // - BindParameters = the parameters that will be passed into the query
    // - Result = the type of row/object returned by the query
    interface Statement<BindParameters extends unknown[], Result = unknown> {
        database: Database; // this statement belongs to a Database object
        source: string;     // the SQL string used to create this statement

        // run(...) executes the SQL and returns a result summary
        run(...params: BindParameters): RunResult;

        // get(...) returns one matching row, or undefined if nothing is found
        get(...params: BindParameters): Result | undefined;

        // all(...) returns an array of matching rows
        all(...params: BindParameters): Result[];
    }

    // This interface describes the main database object.
    // It tells TypeScript the methods and fields that the Database has.
    interface Database {
        memory: boolean;       // true if this database lives in memory
        readonly: boolean;     // true if the database is read-only
        name: string;          // file name or database name
        open: boolean;         // true if the database is open

        // prepare(...) creates a SQL statement that can later be executed.
        // It takes SQL text and returns a Statement object.
        prepare<BindParameters extends unknown[] = unknown[], Result = unknown>(
            source: string,
        ): Statement<BindParameters, Result>;

        // exec(...) runs SQL that does not return rows, like CREATE TABLE.
        exec(source: string): this;

        // close() closes the database connection.
        close(): this;
    }
}

// This line says: "At runtime, there is a class/constructor called Database."
// It is not the full implementation, just the shape TypeScript should expect.
//
// IMPORTANT: This is similar to the real better-sqlite3 pattern:
// const db = new Database('example.db');
declare class Database {
    // Constructor: creates a new database connection.
    // The filename is optional. If not provided, it may use an in-memory database.
    constructor(filename?: string);

    // This matches the behavior described in the namespace interface.
    prepare<BindParameters extends unknown[] = unknown[], Result = unknown>(
        source: string,
    ): DemoDB.Statement<BindParameters, Result>;

    exec(source: string): this;
    close(): this;
}

// This line is VERY important.
// It says: "The module exports a single main thing: Database."
// This is CommonJS-style export syntax, which is common in Node libraries.
//
// In JavaScript/TypeScript, this is the pattern used by packages like:
// import Database from 'better-sqlite3';
//
// So when you import it, you get the Database object directly.
export = Database;

// ==========================================================
// Example usage (this is NOT part of the .d.ts file itself)
// ==========================================================
//
// import Database from './example-library';
//
// const db = new Database('demo.db');
//
// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY,
//     name TEXT
//   )
// `);
//
// const insert = db.prepare('INSERT INTO users (name) VALUES (?)');
// insert.run('Alice');
//
// const getUser = db.prepare('SELECT * FROM users WHERE name = ?');
// const row = getUser.get('Alice');
//
// console.log(row);
//
// db.close();
// ==========================================================
