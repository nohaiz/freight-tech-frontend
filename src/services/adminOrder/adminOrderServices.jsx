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

export default { newAdminOrder, updateAdminOrder, adminOrderDetails }