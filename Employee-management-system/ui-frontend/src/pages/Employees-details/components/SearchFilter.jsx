import React from "react";
// import { FaSearch } from "react-icons/fa";

const SearchFilter = ({
  search,
  setSearch,
  department,
  setDepartment
}) => {
  return (
    <div className="search-filter">
      {/* <FaSearch className="search-icon" /> */}
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