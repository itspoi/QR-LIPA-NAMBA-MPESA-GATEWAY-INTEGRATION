const fs = require('fs');
const path = require('path');
const {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} = require('docx');

const content = [];

function title(text) {
  content.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [new TextRun({ text, bold: true, size: 34, color: '17324D' })],
    spacing: { after: 220 },
  }));
}

function heading(text) {
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 27, color: '176B68' })],
    spacing: { before: 260, after: 120 },
  }));
}

function subheading(text) {
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 23, color: '17324D' })],
    spacing: { before: 180, after: 80 },
  }));
}

function paragraph(text, options = {}) {
  content.push(new Paragraph({
    children: [new TextRun({ text, size: 21, bold: options.bold || false })],
    spacing: { after: 110 },
  }));
}

function bullet(text) {
  content.push(new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 20 })],
    spacing: { after: 65 },
  }));
}

function code(text) {
  for (const line of text.split('\n')) {
    content.push(new Paragraph({
      children: [new TextRun({ text: line || ' ', font: 'Consolas', size: 18, color: '243746' })],
      indent: { left: 360 },
      spacing: { after: 20 },
    }));
  }
  content.push(new Paragraph({ spacing: { after: 90 } }));
}

title('From Types to Services to index.ts');
paragraph('A project-specific guide to imports, dependency direction, and the order a TypeScript/Express application starts.', { bold: true });
paragraph('The short version: types describe data, services do work, routes translate HTTP requests into service calls, and the entry point assembles the application. That is a useful layering convention, not a law that every project must follow exactly.');

heading('1. The project’s dependency map');
paragraph('An import arrow points from the file that needs something to the file it depends on. Read the diagram as “A imports B.”');
code('src/types/payment.ts\n        ^                 ^\n        |                 |\nsrc/services/mpesa.ts    src/routes/payments.ts\n        ^                 ^       ^\n        |                 |       |\n        +-----------------+       +-- src/services/qr.ts\n                  ^                       ^\n                  |                       |\nsrc/routes/payments.ts              src/routes/qr.ts\n                  \                       /\n                   \                     /\n                    +---- src/index.ts --+\n                          |          |\n                          |          +-- src/services/database.ts\n                          +-- middleware/validation.ts (imported)');
paragraph('In ordinary terms: the payment types are shared contracts; M-Pesa and QR services implement work; route modules call those services; index.ts is the composition root that brings the pieces together. The database service is currently created directly by index.ts.');

heading('2. What each layer owns');
subheading('Types: describe the shape of data');
paragraph('src/types/payment.ts defines PaymentRequest and PaymentResponse. Interfaces and type aliases are primarily for TypeScript checking; they do not create runtime objects or start work. A type can be imported with import type to make that intent explicit.');
code("import type { PaymentResponse } from '../types/payment';");
paragraph('Keep shared contracts low in the dependency graph. A type file should not need to import a route or a service, or the “foundation” would depend on the layers built above it.');

subheading('Services: perform application work');
paragraph('src/services/qr.ts generates QR images. src/services/mpesa.ts handles payment-provider work and uses PaymentResponse. src/services/database.ts owns SQLite operations. Services should express useful operations without deciding HTTP status codes or Express route paths.');
paragraph('Service-to-service dependencies can be valid, but avoid cycles. If two services need each other, move the shared contract or coordination into a lower-level abstraction or a higher-level orchestrator.');

subheading('Middleware: run reusable request steps');
paragraph('src/middleware/validation.ts checks request data and either returns an error or calls next(). Middleware is normally attached to a route or router. In this project it is imported in index.ts but is not currently attached to a route, so the payment validation does not run.');

subheading('Routes: translate HTTP into application calls');
paragraph('src/routes/payments.ts and src/routes/qr.ts define endpoints. A route reads request data, calls a service, and writes an HTTP response. Routes import services because the route needs their operations; services should not import routes.');

subheading('Entry point: assemble and start');
paragraph('src/index.ts is the top-level wiring location: load configuration, create the app and shared resources, install middleware, mount routers, define top-level endpoints, then listen on a port. It should coordinate layers rather than contain payment or QR business logic.');

heading('3. Why this order is common');
paragraph('The order is guided by dependency direction and responsibility. Lower-level pieces are more reusable; higher-level pieces know about more of the application.');
bullet('Types/contracts first: many parts can depend on a stable description of data without depending on each other.');
bullet('Services next: they implement operations using libraries, configuration, and data contracts.');
bullet('Middleware and routes above services: middleware handles cross-cutting request checks; routes compose request handling with service calls.');
bullet('The entry point last: it knows which concrete parts to connect and how the process starts.');
paragraph('This is a dependency-design order, not a requirement to physically write files in that sequence. The key rule is that dependencies generally point inward/downward toward stable, reusable code, not back toward the entry point or HTTP layer.');

