// Home/JobForm.jsx
import React, { useState } from 'react';

function JobForm({ onCreate }) {
  const [form, setForm] = useState({
    company: '',
    title: '',
    salary: '',
    location: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
    setForm({ company: '', title: '', salary: '', location: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[#511D43]">Post a New Job</h2>
      <div className="grid gap-3">
        <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" required className="p-2 border rounded" />
        <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" required className="p-2 border rounded" />
        <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" required className="p-2 border rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="p-2 border rounded" />
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded">
          Create Job
        </button>
      </div>
    </form>
  );
}

export default JobForm;