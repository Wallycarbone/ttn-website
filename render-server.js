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

// Define directories and paths
const staticDir = path.join(__dirname, 'static');
const publicDir = path.join(__dirname, 'public');
let indexPath = path.join(staticDir, 'index.html');

// Log the paths for debugging
console.log('Static directory:', staticDir);
console.log('Static directory exists?', fs.existsSync(staticDir));

try {
  // List all files in static directory for debugging
  if (fs.existsSync(staticDir)) {
    console.log('Files in static directory:');
    const files = fs.readdirSync(staticDir);
    files.forEach(file => {
      const filePath = path.join(staticDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
    });
  }
} catch (error) {
  console.error('Error reading static directory:', error);
}

// Create a fallback index.html if we can't find one
if (!fs.existsSync(indexPath)) {
  console.log('Could not find index.html in static directory');
  
  // Create public directory for fallback
  if (!fs.existsSync(publicDir)) {
    try {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('Created public directory:', publicDir);
    } catch (error) {
      console.error('Error creating public directory:', error);
    }
  }
  
  // Create fallback index.html in public directory
  const publicIndexPath = path.join(publicDir, 'index.html');
  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Truth Networks</title>
      <style>
        body { 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.5;
          margin: 0;
          padding: 0;
        }
        .header {
          background-color: #276EF1;
          color: white;
          padding: 2rem 0;
          text-align: center;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .content {
          padding: 2rem 0;
        }
        .footer {
          background-color: #0B1D3A;
          color: white;
          padding: 2rem 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="container">
          <h1>The Truth Networks</h1>
          <p>Fighting misinformation and promoting media literacy in a digital age.</p>
        </div>
      </div>
      <div class="content">
        <div class="container">
          <h2>Welcome to The Truth Networks</h2>
          <p>Our website is currently being updated. Please check back soon for more information.</p>
        </div>
      </div>
      <div class="footer">
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} The Truth Networks. All rights reserved.</p>
          <p>165 Northern Blvd, Germantown, NY 12526 | info@thetruthnetworks.com</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    fs.writeFileSync(publicIndexPath, htmlContent);
    console.log('Created fallback index.html in public directory');
    indexPath = publicIndexPath;
  } catch (error) {
    console.error('Error creating fallback index.html:', error);
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