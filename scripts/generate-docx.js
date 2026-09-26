const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [new TextRun({ text, bold: true, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 28 })],
  });
}

function p(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
  });
}

function b(text) {
  return new TextRun({ text, bold: true, size: 22 });
}

function ul(lines) {
  return lines.map((line) => new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text: line, size: 21 })],
  }));
}

async function saveDoc(filePath, content) {
  const doc = new Document({
    sections: [{ properties: {}, children: content }],
  });

  await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, await Packer.toBuffer(doc));
}

async function createDoc1() {
  const content = [
    h1('CommonJS vs ES Modules — Beginner Explanation'),
    p('This file explains the difference between CommonJS and ES modules in simple, beginner-friendly language.'),
    h2('1) CommonJS'),
    p('CommonJS is the older style used by Node.js for a long time.'),
    p('Example:'),
    p('const Database = require("better-sqlite3");'),
    p('This means: "load the package and give me its exported value."'),
    p('A CommonJS package often exports one main thing.'),
    h2('2) ES Modules'),
    p('ES Modules are the modern JavaScript standard.'),
    p('Example:'),
    p('import Database from "better-sqlite3";'),
    p('This is modern syntax and is used heavily in TypeScript and modern Node apps.'),
    h2('3) Why does the .d.ts file use export = Database?'),
    p('This is a CommonJS-style export.'),
    p('It says: "This module exports one main thing, and its name is Database."'),
    p('That is why TypeScript allows the import to look like this:'),
    p('import Database from "better-sqlite3";'),
    p('The package may still be used with modern TypeScript syntax even though its underlying export style is old-school CommonJS.'),
    h2('4) In plain English'),
    p('CommonJS = older style, one main exported value.'),
    p('ES modules = modern style, imports/exports with explicit names.'),
    p('A library can be written one way but imported in another style depending on tooling.'),
    h2('5) Simple takeaway'),
    p('Module = a reusable code unit.'),
    p('Library = a package made of modules that solves a problem.'),
    p('CommonJS and ES modules are just two ways of exposing/importing that code.'),
    p('This is why a package like better-sqlite3 can still be imported as default in TypeScript.'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'commonjs-vs-esmodules.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, await Packer.toBuffer(doc));
}

async function createDoc2() {
  const content = [
    h1('What is a .d.ts File?'),
    p('A .d.ts file is a TypeScript declaration file.'),
    p('It does not contain the real logic of a library. It only tells TypeScript what exists.'),
    h2('1) What does declare mean?'),
    p('declare means: "This thing exists at runtime, and here is its type."'),
    p('Example:'),
    p('declare class Database { ... }'),
    p('This tells TypeScript: there is a class called Database, and it has certain methods.'),
    h2('2) What is an interface?'),
    p('An interface describes the shape of an object.'),
    p('Example:'),
    p('interface User { id: number; name: string; }'),
    p('This means a User object must have id and name.'),
    h2('3) What is a namespace?'),
    p('A namespace groups related types together.'),
    p('Example:'),
    p('declare namespace DemoStore { interface User {} }'),
    p('This keeps related things organized.'),
    h2('4) What does export = Database mean?'),
    p('It means the module exports one main thing called Database.'),
    p('This is very common in Node.js libraries.'),
    p('So the import looks like:'),
    p('import Database from "some-package";'),
    h2('5) Why is this useful?'),
    p('Without .d.ts files, TypeScript would not know the methods or parameters of libraries.'),
    p('The editor would not give proper autocompletion or type-checking.'),
    p('So .d.ts files are like a library blueprint.'),
    h2('6) Very short summary'),
    p('d.ts file = type blueprint'),
    p('interface = object structure'),
    p('declare class = runtime class exists'),
    p('namespace = group related types'),
    p('export = Database = one main thing is exported'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'dts-beginner-guide.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, await Packer.toBuffer(doc));
}

async function createDoc3() {
  const content = [
    h1('PAPSS Legal Review and Project Mode: What to Expect'),
    p('This document explains the practical expectations during legal review and the project phase after the agreement is accepted.'),
    h2('1) What to expect during the legal review Teams call'),
    p('This is not a technical build meeting. It is a risk and commercial review.'),
    p('The goal is to confirm the agreement protects the business, the technical integration, the data, and the operational responsibilities.'),
    ...ul([
      'Commercial scope and responsibilities',
      'Data privacy and confidentiality',
      'Security and API access controls',
      'Regulatory, AML, KYC, and audit rules',
      'Liability, indemnities, and termination clauses',
      'Support, uptime commitments, and escalation process',
      'Project governance and approval paths',
    ]),
    p('You should ask practical questions like:'),
    ...ul([
      'What data will be exchanged between us and PAPSS?',
      'What API access will we receive, and when?',
      'Who owns the sandbox credentials and production credentials?',
      'What are the uptime, support, and incident response expectations?',
      'What happens if the API changes or a transaction fails?',
      'Who must approve changes to scope, timelines, or architecture?',
    ]),
    p('If PAPSS has not published public API documentation, the legal review is also the point where you confirm whether the docs will be shared under NDA, under contract, or through a technical onboarding process.'),
    h2('2) If legal review is accepted and the handshake is complete, what to drive in project mode'),
    p('This is the implementation phase. The contract is no longer the only focus; the real work starts.'),
    p('You should drive the project toward a working payment integration.'),
    ...ul([
      'Finalize the exact payment use cases and scope',
      'Obtain API documentation, sandbox access, credentials, and sample payloads',
      'Define architecture and integration flow',
      'Map request and response fields',
      'Design callback handling and verification logic',
      'Define transaction states, retries, idempotency, and failure handling',
      'Create a sandbox test plan and a UAT checklist',
      'Prepare production readiness, cutover, monitoring, and hypercare',
    ]),
    h2('3) Your role in project mode'),
    p('As a Digital Channels Payment Specialist, your role is to bridge the agreement and the implementation.'),
    p('You are expected to help drive:'),
    ...ul([
      'Requirements clarification',
      'API onboarding and onboarding questions',
      'Technical design review',
      'Transaction testing in sandbox',
      'Reconciliation logic and validation',
      'Go-live readiness',
      'Operational support and incident handling',
    ]),
    h2('4) Short summary'),
    p('Legal review = confirm whether the deal is safe, compliant, and workable.'),
    p('Project mode = turn the agreement into a live working payment flow.'),
    p('The handshake is the green light to start implementation, not the end of the work.'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'papss-legal-review-project-mode.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, await Packer.toBuffer(doc));
}

(async () => {
  await createDoc1();
  await createDoc2();
  await createDoc3();
  console.log('DOCX files created in docs folder.');
})();
