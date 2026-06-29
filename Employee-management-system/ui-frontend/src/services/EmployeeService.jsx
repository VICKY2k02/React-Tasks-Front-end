import axios from "axios";

const API_URL = "http://127.0.0.1:8000/employees";


const getHeaders = () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return {
    "company-id": user?.company_id,
  };
};

// GET EMPLOYEES
export const getEmployees = async () => {

  try {

    const response = await axios.get(
      API_URL,
      {
        headers: getHeaders()
      }
    );

    return response.data;

  } catch (error) {

    console.log("GET ERROR:", error);

    return [];
  }
};


// ADD EMPLOYEE
export const addEmployee = async (employeeData) => {

  try {

    console.log("POSTING DATA:", employeeData);

    const response = await axios.post(
      API_URL,
      employeeData,
      {
        headers: getHeaders()
      }
    );

    return response.data;

  } catch (error) {

    console.log("POST ERROR:", error);

    throw error;
  }
};


// DELETE EMPLOYEE

export const deleteEmployee = async (id) => {

  const response =  axios.delete(
      `http://127.0.0.1:8000/employees/${id}`,
      {
        headers: getHeaders()
      }
    );
  return response.data;
};


// UPDATE STATUS

export const updateEmployeeStatus = async (
  id,
  status
) => {

  const response = axios.put(
    `http://127.0.0.1:8000/employees/${id}/status?status=${status}`,
    {},
    {
      headers: getHeaders()
    }
  );

  return response.data;
};


// UPDATE EMPLOYEE

export const updateEmployee = async (
  id,
  employeeData
) => {

  const response=axios.put(
    `http://127.0.0.1:8000/employees/${id}`,
    employeeData,
    {
      headers: getHeaders()
    }
  );
  return response.data;
};


export const requestRoleChange = async (data) => {

  const response = await axios.post(
    "http://127.0.0.1:8000/request-role-change",
    data
  );

  return response.data;
};


export const getRoleRequests = async (
  adminEmail
) => {

  const response =
    await axios.get(
      `http://127.0.0.1:8000/role-requests/${adminEmail}`
    );

  return response.data;

};
export const approveRoleRequest = async (
  userEmail
) => {

  const response =
    await axios.post(
      "http://127.0.0.1:8000/approve-role-request",
      userEmail,
      {
        headers: {
          "Content-Type":
            "application/json"
        }
      }
    );

  return response.data;
};



export const rejectRoleRequest =
  async (userEmail) => {

  const response = await axios.post(
    "http://127.0.0.1:8000/reject-role-request",
    userEmail,
    {
      headers: {
        "Content-Type":
          "application/json"
      }
    }
  );

  return response.data;
};


// Audit Logs

export const getAuditLogs = async () => {

  const response = await axios.get(
    "http://127.0.0.1:8000/audit-logs",
    {
      headers: getHeaders()
    }
  );

  return response.data;
};



export const clearAuditLogs = async () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const response = await axios.delete(
    "http://127.0.0.1:8000/audit-logs/clear",
    {
      headers: {
        "company-id": user.company_id
      }
    }
  );

  return response.data;
};



export const getDashboardStats = async () => {

  const response = await axios.get(
    "http://127.0.0.1:8000/dashboard-stats",
    {
      headers: getHeaders()
    }
  );

  return response.data;
};

export const getRoleStats = async () => {

  const response = await axios.get(
    "http://127.0.0.1:8000/role-stats",
    {
      headers: getHeaders()
    }
  );

  return response.data;
};





export const transferDepartment = async (
  id,
  department
) => {
  const response = await axios.put(
    `http://127.0.0.1:8000/employees/${id}/transfer?department=${department}`,
    {},
    {
      headers: getHeaders()
    }
  );

  return response.data;
};




export const exportData = async (data, format) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await axios.post(
    "http://127.0.0.1:8000/exports",
    {
      data,
      format
    },
    {
      headers: {
   "company-id": user.company_id,
   "user-email": user.email
},
      responseType: "blob"
    }
  );

  return response.data;
};


export const getExportHistory = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const response = await axios.get(
    "http://127.0.0.1:8000/exports/history",
    {
      headers: {
        "user-email": user.email
      }
    }
  );

  return response.data;
};


export const clearExportHistory = async () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const response = await axios.delete(
    "http://127.0.0.1:8000/exports/clear",
    {
      headers: {
        "user-email": user.email
      }
    }
  );

  return response.data;
};