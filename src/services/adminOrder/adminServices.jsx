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
}

export default { newAdminOrder }