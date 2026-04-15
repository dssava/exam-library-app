import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const MIN_OWNER_LENGTH = 3;
const MIN_DOMAIN_LENGTH = 4;

const domains = [
  {
    id: 1,
    domain: 'example.com',
    owner: 'Open Web',
    expiresAt: '2026-12-01',
  },
  {
    id: 2,
    domain: 'my-startup.dev',
    owner: 'Startup Lab',
    expiresAt: '2026-08-15',
  },
];

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  }),
);
app.use(express.json());

function validateDomainPayload(payload) {
  const errors = [];

  if (typeof payload.domain !== 'string' || payload.domain.trim().length < MIN_DOMAIN_LENGTH) {
    errors.push(`Поле domain повинно бути рядком не менше ${MIN_DOMAIN_LENGTH} символів.`);
  }

  if (typeof payload.owner !== 'string' || payload.owner.trim().length < MIN_OWNER_LENGTH) {
    errors.push(`Поле owner повинно бути рядком не менше ${MIN_OWNER_LENGTH} символів.`);
  }

  if (typeof payload.expiresAt !== 'string' || Number.isNaN(Date.parse(payload.expiresAt))) {
    errors.push('Поле expiresAt повинно містити коректну дату.');
  }

  return errors;
}

app.get('/api/domains', (_request, response) => {
  response.json(domains);
});

app.post('/api/domains', (request, response) => {
  const errors = validateDomainPayload(request.body);

  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  const newDomain = {
    id: domains.length + 1,
    domain: request.body.domain.trim(),
    owner: request.body.owner.trim(),
    expiresAt: request.body.expiresAt,
  };

  domains.push(newDomain);

  return response.status(201).json(newDomain);
});

app.listen(PORT, () => {
  console.log(`Domain server listening on http://localhost:${PORT}`);
});
