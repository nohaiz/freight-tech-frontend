const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const showUser = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
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
    console.log(data.error)
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

const updateUser = async (userId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
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

const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
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

export default { showUser, updateUser, deleteUser };