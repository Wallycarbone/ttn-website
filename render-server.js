const express = require('express');
const path = require('path');
const fs = require('fs');

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

// Create fallback HTML file if it doesn't exist
const publicDir = path.join(__dirname, 'public');
const indexPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory');
}

if (!fs.existsSync(indexPath)) {
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
      line-height: 1.6;
    }
    
    .header {
      background-color: #276EF1;
      color: white;
      padding: 2rem 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
    }
    
    .hero {
      text-align: center;
      padding: 3rem 0;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .content {
      padding: 4rem 0;
    }
    
    .section {
      margin-bottom: 3rem;
    }
    
    .footer {
      background-color: #0B1D3A;
      color: white;
      padding: 2rem 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="container">
      <div class="navbar">
        <div class="logo">The Truth Networks</div>
        <div class="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/our-work">Our Work</a>
          <a href="/contact">Contact</a>
          <a href="/contribute">Contribute</a>
        </div>
      </div>
      <div class="hero">
        <h1>The Truth Networks</h1>
        <p>Fighting misinformation and promoting media literacy in a digital age.</p>
      </div>
    </div>
  </div>
  
  <div class="content">
    <div class="container">
      <div class="section">
        <h2>Our Mission</h2>
        <p>The Truth Networks is dedicated to combating misinformation and promoting media literacy across all age groups.</p>
        <p>We believe in the power of accurate information to strengthen democratic societies and help individuals make informed decisions.</p>
      </div>
      
      <div class="section">
        <h2>What We Do</h2>
        <ul>
          <li>Real-time fact-checking of news and social media content</li>
          <li>Educational resources for K-12 students and teachers</li>
          <li>Community workshops on media literacy</li>
          <li>Support for independent journalism</li>
        </ul>
      </div>
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
  
  fs.writeFileSync(indexPath, htmlContent);
  console.log('Created fallback index.html');
}

// Serve static files from public directory
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