import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    window.console.log({ email, password });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="email">
        Email :
        <input
          autoComplete="username"
          type="email"
          value={email}
          name="email"
          onChange={handleEmailChange}
          id="email"
        />
      </label>
      <label htmlFor="password">
        Password :
        <input
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          type="password"
          name="password"
          id="password"
        />
      </label>
      <input type="submit" value="OK" />
    </form>
  );
}
