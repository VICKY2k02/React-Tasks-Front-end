import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getActivityLogs = async () => {
  const companyId = localStorage.getItem("company_id");

  const res = await axios.get(
    `${API}/activity/${companyId}`
  );

  return res.data;
};


export const clearActivityLogs = async () => {
  const companyId = localStorage.getItem("company_id");

  await axios.delete(
    `${API}/activity/clear/${companyId}`
  );
};