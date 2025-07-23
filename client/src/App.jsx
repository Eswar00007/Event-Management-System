import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, Paper,
  TextField, Card, CardContent, Grid, Avatar, Rating, Chip,
  List, ListItem, ListItemText, ListItemAvatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  IconButton, Menu, MenuItem, Snackbar, Alert, Fab
} from '@mui/material';
import {
  Person, Event, Add, Settings, Logout, Star, Send,
  Check, Close, Edit, Delete, Message
} from '@mui/icons-material';

const API_BASE = 'http://localhost:3001/api';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${JSON.parse(atob(token.split('.')[1])).userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const login = async (username, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  };

  const register = async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = isLogin 
      ? await login(formData.username, formData.password)
      : await register(formData);

    if (!result.success) {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}
          
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          {!isLogin && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          {!isLogin && (
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="USER">User</option>
              <option value="EVENT_MANAGEMENT">Event Manager</option>
            </TextField>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        <Button
          fullWidth
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Button>
      </Paper>
    </Container>
  );
};

const UserProfile = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setEvents(userData.postedEvents || []);
        setRatings(userData.receivedUserRatings || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 120, height: 120, fontSize: '2.5rem' }}>
              {getInitials(user.name)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={user.role === 'EVENT_MANAGEMENT' ? 'Event Manager' : 'User'} 
                color={user.role === 'EVENT_MANAGEMENT' ? 'primary' : 'default'}
              />
            </Box>
            {user.role === 'EVENT_MANAGEMENT' && (
              <Box display="flex" alignItems="center" gap={1}>
                <Rating value={user.averageRating || 0} precision={0.1} readOnly />
                <Typography variant="h6">{user.averageRating || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ({user.totalRatings || 0} reviews)
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {user.role === 'EVENT_MANAGEMENT' && (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab label="Overview" />
              <Tab label="Events" />
              <Tab label="Reviews" />
            </Tabs>
          </Paper>

          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Statistics</Typography>
                    <Box mt={2}>
                      <Typography>Total Events: {events.length}</Typography>
                      <Typography>Average Rating: {user.averageRating || 0}/5</Typography>
                      <Typography>Total Reviews: {user.totalRatings || 0}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Events Managed</Typography>
              <Grid container spacing={3}>
                {events.map((event) => (
                  <Grid item xs={12} md={6} key={event.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{event.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Rating value={event.averageRating || 0} size="small" readOnly />
                          <Typography variant="body2">
                            ({event.totalRatings || 0} reviews)
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {activeTab === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Reviews</Typography>
              <List>
                {ratings.map((rating) => (
                  <ListItem key={rating.id}>
                    <ListItemAvatar>
                      <Avatar>{getInitials(rating.rater.name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>{rating.rater.name}</Typography>
                          <Rating value={rating.rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(rating.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={rating.review}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

const EventList = () => {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleAcceptEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Event rejected!', severity: 'info' });
        fetchEvents();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reject event', severity: 'error' });
    }
  };

  const handleRateEvent = async () => {
    try {
      const response = await fetch(`${API_BASE}/ratings/event`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          rating,
          review
        })
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Rating submitted!', severity: 'success' });
        setRatingDialog(false);
        setRating(0);
        setReview('');
        fetchEvents();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to submit rating', severity: 'error' });
    }
  };

  const isAssignedTo = (event) => event.Assigned_To === user.username;
  const isPostedBy = (event) => event.Posted_By === user.username;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Events</Typography>
      
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Box>
                    <Typography variant="body2">
                      Posted by: {event.postedByUser.name}
                    </Typography>
                    <Typography variant="body2">
                      Assigned to: {event.assignedToUser.name}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={event.averageRating || 0} size="small" readOnly />
                    <Typography variant="body2">
                      ({event.totalRatings || 0})
                    </Typography>
                  </Box>
                </Box>

                <Box mt={2} display="flex" gap={1}>
                  {isAssignedTo(event) && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<Check />}
                        onClick={() => handleAcceptEvent(event.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Close />}
                        onClick={() => handleRejectEvent(event.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {!isPostedBy(event) && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Star />}
                      onClick={() => {
                        setSelectedEvent(event);
                        setRatingDialog(true);
                      }}
                    >
                      Rate
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={ratingDialog} onClose={() => setRatingDialog(false)}>
        <DialogTitle>Rate Event</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleRateEvent} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

const CreateEventDialog = ({ open, onClose, onEventCreated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignedTo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onEventCreated();
        onClose();
        setFormData({ name: '', description: '', assignedTo: '' });
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Event</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Assign To (Username)"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create Event</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Navigation = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState('events');
  const [createEventOpen, setCreateEventOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'profile':
        return <UserProfile />;
      case 'events':
        return <EventList />;
      default:
        return <EventList />;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Event Management System
          </Typography>
          
          <Button color="inherit" onClick={() => setCurrentPage('events')}>
            <Event sx={{ mr: 1 }} />
            Events
          </Button>
          
          <Button color="inherit" onClick={() => setCurrentPage('profile')}>
            <Person sx={{ mr: 1 }} />
            Profile
          </Button>

          {user?.role === 'EVENT_MANAGEMENT' && (
            <Button color="inherit" onClick={() => setCreateEventOpen(true)}>
              <Add sx={{ mr: 1 }} />
              Create Event
            </Button>
          )}

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Settings />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {renderContent()}

      <CreateEventDialog
        open={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onEventCreated={() => {
          setCurrentPage('events');
          window.location.reload();
        }}
      />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {user ? <Navigation /> : <LoginForm />}
    </Box>
  );
};

export default App;