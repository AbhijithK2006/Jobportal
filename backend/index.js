const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { User, Application } = require('./mongo');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World - Backend is running');
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password, role, location, skills } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
    });

    await user.save();
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', role: user.role, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Apply Route (MongoDB only)
app.post('/apply', async (req, res) => {
  const { jobId, jobTitle, jobCompany, applicantName, applicantEmail } = req.body;
  try {
    // Prevent duplicate applications for the same job by the same user
    const existing = await Application.findOne({ jobId, applicantEmail });
    if (existing) {
      return res.status(400).json({ message: 'Already applied.' });
    }
    const application = new Application({ jobId, jobTitle, jobCompany, applicantName, applicantEmail });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully!', _id: application._id });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Error submitting application' });
  }
});

// Fetch Applied Jobs Route (MongoDB)
app.get('/appliedJobs', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  try {
    const applications = await Application.find({ applicantEmail: email });
    const jobIds = applications.map(app => app.jobId);
    res.json({ jobIds });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applied jobs' });
  }
});

// Get all applications (admin)
app.get('/applications', async (req, res) => {
  try {
    const apps = await Application.find();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Get applications for a specific user
app.get('/applications/:email', async (req, res) => {
  try {
    const apps = await Application.find({ applicantEmail: req.params.email });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user applications' });
  }
});

// Delete application
app.delete('/applications/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application' });
  }
});

// Update application status
app.patch('/applications/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await Application.findByIdAndUpdate(req.params.id, { status });
    res.status(200).json({ message: 'Application status updated' });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
});

// Get user profile
app.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
app.patch('/update-profile', async (req, res) => {
  const { email, name, bio } = req.body;
  try {
    await User.findOneAndUpdate({ email }, { name, bio });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});