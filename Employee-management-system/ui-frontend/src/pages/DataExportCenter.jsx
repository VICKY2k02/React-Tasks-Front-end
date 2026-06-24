import { useState, useEffect } from "react";
import "./DataExport.css";
import { exportData, getExportHistory, clearExportHistory } from "../services/EmployeeService";


const DataExportCenter = () => {
  const [selectedData, setSelectedData] = useState([]);

  const [format, setFormat] = useState("excel");

  // Temporary export history
  const [exportHistory, setExportHistory] = useState([]);

useEffect(() => {
  loadHistory();
}, []);

const loadHistory = async () => {
  try {
    const data = await getExportHistory();
    setExportHistory(data);
  } catch (error) {
    console.log(error);
  }
};

  const exportOptions = [
    "Employees",
    "Attendance",
    "Leave Requests",
    "Audit Logs",
    "Notifications",
    "Analytics",
  ];

  const handleCheckbox = (item) => {
    if (selectedData.includes(item)) {
      setSelectedData(
        selectedData.filter((d) => d !== item)
      );
    } else {
      setSelectedData([...selectedData, item]);
    }
  };

const handleExport = async () => {
  if (selectedData.length === 0) {
    alert("Please select at least one dataset.");
    return;
  }

  try {
    for (const item of selectedData) {

      const backendName = item
        .toLowerCase()
        .replace(/ /g, "_");

      const blob = await exportData(
        backendName,
        format
      );

      const url = window.URL.createObjectURL(
        new Blob([blob])
      );

      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `${backendName}.${format === "excel" ? "xlsx" : format}`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    await loadHistory();
    alert("Export Success");
  }
  catch (error) {
    console.log(error);
    alert("Export Failed");
  }
};

const handleClearHistory = async () => {
  try {
    await clearExportHistory();

    setExportHistory([]);

    alert("Export history cleared");
  } catch (error) {
    console.log(error);
    alert("Clear failed");
  }
};

  return (
    <div className="data-export-page">

      <h1>Data Export Center</h1>

      <div className="export-card">

        <h2>Export</h2>

        {exportOptions.map((item) => (
          <label
            key={item}
            className="checkbox-row"
          >
            <input
              type="checkbox"
              checked={selectedData.includes(item)}
              onChange={() =>
                handleCheckbox(item)
              }
            />
            {item}
          </label>
        ))}

        <hr />

        <h2>Formats</h2>

        <label className="radio-row">
          <input
            type="radio"
            value="csv"
            checked={format === "csv"}
            onChange={(e) =>
              setFormat(e.target.value)
            }
          />
          CSV
        </label>

        <label className="radio-row">
          <input
            type="radio"
            value="excel"
            checked={format === "excel"}
            onChange={(e) =>
              setFormat(e.target.value)
            }
          />
          Excel
        </label>

        <label className="radio-row">
          <input
            type="radio"
            value="pdf"
            checked={format === "pdf"}
            onChange={(e) =>
              setFormat(e.target.value)
            }
          />
          PDF
        </label>

        <button
          className="export-btn"
          onClick={handleExport}
        >
          Export
        </button>
      </div>

      <div className="history-card">


        <div className="history-header">
          <h2>Export History</h2>

          <button
            className="clear-history-btn"
            onClick={handleClearHistory}
          >
            Clear History
          </button>
        </div>

        <table className="export-table">

          <thead>
            <tr>
              <th>Who Exported</th>
              <th>When</th>
              <th>What Data</th>
              <th>Format</th>
            </tr>
          </thead>

          <tbody>
            {exportHistory.length > 0 ? (
              exportHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.who_exported}</td>
                  <td>{item.when}</td>
                  <td>{item.what_data}</td>
                  <td>{item.format}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No export history</td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DataExportCenter;