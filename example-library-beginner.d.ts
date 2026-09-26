// ============================================================
// VERY SIMPLE BEGINNER VERSION OF A .d.ts FILE
// ============================================================
// This file is NOT the real code.
// It only tells TypeScript: "This is what the library looks like."
//
// Think of it like a library instruction manual.
//
// If you see a real package like better-sqlite3, its .d.ts file
// works the same way: it describes the API without showing the real logic.
// ============================================================

// ------------------------------------------------------------
// 1) A namespace groups related things together.
// ------------------------------------------------------------
// Example: DemoStore.Database, DemoStore.User
//
// This is just a container. It makes things organized.
declare namespace DemoStore {

    // --------------------------------------------------------
    // 2) An interface describes an object shape.
    // --------------------------------------------------------
    // Example: a user must have a name and age.
    interface User {
        id: number;
        name: string;
        age: number;
    }

    // Another object shape: a database connection.
    interface Database {
        // property: this database has a name
        name: string;

        // method: connect to database
        connect(): void;

        // method: save a user
        save(user: User): void;

        // method: get one user by id
        getById(id: number): User | undefined;
    }
}

// ------------------------------------------------------------
// 3) A class is a real runtime thing that exists.
// ------------------------------------------------------------
// In a .d.ts file, declare class means:
// "There is a class named Database at runtime, and here is its shape."
declare class Database {
    // constructor: this is the function called when you do:
    // const db = new Database("mydb.db");
    constructor(filename?: string);

    // method: connect to the database
    connect(): void;

    // method: save a user
    save(user: DemoStore.User): void;

    // method: fetch one user by id
    getById(id: number): DemoStore.User | undefined;
}

// ------------------------------------------------------------
// 4) export = Database means:
// ------------------------------------------------------------
// "This module exports one main thing called Database."
//
// This is the common Node.js/CommonJS pattern used by many libraries.
//
// Example import:
// import Database from 'some-package';
//
// This is similar to better-sqlite3:
// import Database from 'better-sqlite3';
export = Database;

// ============================================================
// SIMPLE EXAMPLE OF HOW THIS IS USED
// ============================================================
//
// import Database from './example-library-beginner';
//
// const db = new Database('app.db');
// db.connect();
//
// const user = {
//   id: 1,
//   name: 'Alice',
//   age: 25,
// };
//
// db.save(user);
// const result = db.getById(1);
// console.log(result);
//
// ============================================================
// QUIZ VERSION - MULTIPLE CHOICE
// ============================================================
// 1) What is a .d.ts file?
//    A) Real runtime code
//    B) TypeScript type description
//    C) HTML file
//    D) CSS file
//
//    Answer: B
//
// 2) What does `interface User` do?
//    A) Creates a real database query
//    B) Describes the shape of an object
//    C) Runs code
//    D) Deletes files
//
//    Answer: B
//
// 3) What does `export = Database` mean?
//    A) This file is empty
//    B) The module exports one main thing called Database
//    C) Database is a CSS class
//    D) It is only a comment
//
//    Answer: B
//
// 4) Why do we use `declare class Database`?
//    A) To hide the class
//    B) To say a runtime class exists and tell TypeScript its shape
//    C) To make the class private
//    D) To delete the class
//
//    Answer: B
//
// 5) What does `namespace DemoStore` do?
//    A) It creates a database connection
//    B) It groups related types together
//    C) It compiles the code
//    D) It changes the runtime behavior
//
//    Answer: B
//
// ============================================================
// VERY SHORT SUMMARY
// ============================================================
// .d.ts file = type blueprint
// interface = object structure
// declare class = runtime class exists
// namespace = groups related types
// export = Database = one main thing is exported
//
// This is the same pattern many Node.js libraries use.
// ============================================================
