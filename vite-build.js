import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create build directory structure
console.log('Creating build directories...');
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist', { recursive: true });
}

// Fix public directory if needed
if (fs.existsSync('./public') && !fs.statSync('./public').isDirectory()) {
  fs.renameSync('./public', './public.old');
}
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

// Install vite and other dependencies
console.log('Installing dependencies...');
execSync('npm install --save-dev vite @vitejs/plugin-react', { stdio: 'inherit' });

// Create a server.js file in the dist directory
const serverCode = `
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;

// Set up API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve static files
console.log('Setting up static file service from:', path.join(__dirname, '../public'));
app.use(express.static(path.join(__dirname, '../public')));

// Always return the main index.html for any route not found (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

// Write the server.js file
fs.writeFileSync('./dist/server.js', serverCode);

// Create a minimal vite.config.js if one doesn't exist
if (!fs.existsSync('./vite.config.js')) {
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public'
  }
});
`;
  fs.writeFileSync('./vite.config.js', viteConfig);
}

// Create a minimal index.html if one doesn't exist
if (!fs.existsSync('./index.html')) {
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Truth Networks</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  fs.writeFileSync('./index.html', indexHtml);
}

// Try to build the website
console.log('Building website...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Website built successfully!');
} catch (error) {
  console.error('Error building website:', error);
  
  // Create a backup index.html in case build fails
  const backupHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Truth Networks</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      background-color: #276EF1;
      color: white;
      padding: 2rem 0;
    }
    .content {
      padding: 2rem 0;
    }
    .footer {
      background-color: #0B1D3A;
      color: white;
      padding: 2rem 0;
      margin-top: 2rem;
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
      <p>We are committed to combating misinformation and promoting media literacy through innovative digital tools and educational resources.</p>
      
      <h3>Our Mission</h3>
      <p>To build a more informed society by providing people with the tools and knowledge they need to identify and combat misinformation.</p>
      
      <h3>What We Do</h3>
      <ul>
        <li>Real-time fact-checking of news and social media content</li>
        <li>Educational resources for K-12 students and teachers</li>
        <li>Community workshops on media literacy</li>
        <li>Support for independent journalism</li>
      </ul>
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

  if (!fs.existsSync('./public/index.html')) {
    console.log('Creating backup index.html...');
    fs.writeFileSync('./public/index.html', backupHtml);
  }
}

console.log('Build process completed.');