const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

function h1(text) { return new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text, bold: true, size: 30 })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true, size: 24 })] }); }
function p(text) { return new Paragraph({ children: [new TextRun({ text, size: 22 })] }); }
function list(lines) { return lines.map(line => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: line, size: 21 })] })); }

async function createExecutiveLegal() {
  const content = [
    h1('PAPSS Legal Review Checklist - Executive Summary'),
    p('Purpose: confirm that the commercial, legal, and technical framework is workable before moving into project implementation.'),
    h2('1. Commercial / Scope'),
    ...list([
      'Confirm the exact scope of services, payment flows, and business use cases.',
      'Define milestones, deliverables, and acceptance criteria.',
      'Review fees, payment terms, and responsibilities of each party.',
      'Confirm change-control process for scope or timeline changes.',
    ]),
    h2('2. Data and Privacy'),
    ...list([
      'Identify what data will be exchanged between parties.',
      'Review data storage, transfer, retention, and deletion rules.',
      'Confirm confidentiality obligations and prohibited disclosures.',
    ]),
    h2('3. Security and Access'),
    ...list([
      'Review API access model, credentials, and environment controls.',
      'Confirm secure handling of keys, tokens, certificates, and webhooks.',
      'Define incident reporting and escalation procedures.',
    ]),
    h2('4. Compliance and Risk'),
    ...list([
      'Review KYC, AML, sanctions, and regulatory obligations.',
      'Check audit rights, reporting duties, and compliance support.',
      'Review indemnity, limitation of liability, and termination provisions.',
    ]),
    h2('5. Technical Dependencies'),
    ...list([
      'Confirm when API documentation and onboarding details will be shared.',
      'Confirm support expectations, response times, and Uptime/SLAs.',
      'Clarify how API changes and versioning are communicated.',
    ]),
    h2('Decision Gate'),
    p('If all items are acceptable, proceed to project mode. If not, document required changes before implementation begins.'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'papss-legal-review-checklist-executive.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
}

async function createExecutiveProject() {
  const content = [
    h1('PAPSS Project-Mode Implementation Checklist - Executive Summary'),
    p('Purpose: move from legal agreement to a live, tested, and governed payment integration.'),
    h2('1. Requirements and Scope'),
    ...list([
      'Confirm the exact payment flows and business use cases in scope.',
      'Define success, failure, reversal, timeout, and reconciliation behavior.',
      'Document expected volumes and operational assumptions.',
    ]),
    h2('2. Onboarding and API Access'),
    ...list([
      'Obtain API documentation, sandbox credentials, and sample payloads.',
      'Confirm production access process and environment readiness.',
      'Validate auth method, signatures, and callback URL requirements.',
    ]),
    h2('3. Integration Design'),
    ...list([
      'Map end-to-end flow from request to callback to reconciliation.',
      'Define transaction state model and retry/idempotency logic.',
      'Confirm internal data model and reporting requirements.',
    ]),
    h2('4. Security and Operations'),
    ...list([
      'Manage secrets securely and restrict access to authorized teams.',
      'Validate callback authenticity and define alerting rules.',
      'Set up logging, monitoring, and issue escalation routes.',
    ]),
    h2('5. Testing and Acceptance'),
    ...list([
      'Run sandbox tests for successful and failed transactions.',
      'Test duplicates, retries, timeouts, and mismatch scenarios.',
      'Complete UAT and obtain business approval before go-live.',
    ]),
    h2('6. Go-Live and Support'),
    ...list([
      'Finalise production configuration and cutover plan.',
      'Confirm hypercare support, monitoring, and rollback path.',
      'Review daily reconciliation and operational readiness after launch.',
    ]),
    h2('Final Goal'),
    p('The project is ready when the integration is secure, tested, reconciles correctly, and is supported by clear operational ownership.'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'papss-project-mode-checklist-executive.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
}

(async () => {
  await createExecutiveLegal();
  await createExecutiveProject();
  console.log('Generated executive PAPSS checklist documents.');
})();
