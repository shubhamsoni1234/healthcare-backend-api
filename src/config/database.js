const { Sequelize } = require('sequelize');

const connectionUri = process.env.DATABASE_URL;

if (!connectionUri) {
  console.warn('DATABASE_URL is not set in environment variables. Falling back to default local connection.');
}

// Automatically configure SSL for hosted providers like Neon, Render, Supabase
const requiresSsl = Boolean(
  connectionUri && (
    connectionUri.includes('neon.tech') ||
    connectionUri.includes('amazonaws.com') ||
    connectionUri.includes('sslmode=require') ||
    process.env.DB_SSL === 'true'
  )
);

const sequelize = new Sequelize(
  connectionUri || 'postgresql://postgres:postgres@localhost:5432/healthcare_db',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    dialectOptions: requiresSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
