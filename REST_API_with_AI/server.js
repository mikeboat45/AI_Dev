const express = require('express');

// Create Express application
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for items
let items = [
    { id: 1, name: "Sample Item 1" },
    { id: 2, name: "Sample Item 2" }
];

// Counter for generating unique IDs
let nextId = 3;

/**
 * GET /items
 * Returns all items in the collection
 */
app.get('/items', (req, res) => {
    // Return all items with 200 OK status
    res.status(200).json(items);
});

/**
 * POST /items
 * Creates a new item with the provided name
 */
app.post('/items', (req, res) => {
    const { name } = req.body;
    
    // Check if name property is missing
    if (!name) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The 'name' property is required in the request body"
        });
    }
    
    // Create new item with unique ID
    const newItem = {
        id: nextId++,
        name: name
    };
    
    // Add item to in-memory array
    items.push(newItem);
    
    // Return the newly created item with 201 Created status
    res.status(201).json(newItem);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET  /items - Retrieve all items`);
    console.log(`  POST /items - Create a new item`);
});
