import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const loginUser = async(data)=>{
  const response = await axios.post(
    `${API_URL}/login`,
    data
  );
  return response.data;
};

export const signupUser = async(data)=>{
  const response = await axios.post(
    `${API_URL}/signup`,
    data
  );
  return response.data;
};

export const forgotPassword = async(data)=>{
  const response = await axios.put(
    `${API_URL}/forgot-password`,
    data
  );
  return response.data;
};