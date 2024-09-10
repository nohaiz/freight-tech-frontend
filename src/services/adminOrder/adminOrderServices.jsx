const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const newAdminOrder = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errorDetails = await res.text();
      throw new Error(`Server responded with status ${res.status}: ${errorDetails}`);
    }
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  } catch (error) {
    console.error(error);
  }
}

const updateAdminOrder = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error)
    }
    return json
  } catch (err) {
    console.log(err)
  }
}

const adminOrderDetails = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const json = await res.json()
    if (json.error) {
      throw new Error(json.error)
    }
    return json;
  } catch (err) {
    console.log(err)
  }
}

// getting all users

const indexOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders`, {
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
    console.error("Failed to fetch orders:", error);
    throw error;
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

const deleteOrder = async (orderId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
      method: "DELETE",
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
    console.error("Failed to delete order:", error);
    throw error;
  }
};

const getAllDrivers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/drivers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch drivers.");
    }
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default { getAllDrivers, indexOrders, showUserOrders, newAdminOrder, updateAdminOrder, adminOrderDetails, deleteOrder, }