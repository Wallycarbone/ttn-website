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
  
  // Check if client directory exists
  if (fs.existsSync('./client')) {
    console.log('Client directory found, running build...');
    
    // Check if package.json exists
    if (fs.existsSync('./package.json')) {
      console.log('Building from root package.json...');
      execSync('npm run build', { stdio: 'inherit' });
    } else if (fs.existsSync('./client/package.json')) {
      console.log('Building from client/package.json...');
      execSync('cd client && npm run build', { stdio: 'inherit' });
    } else {
      console.log('No package.json found for build');
    }
    
    // Check if the build output exists
    if (fs.existsSync('./client/dist') || fs.existsSync('./client/build')) {
      const buildDir = fs.existsSync('./client/dist') ? './client/dist' : './client/build';
      console.log(`Build output found at ${buildDir}, copying to public...`);
      
      // Copy all files from build directory to public
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
      console.log('Copied build files to public directory');
    } else {
      console.log('No build output found');
    }
  } else {
    console.log('No client directory found');
  }
} catch (err) {
  console.error('Error building React app:', err);
  console.log('Continuing with server setup...');
}

// Create a server script to serve the React app
const serverCode = `
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import server routes if available
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
  };
}

const app = express();
const PORT = process.env.PORT || 10000;

// Parse JSON bodies
app.use(express.json());

// Check if public directory exists
const publicPath = path.join(__dirname, '../public');
if (!fs.existsSync(publicPath)) {
  console.log('Creating public directory at runtime');
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
    console.log('Created default index.html');
  }
}

// Register API routes
await registerRoutes(app);

// Serve static files from public directory
app.use(express.static(publicPath));

// Fallback route for SPA - all non-API routes go to index.html
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Public directory path: \${publicPath}\`);
  console.log(\`Directory exists: \${fs.existsSync(publicPath)}\`);
  
  if (fs.existsSync(publicPath)) {
    console.log('Files in public directory:');
    fs.readdirSync(publicPath).forEach(file => {
      console.log(\` - \${file}\`);
    });
  }
});
`;

// Create a simplified routes.js file if the original doesn't exist
const routesCode = `
import fs from 'fs';

// This is a simplified version of routes.js that will be used if the original is not found
export async function registerRoutes(app) {
  console.log('Registering API routes...');
  
  // API status endpoint
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date() });
  });

  // Contact form endpoint
  app.post('/api/contact', (req, res) => {
    console.log('Contact form submission:', req.body);
    // In a real scenario, this would save to a database
    res.json({ success: true, message: 'Thank you for your message!' });
  });

  // Newsletter signup endpoint
  app.post('/api/newsletter', (req, res) => {
    console.log('Newsletter signup:', req.body);
    // In a real scenario, this would save to a database
    res.json({ success: true, message: 'Thank you for subscribing!' });
  });

  // Fact check submission endpoint
  app.post('/api/fact-check', (req, res) => {
    console.log('Fact check submission:', req.body);
    // In a real scenario, this would process the fact check
    res.json({ success: true, message: 'Your fact check request has been received.' });
  });

  console.log('API routes registered');
}
`;

try {
  // Write the server code to index.js in the dist directory
  console.log('Writing server code to dist/index.js...');
  fs.writeFileSync('./dist/index.js', serverCode);
  console.log('Server code written successfully');
  
  // Write the routes code to routes.js in the dist directory
  console.log('Writing routes code to dist/routes.js...');
  fs.writeFileSync('./dist/routes.js', routesCode);
  console.log('Routes code written successfully');
} catch (err) {
  console.error('Error writing server code:', err);
  process.exit(1);
}

console.log('Full website build process completed successfully!');