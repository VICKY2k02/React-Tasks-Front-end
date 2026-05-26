import React from "react";

const SearchFilter = ({
  search,
  setSearch,
  department,
  setDepartment
}) => {
  return (
    <div className="search-filter">

      <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">All Departments</option>
        <option value="Engineering">Engineering</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
      </select>

    </div>
  );
};

export default SearchFilter;