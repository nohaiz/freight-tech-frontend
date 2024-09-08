import { useEffect, useState } from 'react'
import driverServices from '../../services/driverOrder/driverServices';
import { Link } from 'react-router-dom';

const LoadDashboard = (user) => {

  const userDisplay = (user.user.role).charAt(0).toUpperCase() + user.user.role.slice(1)
  const [driver, setDriver] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  if (user.user.role === 'driver') {

    const fetchDriver = async () => {
      try {
        const driverData = await driverServices.indexDriverOrders();
        setDriver(driverData);
        setFilteredData(driverData);

      } catch (err) {
        console.log(err)
      }
    }

    const claimedOrders = () => {
      setFilteredData(driver.filter((status => status.orderStatus === 'pending')))
    }
    const orderHistory = () => {
      setFilteredData(driver.filter((status => status.orderStatus === 'completed')))
    }
    const unclaimedOrders = () => {
      setFilteredData(driver.filter((order => !order.driverId)))
    }
    useEffect(() => {
      fetchDriver();
    }, [])

    return (
      <>
        <main>
          <section>
            <h1>Welcome {userDisplay}</h1>
            <p>Map Overview should be here</p>
          </section>
          <section>
            <button type="button" onClick={() => { fetchDriver() }}>View All Orders</button>
            <button type="button" onClick={() => { unclaimedOrders() }}>Unclaimed Orders</button>

            <button type="button" onClick={() => { claimedOrders() }}>Claimed Orders</button>
            <button type="button" onClick={() => { orderHistory() }}>Order History</button>
            {filteredData.length === 0 ? (<p>This section is currently empty. Check back later!</p>
            ) :
              filteredData.map((order) =>
                <Link Link to={`/drivers/orders/${order.orderId}`} >
                  <div key={order.id}>
                    <p>Pick up location: {order.pickupLocation}</p>
                    <p>Drop off location: {order.dropoffLocation}</p>
                    <p>Order status: {order.orderStatus}</p>
                  </div>
                </Link>
              )
            }
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


