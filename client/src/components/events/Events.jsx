import React, { useState } from 'react';
import axios from 'axios';

const AddEvent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [event, setevent] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddEvent = async () => {
    try {
      await axios.post('http://localhost:5000/Events/add', {
        name,
        description,
        event,
        price,
        duration,
        notes,
      });
      alert('Event added successfully');
    } catch (error) {
      console.error('Error adding Event:', error);
      alert('Failed to add Event');
    }
  };

  return (
    <div>
      <h2>Add Event</h2>
      <input type="text" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="event" value={event} onChange={(e) => setevent(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Duration (hours)" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <input type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button onClick={handleAddEvent}>Add Event</button>
    </div>
  );
};

export default AddEvent;
