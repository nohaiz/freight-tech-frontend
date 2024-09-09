const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const newAdminOrder = async (orderData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  } catch (error) {
    console.error(error);
  }
};

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

// getting a single user

const showUserOrders = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders/${userId}`, {
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

export default { indexUsers,newAdminOrder, showUserOrders,  updateUser,}