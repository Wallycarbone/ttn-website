import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build process...');

// Create necessary directories
try {
  console.log('Creating dist directory...');
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
    console.log('dist directory created successfully');
  } else {
    console.log('dist directory already exists');
  }

  console.log('Creating public directory...');
  // Check if public exists and is a file (not a directory)
  if (fs.existsSync('./public') && !fs.statSync('./public').isDirectory()) {
    // If public exists but is a file, rename it
    console.log('public exists but is not a directory, renaming it...');
    fs.renameSync('./public', './public.old');
  }
  
  // Now create the public directory
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
    console.log('public directory created successfully');
  } else {
    console.log('public directory already exists');
  }
} catch (err) {
  console.error('Error creating directories:', err);
  process.exit(1);
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

// Check if public directory exists
const publicPath = path.join(__dirname, '../public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
  
  // Create a basic index.html if it doesn't exist
  const indexPath = path.join(publicPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const htmlContent = \`
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
      </html>
    \`;
    fs.writeFileSync(indexPath, htmlContent);
  }
}

// For Render deployment
app.use(express.static(publicPath));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

// Create a sample HTML file
try {
  console.log('Creating index.html in public directory...');
  const htmlContent = `
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
      &copy; ${new Date().getFullYear()} The Truth Networks. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  // Write the HTML file directly to public/index.html
  fs.writeFileSync('./public/index.html', htmlContent);
  console.log('index.html created successfully');
} catch (err) {
  console.error('Error creating index.html:', err);
  console.error('Error details:', err.message);
  console.error('Error stack:', err.stack);
  
  // Try to diagnose the issue
  try {
    if (fs.existsSync('./public')) {
      const stats = fs.statSync('./public');
      console.log('public exists, isDirectory:', stats.isDirectory());
      console.log('public permissions:', stats.mode.toString(8));
    } else {
      console.log('public does not exist');
    }
  } catch (diagErr) {
    console.error('Error diagnosing public directory:', diagErr);
  }
}

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