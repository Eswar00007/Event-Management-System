import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Avatar, Rating, Chip, Tabs, Tab, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Divider, Button, Stack, LinearProgress } from '@mui/material';
import {Dashboard as DashboardIcon, Event as EventIcon, Reviews as ReviewsIcon, Person as PersonIcon, Edit as EditIcon, Security as SecurityIcon, Notifications as NotificationsIcon, Info as InfoIcon, Analytics as AnalyticsIcon, TrendingUp as TrendingUpIcon, Email as EmailIcon } from '@mui/icons-material';

const UserProfilePage = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error" textAlign="center">
          User not found
        </Typography>
      </Container>
    );
  }

  const isEventManager = user.role === 'EVENT_MANAGEMENT';

  const OverviewTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AnalyticsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Statistics
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Total Events:</Typography>
                <Typography fontWeight="bold">{user.postedEvents?.length || 0}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Average Rating:</Typography>
                <Typography fontWeight="bold">{user.averageRating}/5</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Total Reviews:</Typography>
                <Typography fontWeight="bold">{user.totalRatings}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Member Since:</Typography>
                <Typography fontWeight="bold">{formatDate(user.createdAt)}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Recent Performance
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" gutterBottom>Last Login</Typography>
                <Typography color="text.secondary">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>Recent Reviews</Typography>
                <Typography color="text.secondary">
                  {user.receivedUserRatings?.length || 0} reviews in total
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const EventsTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Events Managed
      </Typography>
      <Grid container spacing={3}>
        {user.postedEvents?.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={event.averageRating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">
                    {event.averageRating} ({event.totalRatings} reviews)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const ReviewsTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Recent Reviews
      </Typography>
      <List>
        {user.receivedUserRatings?.map((review, index) => (
          <React.Fragment key={review.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {getInitials(review.rater.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">
                      {review.rater.name}
                    </Typography>
                    <Rating value={review.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.review}
                  </Typography>
                }
              />
            </ListItem>
            {index < user.receivedUserRatings.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  const RegularUserProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Profile Information
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Account Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1">{user.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Username</Typography>
                  <Typography variant="body1">@{user.username}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>Activity</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Last Login</Typography>
                  <Typography variant="body1">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Account Status</Typography>
                  <Chip label="Active" color="success" size="small" />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <EditIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Quick Actions
          </Typography>
          <Stack spacing={2}>
            <Button variant="outlined" fullWidth startIcon={<EditIcon />}>
              Edit Profile
            </Button>
            <Button variant="outlined" fullWidth startIcon={<SecurityIcon />}>
              Change Password
            </Button>
            <Button variant="outlined" fullWidth startIcon={<NotificationsIcon />}>
              Notification Settings
            </Button>
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Account Summary
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Role:</Typography>
              <Chip label="User" size="small" />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Events Attended:</Typography>
              <Typography variant="body2" fontWeight="bold">12</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Reviews Given:</Typography>
              <Typography variant="body2" fontWeight="bold">8</Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar 
              sx={{ width: 120, height: 120, fontSize: '2.5rem', bgcolor: 'primary.main' }}
            >
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
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip 
                label={isEventManager ? 'Event Manager' : 'User'} 
                color={isEventManager ? 'primary' : 'default'}
                variant="filled"
              />
              <Chip 
                icon={<EmailIcon />}
                label={user.email}
                variant="outlined"
              />
            </Stack>
            {isEventManager && (
              <Stack direction="row" spacing={4} alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={user.averageRating} precision={0.1} readOnly />
                  <Typography variant="h6">{user.averageRating}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({user.totalRatings} reviews)
                  </Typography>
                </Box>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Content Section */}
      {isEventManager ? (
        <>
          {/* Event Manager Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab 
                label="Overview" 
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Events History" 
                icon={<EventIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Reviews" 
                icon={<ReviewsIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {activeTab === 0 && <OverviewTab />}
          {activeTab === 1 && <EventsTab />}
          {activeTab === 2 && <ReviewsTab />}
        </>
      ) : (
        /* Regular User Profile */
        <RegularUserProfile />
      )}
    </Container>
  );
};

export default UserProfilePage;