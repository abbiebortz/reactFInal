require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
require('./models/User');  

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
app.use(express.json());

const { getUserByUsername, addUser, updateBudget, getBudgetByUsername } = require('./dbHelpers');
const { authenticateToken } = require('./auth');

const PORT = process.env.PORT || 5001;

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        return res.status(400).send("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await addUser({ username, password: hashedPassword });
    res.status(201).send("User created");
});

app.get('/api/user', authenticateToken, async (req, res) => {
    const user = await getUserByUsername(req.user.username);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json(user);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
        return res.status(400).json({ error: 'Cannot find user' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Not Allowed' });
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.json({ token: token });
});

app.post('/api/budget', authenticateToken, async (req, res) => {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.some(item => typeof item.name !== 'string' || typeof item.cost !== 'number')) {
        return res.status(400).send("Each item must have a name and a cost.");
    }
    const updatedItems = await updateBudget(req.user.username, items);
    res.json(updatedItems);
});

app.get('/api/budget', authenticateToken, async (req, res) => {
    const budgetItems = await getBudgetByUsername(req.user.username);
    if (!budgetItems) {
        return res.status(404).send("No budget items found.");
    }
    res.json(budgetItems);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
