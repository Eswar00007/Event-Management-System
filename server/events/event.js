const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/events/add', async (req, res) => {
  const { name, description, author, price, duration, notes } = req.body;

  console.log('Received data:', req.body);

  try {
    const newEvent = await prisma.course.create({
      data: {
        name,
        description,
        author,
        price,
        duration,
        notes,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Error creating course' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

router.post('/add-to-cart', async (req, res) => {
  const { username, courseCid } = req.body;

  console.log('Received data:', req.body);

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ error: 'User not found' });
    }

    const course = await prisma.course.findUnique({ where: { cid: courseCid } });
    if (!course) {
      console.log('Course not found:', courseCid);
      return res.status(404).json({ error: 'Course not found' });
    }

    const newEvent = await prisma.courseCart.create({
      data: {
        username: user.username,
        courseCid: course.cid,
      },
    });

    console.log('Event added to cart:', newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding course to cart:', error);
    res.status(500).json({ error: 'Error adding course to cart' });
  }
});

router.get('/cart/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const cartItems = await prisma.courseCart.findMany({
      where: { userId: user.id },
      include: { Course: true }
    });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).send('Error fetching cart items');
  }
});

module.exports = router;
