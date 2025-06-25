
import React from 'react';

function JobSearch({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid md:grid-cols-4 gap-4">
      <input
        type="text"
        name="title"
        placeholder="Search Job Title"
        value={filters.title}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        name="salary"
        placeholder="Search Salary"
        value={filters.salary}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        name="location"
        placeholder="Search Location"
        value={filters.location}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded"
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">All Categories</option>
        <option value="IT">IT</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
        <option value="Finance">Finance</option>
      </select>
    </div>
  );
}

export default JobSearch;