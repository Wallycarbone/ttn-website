import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Parse JSON request bodies
app.use(express.json());

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ success: true, message: 'Thank you for your message!' });
});

app.post('/api/newsletter', (req, res) => {
  console.log('Newsletter signup:', req.body);
  res.json({ success: true, message: 'Thank you for subscribing!' });
});

app.post('/api/fact-check', (req, res) => {
  console.log('Fact check submission:', req.body);
  res.json({ success: true, message: 'Your fact check request has been received.' });
});

// Serve static files from the 'static' directory
const staticDir = path.join(__dirname, 'static');
const indexPath = path.join(staticDir, 'index.html');

// Log the paths for debugging
console.log('Static directory:', staticDir);
console.log('Index path:', indexPath);
console.log('Directory exists?', fs.existsSync(staticDir));
console.log('Index exists?', fs.existsSync(indexPath));

// Create a public directory for compatibility
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  try {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory:', publicDir);
  } catch (error) {
    console.error('Error creating public directory:', error);
  }
}

// First try to serve from static directory (our main content)
app.use(express.static(staticDir));

// Also serve from public directory as fallback
app.use(express.static(publicDir));

// Fallback route for SPA
app.get('*', (req, res) => {
  // Skip API routes in the fallback
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Send index.html for all other routes (SPA support)
  res.sendFile(indexPath);
});

// Important: Explicitly bind to 0.0.0.0 for Render
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
  
  // Log server details for debugging
  const address = server.address();
  console.log(`Server details: ${JSON.stringify(address)}`);
});

// Add proper error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});