import axios from "axios";

const API = "http://127.0.0.1:8000";

export const submitLeave = (data) =>
  axios.post(`${API}/leave/request`, data);

export const getMyLeaves = (email) =>
  axios.get(`${API}/leave/my/${email}`);

export const getCompanyLeaves = (companyId) =>
  axios.get(`${API}/leave/company/${companyId}`);

export const approveLeave = (id) =>
  axios.put(`${API}/leave/approve/${id}`);

export const rejectLeave = (id) =>
  axios.put(`${API}/leave/reject/${id}`);