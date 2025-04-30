import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build process...');

// First run the directory structure creation script
try {
  console.log('Creating necessary directory structure...');
  // Try to run the create-structure.js script
  if (fs.existsSync('./create-structure.js')) {
    execSync('node create-structure.js', { stdio: 'inherit' });
  } else {
    console.log('create-structure.js not found, using inline creation...');
    
    // Create dist directory
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
    }
    
    // Handle public directory - if it exists but isn't a directory, rename it
    if (fs.existsSync('./public') && !fs.statSync('./public').isDirectory()) {
      fs.renameSync('./public', './public.old');
    }
    
    // Create public directory if it doesn't exist
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public', { recursive: true });
    }
    
    // Create default index.html
    const defaultHtml = `
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 800px;
      padding: 2rem;
      text-align: center;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      color: #276EF1;
      margin-bottom: 1rem;
    }
    p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .footer {
      margin-top: 2rem;
      font-size: 0.9rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>The Truth Networks</h1>
    <p>Fighting misinformation and promoting media literacy in a digital age.</p>
    <p>Our full website is being deployed. Please check back in a few minutes.</p>
    <div class="footer">
      &copy; 2025 The Truth Networks. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
    fs.writeFileSync('./public/index.html', defaultHtml);
  }
} catch (error) {
  console.error('Error creating directory structure:', error);
  // Continue anyway, the next steps will try to handle this
}

// Create a simple Express server for serving static files
const serverCode = `
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Create public directory if it doesn't exist
const publicPath = path.join(__dirname, '../public');
if (!fs.existsSync(publicPath)) {
  console.log('Creating public directory at runtime');
  fs.mkdirSync(publicPath, { recursive: true });
  
  // Create a default index.html file
  const indexPath = path.join(publicPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const html = \`
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 800px;
      padding: 2rem;
      text-align: center;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      color: #276EF1;
      margin-bottom: 1rem;
    }
    p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .footer {
      margin-top: 2rem;
      font-size: 0.9rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>The Truth Networks</h1>
    <p>Fighting misinformation and promoting media literacy in a digital age.</p>
    <p>Our website is currently being deployed. Please check back soon.</p>
    <div class="footer">
      &copy; \${new Date().getFullYear()} The Truth Networks. All rights reserved.
    </div>
  </div>
</body>
</html>\`;
    fs.writeFileSync(indexPath, html);
  }
}

// Serve static files from public directory
app.use(express.static(publicPath));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Public directory path: \${publicPath}\`);
  console.log(\`Directory exists: \${fs.existsSync(publicPath)}\`);
  console.log(\`Is directory: \${fs.existsSync(publicPath) ? fs.statSync(publicPath).isDirectory() : 'N/A'}\`);
});
`;

try {
  // Write the server code to index.js in the dist directory
  console.log('Writing server code to dist/index.js...');
  fs.writeFileSync('./dist/index.js', serverCode);
  console.log('Server code written successfully');
} catch (err) {
  console.error('Error writing server code:', err);
  process.exit(1);
}

console.log('Build completed successfully!');