# The Truth Networks Website

## Deployment Instructions for Render

### Important: Configure Your Render Service

1. **Build Command**: 
   ```
   npm install && node build.js
   ```

2. **Start Command**: 
   ```
   node dist/index.js
   ```

3. **Required Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `PGHOST`: Database host
   - `PGDATABASE`: Database name
   - `PGUSER`: Database username
   - `PGPASSWORD`: Database password  
   - `PGPORT`: Database port (usually 5432)

4. **Node Version**: 
   Recommended Node.js version is 18.x or higher.

### Alternative Configuration

This repository includes a `render.yaml` file that Render can use for automatic configuration. If using the Render Dashboard UI, you can ignore this file and configure manually as described above.

## Local Development

Run the development server:
```
npm run dev
```

## About This Project

The Truth Networks website is a React/TypeScript application with an Express.js backend. It uses PostgreSQL for data storage with Drizzle ORM.