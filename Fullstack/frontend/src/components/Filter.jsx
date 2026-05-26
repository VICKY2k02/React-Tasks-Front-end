function FilterRole({
  role,
  setRole
}) {

  return (

    <select
      className="filter"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    >

      <option>All</option>
      <option>Developer</option>
      <option>Designer</option>
      <option>Manager</option>

    </select>

  );
}

export default FilterRole;