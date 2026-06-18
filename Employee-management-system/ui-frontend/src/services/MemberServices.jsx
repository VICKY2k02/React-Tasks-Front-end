import axios from "axios";

const API = "http://127.0.0.1:8000";

const getHeaders = () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return {
    "company-id": user?.company_id
  };
};


export const getMembers = async (companyId) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/members/${companyId}`
  );
  return response.data;
};

export const deactivateUser = async (email) => {

  const response = await axios.put(
    `${API}/members/${email}/deactivate`,
    {},
    {
      headers: getHeaders()
    }
  );

  return response.data;
};

export const activateUser = async (email) => {

  const response = await axios.put(
    `${API}/members/${email}/activate`,
    {},
    {
      headers: getHeaders()
    }
  );

  return response.data;
};

export const getInvitations = async () => {

  const response = await axios.get(
    `${API}/invitations`,
    {
      headers: getHeaders()
    }
  );

  return response.data;
};

export const createInvitation = async (data) => {
  const response = await axios.post(
    `${API}/invitations`,
    data
  );

  return response.data;
};

export const revokeInvitation = async (
  id
) => {

  const response = await axios.put(
    `${API}/invitations/${id}/revoke`,
    {},
    {
      headers: getHeaders()
    }
  );

  return response.data;
};


export const submitReactivation =
(data) =>
 axios.post(
   "http://127.0.0.1:8000/reactivation-request",
   data
 );





export const getNotifications = async () => {

  const response =
    await axios.get(
      "http://127.0.0.1:8000/notifications"
    );

  return response.data;
};


export const markAllRead = async () => {

  const response = await axios.put(
    "http://127.0.0.1:8000/notifications/read-all"
  );

  return response.data;
};


export const getReactivationRequests =
async () => {

  const response =
    await axios.get(
      "http://127.0.0.1:8000/reactivation-requests"
    );

  return response.data;
};