import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import socketio from 'socket.io-client';
import './styles.css';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);

  const user_id = localStorage.getItem('user'); // 'User' was saved in the Login page.
  const socket = useMemo(() => socketio('http://localhost:3333', {
    query: { user_id },
  }), [user_id]);

  useEffect(() => {
    socket.on('booking_request', data => {
      console.log(data);
      setRequests([...requests, data]);
    })
  }, [requests, socket]);

  useEffect(() => {
    async function loadSpots() {
      const user_id = localStorage.getItem('user'); // 'User' was saved in the Login page.
      const response = await api.get('/dashboard', {
        headers: { user_id }
      });
      console.log(response.data);
      setSpots(response.data);
    }

    loadSpots();
  }, []);

  async function handleAccept(id) {
    await api.post(`/bookings/${id}/approvals`);

    setRequests(requests.filter(request => request._id !== id));
  };

  async function handleDecline(id) {
    await api.post(`/bookings/${id}/declines`);

    setRequests(requests.filter(request => request._id !== id));
  };

  return (
    <>
    <ul className='notifications'>
      {requests.map(request =>(
        <li key={request._id}>
          <p>
            <strong>{request.user.email}</strong> requested a spot at <strong>{request.spot.company}</strong> on: <strong>{request.date}</strong>
          </p>

          <button className="accept" onClick={() => handleAccept(request._id)}>Accept</button>
          <button className="decline" onClick={() => handleDecline(request._id)}>Decline</button>
        </li>
      ))}
    </ul>

    <ul className="spot-list">
      {spots.map(spot => (
        <li key={spot._id}>
          <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }}/>
          <strong>{spot.company}</strong>
          <span>{spot.price ? `€${spot.price}/day` : 'FREE'}</span>
        </li>
      ))}
    </ul>

    <Link to="/new">
      <button className="btn">Register new spot!</button>
    </Link>
    </>
  );
};
