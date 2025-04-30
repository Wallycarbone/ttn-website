import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

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

// Root route with inline HTML
app.get('*', (req, res) => {
  const html = `
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
        color: #333;
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
      .logo a {
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
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
      .tagline {
        font-size: 1.2rem;
      }
      .content {
        padding: 4rem 0;
      }
      .mission-section, .services-section, .cta-section {
        margin-bottom: 3rem;
      }
      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      .service-card {
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
      }
      .button {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
      }
      .primary-button {
        background-color: #276EF1;
        color: white;
      }
      .secondary-button {
        background-color: transparent;
        color: #276EF1;
        border: 1px solid #276EF1;
      }
      .footer {
        background-color: #0B1D3A;
        color: white;
        padding: 2rem 0;
      }
      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .footer a {
        color: #ccc;
        text-decoration: none;
      }
      .footer ul {
        list-style: none;
        padding: 0;
      }
      .footer li {
        margin-bottom: 0.5rem;
      }
      .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 1rem;
        text-align: center;
      }
      @media (max-width: 768px) {
        .navbar {
          flex-direction: column;
          gap: 1rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <a href="/">The Truth Networks</a>
          </div>
          <div class="nav-links">
            <a href="/" class="nav-item">Home</a>
            <a href="/about" class="nav-item">About</a>
            <a href="/our-work" class="nav-item">Our Work</a>
            <a href="/contact" class="nav-item">Contact</a>
            <a href="/contribute" class="nav-item">Contribute</a>
          </div>
        </nav>
        <div class="hero">
          <h1>The Truth Networks</h1>
          <p class="tagline">Fighting misinformation and promoting media literacy in a digital age.</p>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="container">
        <section class="mission-section">
          <h2>Our Mission</h2>
          <p>The Truth Networks is dedicated to combating misinformation through innovative digital tools, educational resources, and promoting media literacy across all age groups.</p>
          <p>We believe in the power of truth and accurate information to strengthen democratic societies and empower individuals to make informed decisions.</p>
        </section>
        
        <section class="services-section">
          <h2>What We Do</h2>
          <div class="services-grid">
            <div class="service-card">
              <h3>Real-Time Fact Checking</h3>
              <p>Advanced tools that analyze content in real-time to identify misinformation and provide accurate data.</p>
            </div>
            <div class="service-card">
              <h3>K-12 Education</h3>
              <p>Age-appropriate materials helping students develop critical thinking skills and media literacy.</p>
            </div>
            <div class="service-card">
              <h3>Community Workshops</h3>
              <p>Interactive sessions for adults on how to identify and combat misinformation in daily life.</p>
            </div>
            <div class="service-card">
              <h3>Journalism Support</h3>
              <p>Resources for journalists to maintain integrity and accuracy in reporting.</p>
            </div>
          </div>
        </section>
        
        <section class="cta-section">
          <h2>Join Our Mission</h2>
          <p>Together, we can build a more informed society where facts and truth prevail.</p>
          <div class="cta-buttons">
            <a href="/contribute" class="button primary-button">Contribute</a>
            <a href="/contact" class="button secondary-button">Contact Us</a>
          </div>
        </section>
      </div>
    </div>
    
    <div class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>The Truth Networks</h3>
            <p>Fighting misinformation and promoting media literacy in a digital age.</p>
          </div>
          <div class="footer-section">
            <h3>Contact</h3>
            <p>165 Northern Blvd<br>Germantown, NY 12526</p>
            <p>info@thetruthnetworks.com</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/our-work">Our Work</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} The Truth Networks. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Important: Explicitly bind to 0.0.0.0 for Render
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
  console.log(`Server details: ${JSON.stringify(server.address())}`);
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