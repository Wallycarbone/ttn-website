#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Create necessary directories
const dirs = ['./dist', './public'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dir}`);
    // Check if it's actually a directory
    if (!fs.statSync(dir).isDirectory()) {
      console.log(`${dir} exists but is not a directory, renaming and creating`);
      fs.renameSync(dir, `${dir}.old`);
      fs.mkdirSync(dir, { recursive: true });
    }
  }
});

// Copy index.html to public folder
if (fs.existsSync('./index.html')) {
  console.log('Copying index.html to public folder');
  fs.copyFileSync('./index.html', './public/index.html');
} else {
  console.log('Creating default index.html in public folder');
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

console.log('Directory structure created successfully!');