import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);

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

  return (
    <>
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
