import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Person, Work, VerifiedUser, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function UserDash({ jobs: initialJobs = [], setJobs, userEmail }) {
  const [jobs, setLocalJobs] = useState(initialJobs);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [view, setView] = useState('dashboard');
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
  const [filters, setFilters] = useState({ type: '', location: '', industry: '' });
  const [loading, setLoading] = useState(true);

  // Load profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      if (userEmail) {
        setProfile(prev => ({ ...prev, email: userEmail }));
        try {
          const response = await fetch(`http://localhost:3000/profile/${userEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setProfile(userData);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, [userEmail]);

  // Fetch jobs if not passed as props
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:3000/jobs');
        if (res.ok) {
          let data = await res.json();
          data = data.map(job => ({
            ...job,
            id: job.id || job._id?.toString()
          }));
          setLocalJobs(data);
          setJobs && setJobs(data);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    if (!initialJobs || initialJobs.length === 0) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [initialJobs, setJobs]);

  // Fetch applied jobs for the user
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!profile.email) {
        setAppliedJobIds([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/appliedJobs?email=${profile.email}`);
        if (response.ok) {
          const data = await response.json();
          setAppliedJobIds((data.jobIds || []).map(id => id.toString()));
        } else {
          setAppliedJobIds([]);
        }
      } catch (err) {
        setAppliedJobIds([]);
      }
    };
    fetchAppliedJobs();
  }, [profile.email]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profile.name && profile.email) {
      try {
        const response = await fetch('http://localhost:3000/update-profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        if (response.ok) {
          alert('✅ Profile updated!');
          setProfile({ ...profile });
          setView('dashboard');
        } else {
          alert('⚠️ Failed to update profile.');
        }
      } catch (error) {
        alert('❌ Error updating profile.');
      }
    } else {
      alert('⚠️ Please complete all required fields.');
    }
  };

  const handleApply = async (jobId) => {
    if (appliedJobIds.includes(jobId.toString())) {
      return alert('⚠️ You have already applied to this job.');
    }
    const job = jobs.find(j => j.id === jobId || j._id === jobId);
    if (!job) return;
    try {
      const response = await fetch('http://localhost:3000/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          jobCompany: job.company,
          applicantName: profile.name || 'User',
          applicantEmail: profile.email || 'user@example.com',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAppliedJobIds([...appliedJobIds, job.id.toString()]);
        alert('🎉 Application submitted!');
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (err) {
      alert('❌ Failed to apply. Please try again.');
    }
  };

  const handleSave = (jobId) => {
    setSavedJobIds(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const updated = jobs.filter(job => job.id !== id);
      setLocalJobs(updated);
      setJobs && setJobs(updated);
    }
  };

  // Remove application handler for applied jobs tab
  const handleRemoveApplication = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3000/applications/${profile.email}`);
      if (response.ok) {
        const apps = await response.json();
        const appToDelete = apps.find(app => app.jobId === jobId.toString());
        if (!appToDelete) {
          alert('Application not found.');
          return;
        }
        const delRes = await fetch(`http://localhost:3000/applications/${appToDelete._id}`, {
          method: 'DELETE'
        });
        if (delRes.ok) {
          setAppliedJobIds(appliedJobIds.filter(id => id !== jobId.toString()));
          alert('Application removed.');
        } else {
          alert('Failed to remove application.');
        }
      }
    } catch (err) {
      alert('Error removing application.');
    }
  };

  const filteredJobs = jobs.filter(job =>
    (filters.type === '' || job.type === filters.type) &&
    (filters.location === '' || job.location === filters.location) &&
    (filters.industry === '' || job.industry === filters.industry)
  );

  const appliedJobs = jobs.filter(job => appliedJobIds.includes(job.id?.toString()));
  const uniqueValues = (key) => [...new Set(jobs.map(job => job[key]))];

  if (loading) {
    return <div className="text-center mt-20 text-lg">🔄 Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f1faee]">
      {/* Navbar */}
      <nav className="bg-white text-black p-4 flex justify-between rounded-b-4xl shadow-lg fixed w-full top-0 left-0 z-30">
        <Link to="/" className="font-bold text-2xl px-13">Job Portal</Link>
        <div className="space-x-4 flex gap-3">
          <div className='text-2xl font-bold'>Hi {profile.name || 'User'} </div>
          <button onClick={() => window.location.href = '/'} className='bg-[#f1faee] text-black rounded-4xl px-4 py-1 hover:bg-[#511D43] hover:text-white font-medium'>Log Out</button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white text-black p-4 space-y-4 z-20 rounded-3xl shadow-lg pt-20">
        <h2 className="text-xl font-bold text-center text-[#511D43]">User Dashboard</h2>
        {['dashboard', 'applied', 'profile'].map(section => (
          <button key={section} onClick={() => setView(section)} className="w-full py-2 rounded hover:bg-[#511D43] hover:text-white font-medium capitalize">{section}</button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 ml-67 pt-24">
        {view === 'dashboard' && (
          <section className="bg-white p-6 rounded shadow">
            <div className="flex items-center gap-4 mb-4">
              <VerifiedUser className="text-green-500" fontSize="large" />
              <h2 className="text-2xl font-bold text-[#511D43]">Welcome, {profile.name || 'User'}!</h2>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="bg-purple-100 p-4 rounded text-center">
                <Person className="text-purple-600 mb-2" />
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded text-center">
                <Work className="text-blue-600 mb-2" />
                <p><strong>Total Jobs:</strong> {jobs.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded text-center">
                <VerifiedUser className="text-green-600 mb-2" />
                <p><strong>Applications:</strong> {appliedJobIds.length}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {['type', 'location', 'industry'].map(key => (
                <FormControl key={key} fullWidth>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    value={filters[key]}
                    label={key}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    {uniqueValues(key).map((val, idx) => (
                      <MenuItem key={idx} value={val}>{val}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </div>

            {/* Job Listings */}
            <h3 className="text-xl font-semibold text-[#511D43] mb-4">🔥 Recommended Jobs</h3>
            {filteredJobs.length === 0 ? (
              <p className="text-gray-600 italic">🚫 No matching jobs found.</p>
            ) : (
              <div className="grid gap-4">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-white p-4 rounded shadow flex">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`}
                        alt={job.company}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                        className="w-12 h-12 rounded-full mr-4 object-contain bg-gray-100"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#511D43]">{job.title}</h4>
                      <p className="text-gray-700">{job.company} • {job.location}</p>
                      <p className="text-sm text-gray-500">{job.industry} | {job.type}</p>
                      <div className="mt-3 flex gap-3 items-center">
                        <Button
                          variant="contained"
                          onClick={() => handleApply(job.id)}
                          disabled={appliedJobIds.includes(job.id?.toString())}
                        >
                          {appliedJobIds.includes(job.id?.toString()) ? 'Applied' : 'Apply'}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
                        </Button>
                        <Button onClick={() => handleSave(job.id)}>
                          {savedJobIds.includes(job.id) ? <Bookmark /> : <BookmarkBorder />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Applied Jobs */}
        {view === 'applied' && (
          <section>
            <h2 className="text-2xl font-bold text-[#511D43] mb-4">📌 Applied Jobs</h2>
            {appliedJobs.length === 0 ? (
              <p className="text-gray-600">You haven’t applied for any jobs yet.</p>
            ) : (
              <div className="grid gap-4">
                {appliedJobs.map(job => (
                  <div key={job.id} className="p-4 bg-white rounded shadow flex items-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`}
                        alt={job.company}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                        className="w-12 h-12 rounded-full mr-4 object-contain bg-gray-100"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveApplication(job.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Profile Update */}
        {view === 'profile' && (
          <section className="max-w-2xl bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-[#511D43] mb-4">📝 Update Your Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. abc@example.com"
                  readOnly
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="4"
                  placeholder="Brief bio about you"
                />
              </div>
              <button type="submit" className="bg-[#511D43] text-white px-4 py-2 rounded hover:bg-pink-700">
                Save Profile
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default UserDash;