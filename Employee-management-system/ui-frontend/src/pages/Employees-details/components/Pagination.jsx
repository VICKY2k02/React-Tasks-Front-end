import React from "react";

const Pagination = ({
  totalEmployees,
  employeesPerPage,
  currentPage,
  setCurrentPage
}) => {
  const pages = [];

  for (
    let i = 1;
    i <= Math.ceil(totalEmployees / employeesPerPage);
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="pagination">

      {pages.map((page) => (
        <button
          key={page}
          className={currentPage === page ? "active-page" : ""}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

    </div>
  );
};

export default Pagination;