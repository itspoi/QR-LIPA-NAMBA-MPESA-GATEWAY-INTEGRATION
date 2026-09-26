const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

function h1(text) { return new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text, bold: true, size: 30 })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true, size: 24 })] }); }
function p(text) { return new Paragraph({ children: [new TextRun({ text, size: 22 })] }); }
function b(text) { return new TextRun({ text, bold: true, size: 22 }); }
function list(lines) { return lines.map(line => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: line, size: 21 })] })); }

async function createLegalChecklist() {
  const content = [
    h1('PAPSS Legal Review Checklist'),
    p('Use this list during the contract/legal review stage before project execution begins.'),
    h2('A. Commercial and Scope'),
    ...list([
      'Confirm the exact scope of services and payment flows covered by the agreement.',
      'Confirm whether the project includes onboarding, integration, testing, go-live, and support.',
      'Define implementation phases, milestones, and acceptance criteria.',
      'Verify fees, payment terms, cost-sharing model, and any one-time setup costs.',
      'Clarify ownership of any custom development, integration assets, and documentation.',
      'Confirm whether changes in scope require formal change control or approval.',
    ]),
    h2('B. Data Privacy and Confidentiality'),
    ...list([
      'Confirm what customer or payment data will be exchanged between parties.',
      'Confirm where data will be processed, stored, and backed up.',
      'Review confidentiality obligations and permitted disclosures.',
      'Confirm retention, deletion, and archival requirements for transaction data.',
      'Check if any personal, financial, or regulated data is involved and how it is protected.',
      'Verify whether there are any restrictions on sharing technical documents or credentials.',
    ]),
    h2('C. Security and Access'),
    ...list([
      'Review API access model, credentials, and environment separation.',
      'Confirm how secrets, certificates, and keys are managed.',
      'Confirm whether access is restricted to a test environment first and production later.',
      'Review requirements for secure communication, TLS, webhook validation, and token handling.',
      'Define breach notification timelines and incident escalation obligations.',
    ]),
    h2('D. Regulatory and Compliance'),
    ...list([
      'Confirm regulatory obligations relevant to payment processing and cross-border settlements.',
      'Review KYC, AML, sanctions, and transaction-monitoring obligations.',
      'Confirm reporting and audit obligations for both parties.',
      'Verify whether local compliance rules, data laws, or licensing requirements apply.',
      'Check whether the parties have rights to request compliance records or audit logs.',
    ]),
    h2('E. API and Technical Dependency'),
    ...list([
      'Confirm timing and method for receiving API documentation and technical onboarding materials.',
      'Clarify whether API documentation will be provided under NDA or controlled access.',
      'Review support availability for technical onboarding and issue resolution.',
      'Confirm whether there are SLAs, response times, or uptime commitments.',
      'Clarify how API versioning, deprecations, and change notices will be handled.',
      'Review responsibilities for testing environments, bug fixing, and rollout windows.',
    ]),
    h2('F. Risk and Liability'),
    ...list([
      'Review limitation of liability, exclusions, and caps.',
      'Check indemnity obligations for third-party claims or failures.',
      'Confirm warranty, service-credit, or remediation provisions.',
      'Review termination rights, exit obligations, and transition support.',
      'Confirm how disputes, escalations, and governing law are handled.',
    ]),
    h2('G. Questions to Ask on the Call'),
    ...list([
      'What customer, transaction, and payment data will be exchanged?',
      'What exact API access will we receive, and when?',
      'Who owns production and sandbox credentials?',
      'What are the support and incident response commitments?',
      'What happens if the API changes or a payment flow is not supported?',
      'Who approves project scope changes and technical exceptions?',
      'What is the process for onboarding, testing, and go-live approval?',
    ]),
    h2('H. Legal Review Outcome'),
    p('If accepted, proceed to project mode with a signed agreement and a technical onboarding plan.'),
    p('If not accepted, record red flags, required changes, and unresolved issues before technical implementation begins.'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'papss-legal-review-checklist.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
}

async function createProjectChecklist() {
  const content = [
    h1('PAPSS Project-Mode Implementation Checklist'),
    p('Use this checklist after legal review is accepted and the project moves into implementation.'),
    h2('1. Scope and Requirements'),
    ...list([
      'Confirm the exact payment use cases, corridors, and transaction types in scope.',
      'Define business flows: payout, collection, QR payment, callback handling, reconciliation, and refunds.',
      'Document expected transaction volume, success rates, time windows, and operational assumptions.',
      'Clarify business exceptions, failed-payment cases, and retry logic.',
      'Confirm the required customer experience and internal status updates.',
    ]),
    h2('2. API Onboarding and Access'),
    ...list([
      'Request official API documentation, version details, and sample payloads.',
      'Get sandbox credentials, test environment access, and callback URL guidance.',
      'Confirm production credentials process and rollout approval requirements.',
      'Confirm all required headers, signatures, auth methods, and security rules.',
      'Establish the onboarding schedule with PAPSS and internal teams.',
    ]),
    h2('3. Integration Design'),
    ...list([
      'Document the end-to-end payment flow from request to callback to reconciliation.',
      'Create sequence diagrams for request initiation, callback handling, and status updates.',
      'Map all request and response fields to internal application models.',
      'Define transaction state machine: initiated, pending, successful, failed, reversed, expired.',
      'Define idempotency strategy to prevent duplicate processing.',
      'Define retry, timeout, and circuit-breaker handling for failed calls.',
    ]),
    h2('4. Security and Operations'),
    ...list([
      'Store production secrets securely and restrict access to authorized teams only.',
      'Validate callback source and verify signature or checksum rules.',
      'Protect internal endpoints with proper network and authentication controls.',
      'Define logging, monitoring, and audit trail requirements for all payment events.',
      'Set up alerts for failed transactions, timeouts, webhook delays, and API errors.',
      'Define incident escalation path and support contact process.',
    ]),
    h2('5. Sandbox Testing'),
    ...list([
      'Run happy-path payment scenarios in sandbox.',
      'Test unsuccessful transactions and failure responses.',
      'Test duplicate callback handling and duplicate transaction submissions.',
      'Test retry behavior when network calls fail or time out.',
      'Test transaction reversal and reconciliation mismatch scenarios.',
      'Validate successful callback mapping to internal payment records.',
      'Prepare a test evidence pack and issue log for approval.',
    ]),
    h2('6. UAT and Acceptance'),
    ...list([
      'Perform user acceptance testing with business stakeholders.',
      'Verify customer-facing status messages and merchant experience.',
      'Review reconciliation outputs against expected financial results.',
      'Document defects, approvals, and business sign-off requirements.',
      'Confirm that all critical issues are resolved before production move.',
    ]),
    h2('7. Production Readiness and Go-Live'),
    ...list([
      'Finalise production credentials and secure environment configuration.',
      'Confirm final cutover date, rollback plan, and hypercare support window.',
      'Review monitoring dashboards and operational responsibilities.',
      'Prepare a runbook for support and incident handling.',
      'Perform final production readiness review and sign-off.',
    ]),
    h2('8. Post-Go-Live'),
    ...list([
      'Monitor transaction success/failure rates and callback performance.',
      'Review daily reconciliation and flag anomalies quickly.',
      'Track user issues, fixes, and enhancement requests.',
      'Schedule review meetings with PAPSS and internal teams.',
      'Document lessons learned and improvement actions for the next phase.',
    ]),
    h2('Core Delivery Questions'),
    ...list([
      'Do we have all required API documentation and sandbox access?',
      'Have we mapped all payment states and callback logic?',
      'Are we able to test duplicates, retries, and reversal cases?',
      'Who owns monitoring and incident response after go-live?',
      'Are reconciliation and audit trails in place?',
      'Do we have production readiness sign-off before launch?',
    ]),
    h2('Final Outcome'),
    p('Project mode is complete when the integration is fully tested, reconciles correctly, supports business workflows, and is ready for secure production use with monitoring and support in place.'),
  ];

  const filePath = path.join(__dirname, '..', 'docs', 'papss-project-mode-checklist.docx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new Document({ sections: [{ properties: {}, children: content }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
}

(async () => {
  await createLegalChecklist();
  await createProjectChecklist();
  console.log('Generated PAPSS checklists.');
})();
