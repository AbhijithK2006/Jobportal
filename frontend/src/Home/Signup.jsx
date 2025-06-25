import React, { useState } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    location: '',
    skills: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => { // Added 'async'
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', { // Connect to backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          location: formData.location,
          skills: formData.skills,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login'); // Redirect to Login page on successful signup
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Network error or server is down.');
    }
  };

  return (
    <div className='bg-[#f1faee] min-h-screen flex items-center justify-center py-30'>
      <div className='max-w-md w-full bg-white px-10 py-10 rounded-2xl shadow-lg'>
        <h2 className="text-center text-4xl font-bold text-[#511D43]">Sign Up</h2>

        <form onSubmit={handleSubmit} className="grid gap-5 mt-6">
          <TextField
            label="Full Name"
            name="name"
            variant="outlined"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            label="Re-enter Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="jobseeker">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Location"
            name="location"
            variant="outlined"
            fullWidth
            value={formData.location}
            onChange={handleChange}
          />
          <TextField
            label="Skills (comma separated)"
            name="skills"
            variant="outlined"
            fullWidth
            value={formData.skills}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#511D43',
              '&:hover': { backgroundColor: '#555' }
            }}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;