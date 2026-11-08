import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { defaultSiteContent } from './src/data/defaultContent.ts';
import { SiteContent, Enquiry } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth-config.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize content file
function loadContent(): SiteContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading content file, falling back to defaults:', err);
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultSiteContent, null, 2), 'utf-8');
  return defaultSiteContent;
}

function saveContent(content: SiteContent) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

// Initialize enquiries file
function loadEnquiries(): Enquiry[] {
  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading enquiries file:', err);
  }
  const initialEnquiries: Enquiry[] = [
    {
      id: 'enq-101',
      fullName: 'Siddharth Rao',
      phone: '98868 22368',
      email: 'siddharth@example.com',
      fitnessGoal: 'Muscle Building & Hypertrophy',
      preferredProgram: 'Strength Training',
      message: 'Looking for evening 7 PM slots. Interested in 6-month package with personal training.',
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'enq-102',
      fullName: 'Priyanka Nair',
      phone: '76769 65555',
      email: 'priyanka.nair@example.com',
      fitnessGoal: 'Weight Loss & Fat Burn',
      preferredProgram: 'Weight Loss & Fat Burn',
      message: 'Need morning coach for weight loss guidance and posture correction.',
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Called and shared details over WhatsApp. Visiting gym this Saturday for trial.',
    },
  ];
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(initialEnquiries, null, 2), 'utf-8');
  return initialEnquiries;
}

function saveEnquiries(enquiries: Enquiry[]) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
}

// Initialize admin password
function getAdminPassword(): string {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      if (data.password) return data.password;
    }
  } catch {
    // ignore
  }
  const defaultPw = 'hrpro@2025';
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ password: defaultPw }, null, 2), 'utf-8');
  return defaultPw;
}

function setAdminPassword(newPw: string) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ password: newPw }, null, 2), 'utf-8');
}

// Body parsers with generous limits for uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// API ROUTES
app.get('/api/content', (_req, res) => {
  const content = loadContent();
  res.json({ success: true, content });
});

app.post('/api/content', (req, res) => {
  const updatedContent = req.body;
  if (!updatedContent || !updatedContent.businessInfo) {
    return res.status(400).json({ success: false, error: 'Invalid content data structure' });
  }
  saveContent(updatedContent);
  res.json({ success: true, message: 'Content saved successfully', content: updatedContent });
});

app.post('/api/reset-content', (_req, res) => {
  saveContent(defaultSiteContent);
  res.json({ success: true, message: 'Content reset to defaults', content: defaultSiteContent });
});

// Enquiries
app.get('/api/enquiries', (_req, res) => {
  const enquiries = loadEnquiries();
  res.json({ success: true, enquiries });
});

app.post('/api/enquiries', (req, res) => {
  const { fullName, phone, email, fitnessGoal, preferredProgram, message } = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ success: false, error: 'Name and Phone number are required' });
  }

  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    fullName: String(fullName).trim(),
    phone: String(phone).trim(),
    email: email ? String(email).trim() : undefined,
    fitnessGoal: fitnessGoal ? String(fitnessGoal).trim() : 'General Physical Fitness',
    preferredProgram: preferredProgram ? String(preferredProgram).trim() : 'Strength Training',
    message: message ? String(message).trim() : '',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const enquiries = loadEnquiries();
  enquiries.unshift(newEnquiry);
  saveEnquiries(enquiries);

  res.status(201).json({ success: true, message: 'Enquiry submitted successfully', enquiry: newEnquiry });
});

app.patch('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const enquiries = loadEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  if (status) enquiries[index].status = status;
  if (notes !== undefined) enquiries[index].notes = notes;

  saveEnquiries(enquiries);
  res.json({ success: true, enquiry: enquiries[index] });
});

app.delete('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  let enquiries = loadEnquiries();
  const beforeCount = enquiries.length;
  enquiries = enquiries.filter((e) => e.id !== id);

  if (enquiries.length === beforeCount) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  saveEnquiries(enquiries);
  res.json({ success: true, message: 'Enquiry deleted successfully' });
});

// Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const currentPw = getAdminPassword();

  if (password === currentPw) {
    // Generate a simple token
    const token = `hrpro_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return res.json({ success: true, token, message: 'Authenticated successfully' });
  }

  return res.status(401).json({ success: false, error: 'Invalid password. Default is hrpro@2025' });
});

app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const currentPw = getAdminPassword();

  if (currentPassword !== currentPw) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect' });
  }

  if (!newPassword || newPassword.length < 5) {
    return res.status(400).json({ success: false, error: 'New password must be at least 5 characters long' });
  }

  setAdminPassword(newPassword);
  res.json({ success: true, message: 'Password changed successfully' });
});

// File upload handler (stores base64 or saves locally)
app.post('/api/upload', (req, res) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ success: false, error: 'No image data provided' });
  }
  // The dataUrl is already a valid image data URI (or HTTPS URL) that can be rendered directly
  res.json({ success: true, url: dataUrl, filename });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in dev
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Static files in prod
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HR PRO FITNESS Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
