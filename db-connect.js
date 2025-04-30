import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure neon for WebSocket
neonConfig.webSocketConstructor = ws;

// Setup database connection
export async function connectToDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not provided, database features will be unavailable');
    return null;
  }
  
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Test the connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('Successfully connected to database:', result.rows[0].now);
    return pool;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return null;
  }
}