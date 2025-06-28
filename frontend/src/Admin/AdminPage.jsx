import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminPage({ jobs, setJobs }) {
  const [view, setView] = useState('jobs');
  const [applications, setApplications] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: '',
    status: 'pending',
    image: null,
    company: '',
    industry: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:3000/applications');
      if (res.status === 401) {
        console.error('Unauthorized: Check API permissions or login.');
        setApplications([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        console.error('Unexpected format from /applications:', data);
        setApplications([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setApplications([]);
    }
  };

  const handleAddJob = () => {
    const { title, description, requirements, location, salary, type, company, industry } = newJob;
    if (!title || !description || !requirements || !location || !salary || !type || !company || !industry) {
      alert('Please fill all fields.');
      return;
    }

    const newId = Date.now();
    setJobs([...jobs, { ...newJob, id: newId, applicants: [] }]);
    setNewJob({
      title: '',
      description: '',
      requirements: '',
      location: '',
      salary: '',
      type: '',
      status: 'pending',
      image: null,
      company: '',
      industry: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  const startEditing = (job) => {
    setEditingId(job.id);
    setEditFields({ ...job });
  };

  const saveEdit = () => {
    setJobs(jobs.map((job) => (job.id === editingId ? editFields : job)));
    setEditingId(null);
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchApplications();
      else alert('Failed to update status.');
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const removeAcceptedApplication = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/applications/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchApplications();
      else alert('Failed to remove application');
    } catch (err) {
      console.error(err);
      alert('Error removing application');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Navbar */}
      <nav className="bg-white text-black p-4 flex justify-between rounded-b-4xl shadow-lg fixed w-full top-0 left-0 z-30">
        <Link to="/" className="font-bold text-2xl px-13">Job Portal</Link>
        <div className="space-x-4 flex gap-3">
          <div className='text-2xl font-bold'>Hi Admin</div>
          <button onClick={() => window.location.href = '/'} className='bg-[#f1faee] text-black rounded-4xl px-4 py-1 hover:bg-[#511D43] hover:text-white font-medium'>Log Out</button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white text-black p-4 space-y-4 z-20 rounded-3xl shadow-lg pt-20">
        <h2 className="text-xl font-bold text-center text-[#511D43]">Admin Dashboard</h2>
        <nav className="space-y-2">
          <button onClick={() => setView('jobs')} className="w-full py-2 rounded hover:bg-[#511D43] hover:text-white font-medium">Manage Jobs</button>
          <button onClick={() => setView('applications')} className="w-full py-2 rounded hover:bg-[#511D43] hover:text-white font-medium">View Applications</button>
          <button onClick={() => setView('accepted')} className="w-full py-2 rounded hover:bg-[#511D43] hover:text-white font-medium">Accepted Applications</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#f1faee] overflow-y-auto ml-64 pt-24">
        <h2 className="text-3xl font-bold text-[#511D43] mb-6">
          {view === 'jobs' && 'Manage Job Listings'}
          {view === 'applications' && 'User Applications'}
          {view === 'accepted' && 'Accepted Applications'}
        </h2>

        {/* JOBS SECTION */}
        {view === 'jobs' && (
          <>
            {/* Add Job Form */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-[#511D43] mb-4">Add New Job</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {['Title', 'Location', 'Salary', 'Company', 'Industry'].map(field => (
                  <TextField
                    key={field}
                    label={field}
                    value={newJob[field.toLowerCase()]}
                    onChange={(e) => setNewJob({ ...newJob, [field.toLowerCase()]: e.target.value })}
                    fullWidth
                  />
                ))}
                <TextField
                  select
                  label="Job Type"
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  fullWidth
                >
                  {['Full-time', 'Part-time', 'Internship'].map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} fullWidth multiline />
                <TextField label="Requirements" value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} fullWidth multiline />
                <div className="col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Upload Company Logo</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setNewJob({ ...newJob, image: imageUrl });
                    }
                  }} />
                  {newJob.image && <img src={newJob.image} alt="Preview" className="h-20 mt-2" />}
                </div>
              </div>
              <Button variant="contained" onClick={handleAddJob} sx={{ backgroundColor: '#511D43', mt: 2 }}>
                Add Job
              </Button>
            </div>

            {/* Job List */}
            <div className="grid gap-6 max-w-4xl mx-auto">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-xl shadow-md">
                  {editingId === job.id ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {['Title', 'Location', 'Salary', 'Company', 'Industry'].map(field => (
                        <TextField
                          key={field}
                          label={field}
                          value={editFields[field.toLowerCase()]}
                          onChange={(e) => setEditFields({ ...editFields, [field.toLowerCase()]: e.target.value })}
                        />
                      ))}
                      <TextField select label="Job Type" value={editFields.type} onChange={(e) => setEditFields({ ...editFields, type: e.target.value })}>
                        {['Full-time', 'Part-time', 'Internship'].map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                      <TextField label="Description" value={editFields.description} onChange={(e) => setEditFields({ ...editFields, description: e.target.value })} multiline />
                      <TextField label="Requirements" value={editFields.requirements} onChange={(e) => setEditFields({ ...editFields, requirements: e.target.value })} multiline />
                      <div className="col-span-2">
                        <label className="block mb-1 font-medium text-gray-700">Update Logo</label>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setEditFields({ ...editFields, image: imageUrl });
                          }
                        }} />
                        {editFields.image && <img src={editFields.image} alt="Preview" className="h-20 mt-2" />}
                      </div>
                      <Button variant="contained" onClick={saveEdit} sx={{ backgroundColor: '#511D43' }}>Save</Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold text-[#511D43]">{job.title}</h3>
                      <p><strong>Company:</strong> {job.company}</p>
                      <p><strong>Location:</strong> {job.location}</p>
                      <p><strong>Salary:</strong> {job.salary}</p>
                      <p><strong>Status:</strong> {job.status}</p>
                      {job.image && <img src={job.image} alt="Logo" className="h-16 my-2" />}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button variant="contained" onClick={() => startEditing(job)} startIcon={<EditIcon />} sx={{ backgroundColor: '#1e3a8a' }}>Edit</Button>
                        <Button variant="contained" onClick={() => handleDelete(job.id)} startIcon={<DeleteIcon />} sx={{ backgroundColor: '#000000' }}>Delete</Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* APPLICATIONS */}
        {view === 'applications' && Array.isArray(applications) && (
          <div className="max-w-4xl mx-auto space-y-4">
            {applications.filter(app => app.status !== 'accepted').map((app) => (
              <div key={app._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-[#511D43]">{app.applicantName}</h4>
                  <p>Applied for: {app.jobTitle} @ {app.jobCompany}</p>
                  <p>Email: {app.applicantEmail}</p>
                  <p>Date: {new Date(app.dateApplied).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => updateApplicationStatus(app._id, 'accepted')}>Accept</Button>
                  <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => removeAcceptedApplication(app._id)}>Decline</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACCEPTED APPLICATIONS */}
        {view === 'accepted' && Array.isArray(applications) && (
          <div className="max-w-4xl mx-auto space-y-4">
            {applications.filter(app => app.status === 'accepted').map((app) => (
              <div key={app._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-[#511D43]">{app.applicantName}</h4>
                  <p>Applied for: {app.jobTitle} @ {app.jobCompany}</p>
                  <p>Email: {app.applicantEmail}</p>
                  <p>Date: {new Date(app.dateApplied).toLocaleString()}</p>
                  <p className="text-green-600 font-semibold">Status: Accepted</p>
                </div>
                <div>
                  <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeAcceptedApplication(app._id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;