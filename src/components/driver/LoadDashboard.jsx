import { useEffect, useState } from 'react'
import driverServices from '../../services/driverOrder/driverServices';

const LoadDashboard = (user) => {

  const userDisplay = (user.user.role).charAt(0).toUpperCase() + user.user.role.slice(1)
  const [driver, setDriver] = useState([]);

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


