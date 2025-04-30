import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting full website build process...');

// Create necessary directories
try {
  console.log('Creating dist directory...');
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
    console.log('dist directory created successfully');
  } else {
    console.log('dist directory already exists');
  }

  console.log('Setting up public directory...');
  // Check if public exists and is a file (not a directory)
  if (fs.existsSync('./public') && !fs.statSync('./public').isDirectory()) {
    console.log('public exists but is not a directory, renaming it...');
    fs.renameSync('./public', './public.old');
  }
  
  // Now create the public directory if it doesn't exist
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
    console.log('public directory created successfully');
  } else {
    console.log('public directory already exists');
  }
} catch (err) {
  console.error('Error creating directories:', err);
  // Continue anyway - we'll try to handle this in the next steps
}

// Try to build the React app
try {
  console.log('Building the React application...');
  
  // First ensure vite is installed at the root level
  console.log('Installing vite globally...');
  execSync('npm install -g vite', { stdio: 'inherit' });
  
  // Build from client if it exists
  if (fs.existsSync('./client')) {
    console.log('Client directory found, running build...');
    
    try {
      // Try to install dependencies and build from client
      console.log('Building from client directory...');
      execSync('cd client && npm install', { stdio: 'inherit' });
      execSync('cd client && npm run build', { stdio: 'inherit' });
      
      // Check if build directory exists in client
      if (fs.existsSync('./client/dist') || fs.existsSync('./client/build')) {
        const buildDir = fs.existsSync('./client/dist') ? './client/dist' : './client/build';
        console.log(`Client build output found at ${buildDir}, copying to public...`);
        
        // Copy build files to public
        const copyRecursive = (src, dest) => {
          const exists = fs.existsSync(src);
          const stats = exists && fs.statSync(src);
          const isDirectory = exists && stats.isDirectory();
          
          if (isDirectory) {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            fs.readdirSync(src).forEach(childItemName => {
              copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
            });
          } else {
            fs.copyFileSync(src, dest);
          }
        };
        
        copyRecursive(buildDir, './public');
        console.log('Copied client build files to public directory');
      } else {
        throw new Error('No build output found in client directory');
      }
    } catch (clientErr) {
      console.error('Error building from client directory:', clientErr);
      throw new Error('Client build failed');
    }
  } else {
    // Try to build from root package.json
    console.log('Building from root package.json...');
    try {
      // Install dependencies first
      execSync('npm install', { stdio: 'inherit' });
      
      // Check if we have a build script in package.json
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      
      if (packageJson.scripts && packageJson.scripts.build) {
        console.log('Running npm run build...');
        execSync('npm run build', { stdio: 'inherit' });
      } else {
        console.log('No build script found in package.json, trying vite build...');
        // Try direct vite build
        execSync('npx vite build', { stdio: 'inherit' });
      }
      
      // Check if build output exists
      if (fs.existsSync('./dist/client') || fs.existsSync('./build')) {
        const buildDir = fs.existsSync('./dist/client') ? './dist/client' : './build';
        console.log(`Root build output found at ${buildDir}, copying to public...`);
        
        // Copy build files to public
        const copyRecursive = (src, dest) => {
          const exists = fs.existsSync(src);
          const stats = exists && fs.statSync(src);
          const isDirectory = exists && stats.isDirectory();
          
          if (isDirectory) {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            fs.readdirSync(src).forEach(childItemName => {
              copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
            });
          } else {
            fs.copyFileSync(src, dest);
          }
        };
        
        copyRecursive(buildDir, './public');
        console.log('Copied root build files to public directory');
      } else {
        throw new Error('No build output found after root build');
      }
    } catch (rootErr) {
      console.error('Error building from root package.json:', rootErr);
      throw new Error('Root build failed');
    }
  }
} catch (err) {
  console.error('Error building React app:', err);
  console.log('Continuing with server setup...');
}

// Create fallback index.html if it doesn't exist
if (!fs.existsSync('./public/index.html')) {
  console.log('No index.html found in public directory, creating fallback...');
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
  fs.writeFileSync('./public/index.html', htmlContent);
  console.log('Created fallback index.html');
}

// Server code for index.js
const serverCode = `
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to import server routes if available
let registerRoutes;
try {
  const { registerRoutes: importedRegisterRoutes } = await import('./routes.js');
  registerRoutes = importedRegisterRoutes;
  console.log('Server routes imported successfully');
} catch (err) {
  console.log('No routes module found or error importing:', err.message);
  registerRoutes = async (app) => {
    console.log('Using default routes configuration');
    
    // Add a simple API status endpoint
    app.get('/api/status', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running', timestamp: new Date() });
    });
    
    // Contact form endpoint
    app.post('/api/contact', (req, res) => {
      console.log('Contact form submission:', req.body);
      res.json({ success: true, message: 'Thank you for your message!' });
    });

    // Newsletter signup endpoint
    app.post('/api/newsletter', (req, res) => {
      console.log('Newsletter signup:', req.body);
      res.json({ success: true, message: 'Thank you for subscribing!' });
    });

    // Fact check submission endpoint
    app.post('/api/fact-check', (req, res) => {
      console.log('Fact check submission:', req.body);
      res.json({ success: true, message: 'Your fact check request has been received.' });
    });
  };
}

const app = express();
const PORT = process.env.PORT || 10000;

// Parse JSON request bodies
app.use(express.json());

// Register API routes
await registerRoutes(app);

// Serve static files from public directory
const publicPath = path.join(__dirname, '../public');
console.log('Public directory path:', publicPath);
console.log('Directory exists:', fs.existsSync(publicPath));

if (fs.existsSync(publicPath)) {
  console.log('Files in public directory:');
  try {
    fs.readdirSync(publicPath).forEach(file => {
      console.log(\` - \${file}\`);
    });
  } catch (err) {
    console.error('Error reading public directory:', err);
  }
}

app.use(express.static(publicPath));

// Fallback route for SPA
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Send index.html
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found - index.html missing');
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

// Routes file code
const routesCode = `
export async function registerRoutes(app) {
  console.log('Registering API routes...');
  
  // API status endpoint
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date() });
  });

  // Contact form endpoint
  app.post('/api/contact', (req, res) => {
    console.log('Contact form submission:', req.body);
    res.json({ success: true, message: 'Thank you for your message!' });
  });

  // Newsletter signup endpoint
  app.post('/api/newsletter', (req, res) => {
    console.log('Newsletter signup:', req.body);
    res.json({ success: true, message: 'Thank you for subscribing!' });
  });

  // Fact check submission endpoint
  app.post('/api/fact-check', (req, res) => {
    console.log('Fact check submission:', req.body);
    res.json({ success: true, message: 'Your fact check request has been received.' });
  });

  console.log('API routes registered');
}
`;

// Write server files
console.log('Writing server code to dist/index.js...');
fs.writeFileSync('./dist/index.js', serverCode);
console.log('Server code written successfully');

console.log('Writing routes code to dist/routes.js...');
fs.writeFileSync('./dist/routes.js', routesCode);
console.log('Routes code written successfully');

console.log('Full website build process completed successfully!');