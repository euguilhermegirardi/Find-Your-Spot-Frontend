import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import camera from '../../assets/camera.svg';
import './styles.css';

export default function New({ history }) {
  const [company, setCompany] = useState('');
  const [services, setServices] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null
  },[thumbnail])

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('services', services);
    data.append('price', price);

    const user_id = localStorage.getItem('user');

    await api.post('/spots', data, {
      headers: { user_id }
    });

    history.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label id="thumbnail" style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? 'has-thumbnail' : ''}
      >
        <input type="file" onChange={event => setThumbnail(event.target.files[0])}/>
        <img src={camera} alt="Select img"/>
      </label>

      <label htmlFor="company">Company *</label>
      <input
        id="company"
        placeholder="Your comapny"
        value={company}
        onChange={event => setCompany(event.target.value)}
      />

      <label htmlFor="services">Services * <span>(separated with commas)</span></label>
      <input
        id="services"
        placeholder="Which service?"
        value={services}
        onChange={event => setServices(event.target.value)}
      />

      <label htmlFor="price">Price per day * <span>(leave blank for FREE)</span></label>
      <input
        id="price"
        placeholder="Price per day"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />

      <button className="btn">Register!</button>
    </form>
  );
};
