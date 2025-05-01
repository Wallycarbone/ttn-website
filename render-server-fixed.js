import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000;

// Body parser
app.use(express.json());

// Log server startup
console.log('Starting TTN Website server...');

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'API is operational' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Thank you for your message. We will be in touch soon!' });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  console.log('Newsletter signup:', { email });
  res.json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
});

app.post('/api/fact-check', (req, res) => {
  const { url, claim } = req.body;
  console.log('Fact check request:', { url, claim });
  res.json({ 
    success: true, 
    message: 'Fact check request received',
    results: {
      claim: claim || 'The claim content will appear here',
      sources: [
        {
          name: 'PolitiFact',
          rating: 'Mostly False',
          link: 'https://www.politifact.com/factchecks/recent/'
        },
        {
          name: 'Snopes',
          rating: 'Unproven',
          link: 'https://www.snopes.com/fact-check/'
        }
      ],
      summary: 'This is a simulated fact-check result. In the full version, this would contain a detailed analysis of the claim.'
    }
  });
});

// Embedded HTML content
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Truth Networks - Fighting misinformation and promoting media literacy in a digital age</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    :root {
      --primary-color: #276EF1;
      --secondary-color: #0B1D3A;
      --light-gray: #F5F5F5;
      --white: #FFFFFF;
      --warm-beige: #f9f7f4;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 600;
      display: inline-block;
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      background-color: #1a54c7;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .hero {
      background: linear-gradient(135deg, #276EF1 0%, #1D54B8 100%);
      color: white;
      padding: 100px 0;
    }
    .section {
      padding: 80px 0;
    }
    .section-alt {
      background-color: var(--light-gray);
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 24px;
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    }
    .nav-link {
      color: #333;
      font-weight: 500;
      padding: 0.5rem 1rem;
      transition: color 0.3s ease;
    }
    .nav-link:hover {
      color: var(--primary-color);
    }
    .active {
      color: var(--primary-color);
      font-weight: 600;
    }
    footer {
      background-color: var(--secondary-color);
      color: white;
    }
    .icon {
      margin-right: 8px;
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
    .form-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(39, 110, 241, 0.2);
    }
    .gradient-text {
      background: linear-gradient(90deg, #276EF1 0%, #1a54c7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-gray-800">
        <span class="gradient-text">The Truth Networks</span>
      </a>
      <nav class="hidden md:flex space-x-4">
        <a href="/" class="nav-link active">Home</a>
        <a href="/about" class="nav-link">About</a>
        <a href="/our-work" class="nav-link">Our Work</a>
        <a href="/contact" class="nav-link">Contact</a>
        <a href="/contribute" class="nav-link">Contribute</a>
      </nav>
      <button class="md:hidden text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Fighting misinformation and promoting media literacy in a digital age</h1>
      <p class="text-xl md:text-2xl mb-10 max-w-4xl mx-auto">We provide powerful tools and education to help everyone identify fact from fiction.</p>
      <div class="flex flex-col md:flex-row justify-center gap-4">
        <a href="/fact-check" class="btn-primary">Try Our Fact Checker</a>
        <a href="/our-work" class="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">Explore Our Work</a>
      </div>
    </div>
  </section>

  <!-- What We Do Section -->
  <section class="section">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">What We Do</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card">
          <div class="mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Real-Time Fact Checking</h3>
          <p class="text-gray-600">We provide tools that help identify and verify claims in real-time using our extensive network of verified sources.</p>
        </div>
        <div class="card">
          <div class="mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Media Literacy Education</h3>
          <p class="text-gray-600">We develop curricula and resources for K-12 students, teachers, and the general public to build critical thinking skills.</p>
        </div>
        <div class="card">
          <div class="mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Journalism Support</h3>
          <p class="text-gray-600">We provide tools and resources for journalists to verify information quickly and accurately in today's fast-paced media environment.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Media Literacy Section -->
  <section class="section section-alt">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Media Literacy Resources</h2>
          <p class="text-lg mb-6">Our comprehensive resources help everyone navigate today's complex information landscape:</p>
          <ul class="space-y-4">
            <li class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Guide to Spotting Fake News</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Understanding Media Bias</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Source Verification Techniques</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 text-blue-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Digital Literacy for All Ages</span>
            </li>
          </ul>
          <a href="/our-work" class="btn-primary mt-8">Explore Resources</a>
        </div>
        <div class="md:w-1/2">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Media Literacy" class="w-full h-auto rounded-lg">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Fact-Checking Tool Section -->
  <section class="section">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Try Our Fact-Checking Tool</h2>
      <p class="text-lg mb-10 max-w-3xl mx-auto">Our innovative tool helps you verify claims from news articles, social media posts, and other sources in real-time.</p>
      
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div class="mb-4">
          <label for="claim" class="block text-left text-gray-700 mb-2 font-semibold">Enter a claim to fact-check:</label>
          <textarea id="claim" class="form-input h-32" placeholder="Paste or type a claim here..."></textarea>
        </div>
        <button id="checkBtn" class="btn-primary w-full md:w-auto">Check Facts</button>
        
        <div id="results" class="mt-8 hidden">
          <h3 class="text-xl font-bold mb-4 text-left">Fact Check Results</h3>
          <div class="bg-gray-50 p-4 rounded-md text-left">
            <p class="font-semibold">Claim:</p>
            <p id="claimText" class="mb-4">The claim will appear here</p>
            
            <p class="font-semibold">Sources:</p>
            <ul id="sourcesList" class="mb-4 list-disc pl-5">
              <!-- Sources will be populated here -->
            </ul>
            
            <p class="font-semibold">Summary:</p>
            <p id="summaryText">The fact check summary will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Community Workshops Section -->
  <section class="section section-alt">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Community Workshops</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="card">
          <h3 class="text-xl font-bold mb-4">Fact-Checking Workshops</h3>
          <p class="text-gray-600 mb-4">Learn practical techniques for verifying information online and spotting misinformation.</p>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Monthly workshops in major cities</span>
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2-hour interactive sessions</span>
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Open to all community members</span>
            </li>
          </ul>
          <a href="/workshops" class="text-blue-600 font-semibold hover:underline">Learn more →</a>
        </div>
        <div class="card">
          <h3 class="text-xl font-bold mb-4">Digital Literacy for Seniors</h3>
          <p class="text-gray-600 mb-4">Specialized workshops helping seniors navigate online information and avoid scams.</p>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Weekly sessions at community centers</span>
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Small groups with personalized help</span>
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Focus on online safety and scam prevention</span>
            </li>
          </ul>
          <a href="/workshops" class="text-blue-600 font-semibold hover:underline">Learn more →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Newsletter Section -->
  <section class="section bg-blue-600 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Stay Informed</h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">Subscribe to our newsletter to receive the latest updates on media literacy resources, upcoming workshops, and fact-checking tools.</p>
      
      <form id="newsletterForm" class="max-w-md mx-auto">
        <div class="flex flex-col sm:flex-row gap-4">
          <input type="email" id="emailInput" placeholder="Your email address" class="form-input text-gray-800 py-3 px-4 rounded-md mb-0 flex-grow" required>
          <button type="submit" class="bg-white text-blue-600 font-semibold py-3 px-6 rounded-md hover:bg-gray-100 transition">Subscribe</button>
        </div>
        <p id="newsletterMessage" class="mt-4 hidden"></p>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">The Truth Networks</h3>
          <p class="mb-4">Fighting misinformation and promoting media literacy in a digital age.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-white hover:text-blue-400">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-blue-400">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-blue-400">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" class="text-white hover:text-blue-400">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="/" class="hover:text-blue-400 transition">Home</a></li>
            <li><a href="/about" class="hover:text-blue-400 transition">About Us</a></li>
            <li><a href="/our-work" class="hover:text-blue-400 transition">Our Work</a></li>
            <li><a href="/fact-check" class="hover:text-blue-400 transition">Fact Check Tool</a></li>
            <li><a href="/contact" class="hover:text-blue-400 transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Resources</h3>
          <ul class="space-y-2">
            <li><a href="/education" class="hover:text-blue-400 transition">K-12 Education</a></li>
            <li><a href="/workshops" class="hover:text-blue-400 transition">Community Workshops</a></li>
            <li><a href="/journalism" class="hover:text-blue-400 transition">Journalism Support</a></li>
            <li><a href="/media-literacy" class="hover:text-blue-400 transition">Media Literacy Guides</a></li>
            <li><a href="/volunteer" class="hover:text-blue-400 transition">Volunteer</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
          <ul class="space-y-3">
            <li class="flex items-start">
              <svg class="h-6 w-6 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>165 Northern Blvd, Germantown, NY 12526</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@thetruthnetworks.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
        <p>&copy; 2025 The Truth Networks. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        
        try {
          const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            newsletterMessage.textContent = data.message;
            newsletterMessage.className = 'mt-4 text-green-200';
            newsletterMessage.classList.remove('hidden');
            newsletterForm.reset();
          } else {
            newsletterMessage.textContent = data.message || 'An error occurred. Please try again.';
            newsletterMessage.className = 'mt-4 text-red-200';
            newsletterMessage.classList.remove('hidden');
          }
        } catch (error) {
          newsletterMessage.textContent = 'An error occurred. Please try again.';
          newsletterMessage.className = 'mt-4 text-red-200';
          newsletterMessage.classList.remove('hidden');
        }
      });
    }
    
    // Fact-checking tool
    const checkBtn = document.getElementById('checkBtn');
    const resultsDiv = document.getElementById('results');
    const claimText = document.getElementById('claimText');
    const sourcesList = document.getElementById('sourcesList');
    const summaryText = document.getElementById('summaryText');
    
    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        const claim = document.getElementById('claim').value;
        if (!claim) {
          alert('Please enter a claim to fact-check');
          return;
        }
        
        try {
          const response = await fetch('/api/fact-check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ claim }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            claimText.textContent = data.results.claim;
            
            // Clear previous sources
            sourcesList.innerHTML = '';
            
            // Add sources
            data.results.sources.forEach(source => {
              const li = document.createElement('li');
              li.innerHTML = \`<strong>\${source.name}:</strong> \${source.rating} <a href="\${source.link}" target="_blank" class="text-blue-600 hover:underline">(View)</a>\`;
              sourcesList.appendChild(li);
            });
            
            summaryText.textContent = data.results.summary;
            resultsDiv.classList.remove('hidden');
          } else {
            alert(data.message || 'An error occurred. Please try again.');
          }
        } catch (error) {
          alert('An error occurred. Please try again.');
        }
      });
    }
  </script>
</body>
</html>`;

// Serve embedded HTML for ALL routes
app.get('*', (req, res) => {
  res.send(indexHtml);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});