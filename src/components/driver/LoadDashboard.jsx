import { useEffect, useState } from 'react'
import driverServices from '../../services/driverOrder/driverServices';

const LoadDashboard = (user) => {

  const userDisplay = (user.user.role).charAt(0).toUpperCase() + user.user.role.slice(1)
  // THIS NEEDS TO BE CHANGED TO AN EMPTY ARRAY
  const [driver, setDriver] = useState([]);

  const tempData = [
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 13,
      "orderStatus": "on_route",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-05T12:00:00",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 14,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-05T12:00:00",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-06T18:18:48.876066",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "its me mario",
      "orderId": 39,
      "orderStatus": "pending",
      "paymentAmount": 160.75,
      "pickupLocation": "its me mario weeeeeeeeeeeeeeeeee",
      "updatedAt": "2024-09-06T18:18:48.876066",
      "vehicleType": "truck",
      "weightValue": 30.1
    },
    {
      "createdAt": "2024-09-06T09:37:57.957216",
      "customerId": 1,
      "deliveryTime": "2024-11-11",
      "driverId": 11,
      "dropoffLocation": "This is updated",
      "orderId": 24,
      "orderStatus": "pending",
      "paymentAmount": 150000007676.0,
      "pickupLocation": "This is updated",
      "updatedAt": "2024-09-06T18:35:05.839918",
      "vehicleType": "truck",
      "weightValue": 1.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "This is updated",
      "orderId": 11,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "Testing something",
      "updatedAt": "2024-09-05T22:58:42.088110",
      "vehicleType": "truck",
      "weightValue": 1.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 17,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-05T12:00:00",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 20,
      "orderStatus": "on_route",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-06T08:41:39.916048",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 19,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-06T08:42:16.519088",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 18,
      "orderStatus": "completed",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-06T08:47:47.902966",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": null,
      "dropoffLocation": "456 Elm St",
      "orderId": 21,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-05T12:00:00",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 13,
      "deliveryTime": "2024-11-10",
      "driverId": null,
      "dropoffLocation": "456 Elm St",
      "orderId": 22,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-05T12:00:00",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-06T09:15:11.488767",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "This is a test",
      "orderId": 23,
      "orderStatus": "pending",
      "paymentAmount": 150.75,
      "pickupLocation": "This is a test",
      "updatedAt": "2024-09-06T09:15:11.488767",
      "vehicleType": "truck",
      "weightValue": 300.0
    },
    {
      "createdAt": "2024-09-05T12:00:00",
      "customerId": 1,
      "deliveryTime": "2024-11-10",
      "driverId": 11,
      "dropoffLocation": "456 Elm St",
      "orderId": 28,
      "orderStatus": "on_route",
      "paymentAmount": 150.75,
      "pickupLocation": "123 Main St",
      "updatedAt": "2024-09-05T12:00:00",
      "vehicleType": "truck",
      "weightValue": 300.0
    }
  ]

  if (user.user.role === 'driver') {

    useEffect(() => {
      const fetchDriver = async () => {
        try {
          const driverData = await driverServices.indexDriverOrders();
          setDriver(driverData);
        } catch (err) {
          console.log(err)
        }
      }
      fetchDriver();
    }, [])

    return (
      <>
        <main>
          <section>
            <h1>Welcome {userDisplay}</h1>
          </section>
          <section>
            <button type="button">View Orders</button>
            <button type="button">Active Orders</button>
            <button type="button">Order History</button>
            {driver.map((order) =>
              <div key={order.id}>
                <p>{order.pickupLocation}</p>
                <p>{order.dropoffLocation}</p>
                <p>{order.orderStatus}</p>
              </div>
            )}
          </section>
        </main>
      </>
    )
  } else {
    return (
      <h1>Opps, something went wrong</h1>
    )
  }
}

export default LoadDashboard


