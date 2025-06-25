import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Loginpage({ setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Removed userRole parameter as the role will come from the backend response
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // The backend returns the user's role upon successful login
        setRole(data.role); // Set the role based on backend response
        navigate(data.role === 'admin' ? '/admin' : '/jobseeker');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Network error or server is down.');
    }
  };

  return (
    <div className="bg-[#f1faee] min-h-screen flex items-center justify-center py-10">
      <div className="max-w-md w-full bg-white px-10 py-10 rounded-2xl shadow-lg">
        <h2 className="text-center text-4xl font-bold text-[#511D43]">Log In</h2>
        <form className="grid gap-6 mt-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}> {/* Added onSubmit for form */}
          <div>
            <label className="text-xl font-medium">Email</label>
            <TextField
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
            />
          </div>
          <div>
            <label className="text-xl font-medium">Password</label>
            <TextField
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
            />
          </div>

          <Button
            type="submit" // Changed type to "submit" to trigger form submission
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#511D43',
              '&:hover': { backgroundColor: '#555' },
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
