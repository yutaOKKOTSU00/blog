import { Sequelize } from 'sequelize';

// MySQL configuration
const database = 'blog_db';
const username = 'root';
const password = '';
const host = 'localhost';

// Initialize Sequelize with MySQL
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql',
  logging: console.log
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the test function
testConnection();

export default sequelize;