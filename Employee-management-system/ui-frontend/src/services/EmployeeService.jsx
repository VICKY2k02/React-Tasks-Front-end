import axios from "axios";

const API_URL = "http://127.0.0.1:8000/employees";


// GET EMPLOYEES
export const getEmployees = async () => {

  try {

    const response = await axios.get(API_URL);

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
      employeeData
    );

    return response.data;

  } catch (error) {

    console.log("POST ERROR:", error);

    throw error;
  }
};


// DELETE EMPLOYEE

export const deleteEmployee = async (id) => {

  const response = await axios.delete(
    `http://127.0.0.1:8000/employees/${id}`
  );

  return response.data;
};


// UPDATE STATUS

export const updateEmployeeStatus = async (
  id,
  status
) => {

  const response = await axios.put(
    `http://127.0.0.1:8000/employees/${id}/status?status=${status}`
  );

  return response.data;
};


// UPDATE EMPLOYEE

export const updateEmployee = async (
  id,
  employeeData
) => {

  const response = await axios.put(
    `http://127.0.0.1:8000/employees/${id}`,
    employeeData
  );

  return response.data;
};


