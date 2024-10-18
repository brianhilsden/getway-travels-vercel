// Import required libraries
const jsonServer = require('json-server');
const { Low, JSONFile } = require('lowdb'); // Import JSONFile for file reading
const fs = require('fs'); // File system module
const path = require('path'); // Path module

const server = jsonServer.create();

// Define the path to db.json
const filePath = path.join(__dirname, '../db.json');

// Create an in-memory database
const db = new Low(new JSONFile(filePath)); // Use JSONFile to read from db.json

// Initialize the database with data from db.json
async function initDb() {
    await db.read(); // Read the existing data from db.json
    db.data ||= { users: [], posts: [] }; // Initialize structure if db.json is empty
    await db.write(); // Write to in-memory database
}

// Call the initialization function
initDb();

// Create a router based on the loaded database
const router = jsonServer.router(db.data); // Pass the in-memory data

const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}));

server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
});

// Export the Server API
module.exports = server;