heading('4. Import order is not startup order');
paragraph('A static import declares a module dependency. JavaScript loads and evaluates imported modules before running the importing module’s body. Therefore, putting dotenv.config() below static imports in index.ts does not guarantee it runs before those imported modules execute.');
paragraph('This matters here: routes/payments.ts constructs MpesaService at module scope. The service constructor reads process.env. Since index.ts calls dotenv.config() only in its body, that service can be constructed before the .env values are loaded, and it may keep empty/default credentials.');
paragraph('A common small fix is to load dotenv as the first side-effect import:');
code("import 'dotenv/config';\nimport express from 'express';\nimport paymentsRoutes from './routes/payments';");
paragraph('A stronger composition pattern is to avoid creating configured services during module import. Load configuration first, create services in a bootstrap function, and pass dependencies into route factories. That makes order explicit and testing easier.');

heading('5. A conventional runtime sequence');
paragraph('For an HTTP server, a typical startup sequence is:');
code('1. Load environment configuration\n2. Validate required configuration\n3. Create shared resources (database, clients, services)\n4. Create the Express app\n5. Install global middleware (CORS, JSON parsing, logging)\n6. Attach route-specific middleware and mount routers\n7. Attach not-found and error handlers\n8. Start listening');
paragraph('Some steps can move: for example, the database may be created before or after the Express app. What matters is that a dependency exists before code uses it, request middleware is registered before the routes it should affect, and listening happens after the app has been assembled.');

heading('6. Example bootstrap shape');
paragraph('This example shows explicit construction and dependency passing. It is a teaching pattern; adopting it would require converting the current exported routers into router factory functions.');
code("import 'dotenv/config';\nimport express from 'express';\nimport cors from 'cors';\nimport { DatabaseService } from './services/database';\nimport { MpesaService } from './services/mpesa';\nimport { QRService } from './services/qr';\nimport { createPaymentRouter } from './routes/payments';\nimport { createQrRouter } from './routes/qr';\n\nconst app = express();\nconst db = new DatabaseService();\nconst mpesa = new MpesaService();\nconst qr = new QRService();\n\napp.use(cors());\napp.use(express.json());\napp.use('/api/payments', createPaymentRouter({ mpesa, qr, db }));\napp.use('/api/qr', createQrRouter({ qr }));\n\nconst port = Number(process.env.PORT ?? 3000);\napp.listen(port, () => console.log(`Server runs on ${port}`));");

heading('7. What the current index.ts does');
paragraph('The current file imports both route modules, the database service, and validatePayment, then calls dotenv.config() and creates the Express app. The ordering has two practical problems to keep in view:');
bullet('The payment router creates MpesaService while that router module is being evaluated, before the dotenv.config() call in index.ts runs.');
bullet('app.listen() is currently inside the GET /api/payments callback because the route block is not closed before the listener. As written, the server does not begin listening during normal startup; the listener is attempted only after that endpoint is requested.');
bullet('The health route path is written as health rather than /health, and validatePayment is imported but not attached. These are current wiring details, separate from the general layer pattern.');
paragraph('So the architecture idea is sound as a learning path, but the entry point still needs to finish the startup wiring. Keep the listener at the outer bootstrap level, after routes are registered.');

heading('8. A compact mental model');
code('Types say what data looks like.\nServices do the work.\nMiddleware checks or enriches requests.\nRoutes expose service operations over HTTP.\nindex.ts connects everything and starts the process.');
paragraph('When tracing a new feature, follow the request inward: index.ts mounts a route, the route calls a service, and the service uses its types and external tools. When building the feature, start with the contract if it clarifies the data, implement the operation, expose it through a route, then wire and start it from the entry point.');

async function main() {
  const outputPath = path.join(__dirname, '..', 'docs', 'imports-services-types-startup-guide.docx');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const document = new Document({
    creator: 'QR Lipa Gateway project guide',
    title: 'From Types to Services to index.ts',
    description: 'Project-specific guide to imports, dependency direction, and startup order.',
    sections: [{ properties: {}, children: content }],
  });
  fs.writeFileSync(outputPath, await Packer.toBuffer(document));
  console.log(`Created ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});