import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './db-connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;

// Parse JSON request bodies
app.use(express.json());

// Connect to database
let pool = null;
connectToDatabase().then(result => {
  pool = result;
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'The Truth Networks API is running',
    database: pool ? 'connected' : 'not connected',
    timestamp: new Date() 
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  
  try {
    if (pool) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
          [name, email, message]
        );
        console.log('Contact saved to database:', result.rows[0]);
      } finally {
        client.release();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was an error processing your request. Please try again.' 
    });
  }
});

// Newsletter signup endpoint
app.post('/api/newsletter', async (req, res) => {
  const { email, firstName, lastName } = req.body;
  console.log('Newsletter signup:', { email, firstName, lastName });
  
  try {
    if (pool) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'INSERT INTO newsletters (email, first_name, last_name) VALUES ($1, $2, $3) RETURNING *',
          [email, firstName || null, lastName || null]
        );
        console.log('Newsletter subscription saved:', result.rows[0]);
      } finally {
        client.release();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!' 
    });
  } catch (error) {
    console.error('Error saving newsletter subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was an error processing your subscription. Please try again.' 
    });
  }
});

// Fact checking endpoint
app.post('/api/fact-check', async (req, res) => {
  const { claim, sourceUrl, category } = req.body;
  console.log('Fact check request:', { claim, sourceUrl, category });
  
  try {
    if (pool) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'INSERT INTO fact_checks (claim, source_url, category, status) VALUES ($1, $2, $3, $4) RETURNING *',
          [claim, sourceUrl, category, 'pending']
        );
        console.log('Fact check saved:', result.rows[0]);
      } finally {
        client.release();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Your fact check request has been submitted successfully.' 
    });
  } catch (error) {
    console.error('Error saving fact check:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was an error processing your fact check request. Please try again.' 
    });
  }
});

// Contribution/donation endpoint
app.post('/api/contribute', async (req, res) => {
  const { name, email, amount, message } = req.body;
  console.log('Contribution request:', { name, email, amount, message });
  
  try {
    if (pool) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'INSERT INTO donations (name, email, amount, message) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, email, amount, message || null]
        );
        console.log('Contribution saved:', result.rows[0]);
      } finally {
        client.release();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you for your contribution! Your support helps us combat misinformation.' 
    });
  } catch (error) {
    console.error('Error saving contribution:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was an error processing your contribution. Please try again.' 
    });
  }
});

// Volunteer sign-up endpoint
app.post('/api/volunteer', async (req, res) => {
  const { name, email, interests, experience, availability } = req.body;
  console.log('Volunteer sign-up:', { name, email, interests, experience, availability });
  
  // This would normally save to a database table for volunteers
  // For now, we'll just log it and return success
  
  res.json({ 
    success: true, 
    message: 'Thank you for volunteering! We will contact you soon with more information.' 
  });
});

// Static file serving - make sure this comes after API routes
const publicPath = path.join(__dirname, 'public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Catch-all route for SPA
app.get('*', (req, res) => {
  // Check if the index.html file exists
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found - index.html missing from public directory');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server time: ${new Date().toLocaleString()}`);
  
  // Log filesystem info for debugging
  console.log(`Public directory exists: ${fs.existsSync(publicPath)}`);
  if (fs.existsSync(publicPath)) {
    console.log('Files in public directory:');
    try {
      fs.readdirSync(publicPath).forEach(file => {
        console.log(` - ${file}`);
      });
    } catch (err) {
      console.error('Error reading public directory:', err);
    }
  }
});