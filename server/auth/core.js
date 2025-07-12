const express = require('express');
const prisma = require('./db');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());


app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Request body:', req.body);
  next();
});


const users = {};

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (users[email]) return res.status(409).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  users[email] = { email, password: hashed };
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
