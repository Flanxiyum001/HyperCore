require('dotenv').config(); // To use environment variables
const mongoose = require('mongoose');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // To parse incoming requests
const path = require('path'); // To handle file paths

const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());

// Serve static files (frontend) from the 'frontend/build' folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build'))); // Correct path

// MongoDB URI
const mongoURI = 'mongodb+srv://pourushnair:BdRdlTT4Yp9OGhmD@hypercore.pe9er.mongodb.net/?retryWrites=true&w=majority&appName=Hypercore';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Error creating user', details: err });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in', details: err });
    }
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Example of sending random node data every 5 seconds
    setInterval(() => {
        const nodeData = generateRandomNodeData();
        ws.send(JSON.stringify(nodeData));
    }, 5000);

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Generate random node data for demonstration purposes
function generateRandomNodeData() {
    return {
        nodes: [
            { id: 1, x: Math.random() * 600, y: Math.random() * 400, status: "active" },
            { id: 2, x: Math.random() * 600, y: Math.random() * 400, status: "inactive" },
            { id: 3, x: Math.random() * 600, y: Math.random() * 400, status: "active" }
        ],
        links: [
            { source: 1, target: 2 },
            { source: 1, target: 3 }
        ]
    };
}

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to HyperCore API!' });
});

// Serve index.html when visiting the root
app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
