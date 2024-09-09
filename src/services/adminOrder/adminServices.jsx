const BASE_URL = "http://localhost:5000/admin/orders"; // Ensure this is the correct URL

const adminServices = {

  newAdminOrder: async (orderData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create a new order");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in newAdminOrder:", error.message);
      throw error;
    }
  },
};

const newAdminOrder = async (orderData) => {
  const token = localStorage.getItem("token"); 
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create a new order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in newAdminOrder:", error.message);
    throw error;
  }
};

export default adminServices;
