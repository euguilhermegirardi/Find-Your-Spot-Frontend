import React, { useState } from 'react';
import api from '../../services/api';
import logo from '../../assets/logo.png';

export default function Login({ history }) {
  const [email, setEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    // get the email
    const response = await api.post('/sessions', { email });
    // console.log(response)

    const { _id } = response.data;
    // console.log(_id);

    localStorage.setItem('user', _id); // to check go to 'Application > Local Storage"
    // create 'user' passing the _id.

    history.push('/dashboard');
  };

  return (
    <>
      <img src={logo} alt="logo" />
      <p>Offer <strong>spots</strong> for customers and find new <strong>talents</strong> for your company.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail *</label>
        <input
          type="email"
          id="email"
          placeholder="Your email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <button className="btn" type="submit">Enter</button>
      </form>
    </>
  )
};
