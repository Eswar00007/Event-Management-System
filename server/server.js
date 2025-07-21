const express = require('express');
const prisma = require('./db');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

app.post('/users/signup', async (req, res) => {
  const { name, username, password, email } = req.body;

  console.log('Received data:', req.body);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password,
        email,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.get('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details' });
  }
});

app.post('/events/add', async (req, res) => {
  const { name, description, author, price, duration, notes } = req.body;

  console.log('Received data:', req.body);

  try {
    const newCourse = await prisma.course.create({
      data: {
        name,
        description,
        author,
        price,
        duration,
        notes,
      },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Error creating course' });
  }
});

app.get('/events', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
