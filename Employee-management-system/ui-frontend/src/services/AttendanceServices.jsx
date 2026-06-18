import axios from "axios";

const API = "http://127.0.0.1:8000";

// CREATE OR GET ACCESS
export const getAttendanceAccess = async (email) => {
  return axios.get(`${API}/attendance/access/${email}`);
};

// HISTORY
export const getAttendanceHistory = async (email) => {
  return axios.get(`${API}/attendance/history/${email}`);
};

// CHECKIN
export const punchInAPI = async (email) => {
  return axios.post(`${API}/attendance/checkin`, { email });
};

// CHECKOUT
export const punchOutAPI = async (email) => {
  return axios.post(
    `${API}/attendance/checkout`,
    {
      email: email
    }
  );
};



export const getAttendanceRequests =
async (companyId, email) => {

  const response = await axios.get(
    `${API}/attendance/requests/${companyId}/${email}`
  );

  return response.data;
};


export const getTodayAttendance =
async (email) => {

  return axios.get(
    `${API}/attendance/today/${email}`
  );

};

export const getTotalHours =
async (email) => {

  return axios.get(
    `${API}/attendance/total-hours/${email}`
  );

};















