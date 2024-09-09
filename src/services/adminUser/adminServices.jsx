const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

// getting all users

const indexUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admins/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// getting a single user

const showUser = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/admins/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

// creating a user

const createUser = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/admins/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  } catch (error) {
    console.log(error);
  }
};

// updating a user

const updateUser = async (userId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/admins/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  } catch (err) {
    console.log(err);
  }
};

// deleting a user

const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/admins/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  } catch (err) {
    console.log(err);
  }
};

export default {
  indexUsers,
  showUser,
  createUser,
  updateUser,
  deleteUser,
};
