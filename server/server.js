const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'asdasdasdjgaksdhgkaHSbaolishd';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const key = Math.floor(Math.random() * 1000000);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: role || 'USER',
        key
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        postedEvents: {
          include: {
            eventRatings: true
          }
        },
        assignedEvents: {
          include: {
            eventRatings: true
          }
        },
        receivedUserRatings: {
          include: {
            rater: {
              select: { id: true, name: true, username: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        givenUserRatings: {
          include: {
            ratedUser: {
              select: { id: true, name: true, username: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;

    if (req.user.role !== 'EVENT_MANAGEMENT') {
      return res.status(403).json({ error: 'Only event managers can create events' });
    }

    const assignedUser = await prisma.user.findUnique({
      where: { username: assignedTo }
    });

    if (!assignedUser) {
      return res.status(404).json({ error: 'Assigned user not found' });
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        Posted_By: req.user.username,
        Assigned_To: assignedTo
      },
      include: {
        postedByUser: {
          select: { id: true, name: true, username: true }
        },
        assignedToUser: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        postedByUser: {
          select: { id: true, name: true, username: true }
        },
        assignedToUser: {
          select: { id: true, name: true, username: true }
        },
        eventRatings: {
          include: {
            rater: {
              select: { id: true, name: true, username: true }
            }
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        postedByUser: {
          select: { id: true, name: true, username: true }
        },
        assignedToUser: {
          select: { id: true, name: true, username: true }
        },
        eventRatings: {
          include: {
            rater: {
              select: { id: true, name: true, username: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.Posted_By !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { name, description },
      include: {
        postedByUser: {
          select: { id: true, name: true, username: true }
        },
        assignedToUser: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.Posted_By !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.post('/api/events/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.Assigned_To !== req.user.username) {
      return res.status(403).json({ error: 'You are not assigned to this event' });
    }

    res.json({ message: 'Event accepted successfully', eventId: id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept event' });
  }
});

app.post('/api/events/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.Assigned_To !== req.user.username) {
      return res.status(403).json({ error: 'You are not assigned to this event' });
    }

    res.json({ message: 'Event rejected successfully', eventId: id, reason });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject event' });
  }
});

app.post('/api/ratings/user', authenticateToken, async (req, res) => {
  try {
    const { ratedUserId, rating, review } = req.body;

    if (req.user.id === ratedUserId) {
      return res.status(400).json({ error: 'Cannot rate yourself' });
    }

    const existingRating = await prisma.userRating.findUnique({
      where: {
        raterId_ratedUserId: {
          raterId: req.user.id,
          ratedUserId: parseInt(ratedUserId)
        }
      }
    });

    let userRating;
    if (existingRating) {
      userRating = await prisma.userRating.update({
        where: { id: existingRating.id },
        data: { rating, review }
      });
    } else {
      userRating = await prisma.userRating.create({
        data: {
          raterId: req.user.id,
          ratedUserId: parseInt(ratedUserId),
          rating,
          review
        }
      });
    }

    const avgRating = await prisma.userRating.aggregate({
      where: { ratedUserId: parseInt(ratedUserId) },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.user.update({
      where: { id: parseInt(ratedUserId) },
      data: {
        averageRating: avgRating._avg.rating,
        totalRatings: avgRating._count.rating
      }
    });

    res.json(userRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

app.post('/api/ratings/event', authenticateToken, async (req, res) => {
  try {
    const { eventId, rating, review } = req.body;

    const existingRating = await prisma.eventRating.findUnique({
      where: {
        raterId_eventId: {
          raterId: req.user.id,
          eventId: parseInt(eventId)
        }
      }
    });

    let eventRating;
    if (existingRating) {
      eventRating = await prisma.eventRating.update({
        where: { id: existingRating.id },
        data: { rating, review }
      });
    } else {
      eventRating = await prisma.eventRating.create({
        data: {
          raterId: req.user.id,
          eventId: parseInt(eventId),
          rating,
          review
        }
      });
    }

    const avgRating = await prisma.eventRating.aggregate({
      where: { eventId: parseInt(eventId) },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        averageRating: avgRating._avg.rating,
        totalRatings: avgRating._count.rating
      }
    });

    res.json(eventRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.conversation.findMany({
      where: {
        OR: [
          { Fromid: req.user.id },
          { Toid: req.user.id }
        ]
      },
      include: {
        From: {
          select: { id: true, name: true, username: true }
        },
        To: {
          select: { id: true, name: true, username: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { toUserId, message } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        Fromid: req.user.id,
        Toid: parseInt(toUserId),
        message
      },
      include: {
        From: {
          select: { id: true, name: true, username: true }
        },
        To: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;