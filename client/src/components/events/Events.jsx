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
      await axios.post('http://localhost:5000/courses/add', {
        name,
        description,
        event,
        price,
        duration,
        notes,
      });
      alert('Course added successfully');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  return (
    <div>
      <h2>Add Course</h2>
      <input type="text" placeholder="Course Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="event" value={event} onChange={(e) => setevent(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Duration (hours)" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <input type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button onClick={handleAddEvent}>Add Course</button>
    </div>
  );
};

export default AddEvent;
