import Database from 'better-sqlite3'; //This is to import the better-sqlite3 library, which is a wrapper around SQLite that provides a simple and efficient way to interact with SQLite databases in Node.js applications. It allows you to perform database operations such as creating tables, inserting data, querying data, and managing transactions.

import path from 'path';//This is to import the path module from Node.js, which provides utilities for working with file and directory paths. It allows you to manipulate file paths in a way that is compatible across different operating systems.

export class DatabaseService { private db: Database.Database; //This line declares a private property named db of type Database. This property will hold the instance of the database connection created using the better-sqlite3 library.
    constructor(){this.db = new Database(path.join(__dirname,'../../payments.db')); this.initialize()}//Create and open database
    private initialize(): void{this.db.exec(`CREATE TABLE IF NOT EXISTS payments(id INTEGER PRIMARY KEY AUTOINCREMENT, phone TEXT NOT NULL, amount REAL NOT NULL, reference TEXT, transaction_id TEXT, status TEXT DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)}//This method initializes/opens/creates the database by executing a SQL command to create a table named payments if it does not already exist. The table has columns for id, phone, amount, reference, transaction_id, status, and created_at. The id column is an auto-incrementing primary key, and the created_at column defaults to the current timestamp when a new record is inserted.
    
    savePayment(data: any): void{const stmt = this.db.prepare(`INSERT INTO payments(phone, amount, reference, transaction_id, status) VALUES(?,?,?,?,?)`);//This method saves a payment record to the payments table. It takes an object data as a parameter, which contains the payment details. The method prepares an SQL statement to insert the payment data into the table and then executes the statement with the provided values. The status is set to 'pending' by default when a new payment record is inserted.
        stmt.run(data.phone, data.amount, data.reference, data.transactionId, 'pending');
    }

    getAllPayments(): any[]{return this.db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all()}//This method retrieves all payment records from the payments table. It prepares an SQL statement to select all records and orders them by the created_at column in descending order (most recent first). The method then executes the statement and returns the result as an array of payment records.

    updateStatus(transactionId:string, status:string):void{this.db.prepare('UPDATE payments SET status = ? WHERE transaction_id = ?').run(status, transactionId)}//This method updates the status of a payment record in the payments table. It takes two parameters: transactionId (the unique identifier of the payment) and status (the new status to be set). The method prepares an SQL statement to update the status of the payment record with the specified transactionId and then executes the statement with the provided values.

}