import { useEffect, useState } from 'react'
import shipperServices from '../../services/shipperOrder/shipperServices';
import { Link } from 'react-router-dom';

const OrderDashboard = (user) => {

  const userDisplay = (user.user.role).charAt(0).toUpperCase() + user.user.role.slice(1)
  const [shipper, setShipper] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  if (user.user.role === 'shipper') {

    const fetchShipper = async () => {
      try {
        const shipperData = await shipperServices.indexShipperOrders();
        setShipper(shipperData);
        setFilteredData(shipperData);

      } catch (err) {
        console.log(err)
      }
    }

    const claimedOrders = () => {
      setFilteredData(shipper.filter((status => status.orderStatus === 'pending')))
    }
    const orderHistory = () => {
      setFilteredData(shipper.filter((status => status.orderStatus === 'completed')))
    }
    const unclaimedOrders = () => {
      setFilteredData(shipper.filter((order => !order.driverId)))
    }
    useEffect(() => {
      fetchShipper();
    }, [])

    return (
      <>
        <main>
          <h1>Welcome {userDisplay}</h1>
          <section>
            <div className="subNav">
              <button type="button" onClick={() => { fetchShipper() }}>View All Orders</button>
              <button type="button" onClick={() => { unclaimedOrders() }}>Unclaimed Orders</button>

              <button type="button" onClick={() => { claimedOrders() }}>Claimed Orders</button>
              <button type="button" onClick={() => { orderHistory() }}>Order History</button>
              <button type="button"><Link to="/shippers/orders/new">New Delivery</Link></button>
            </div>
            {filteredData.length === 0 ? (<p>This section is currently empty. Check back later!</p>
            ) :
              filteredData.map((order) =>
                <Link Link to={`/shippers/orders/${order.orderId}`} >
                  <div key={order.orderId}>
                    <p>Pick up location: {order.pickupLocation}</p>
                    <p>Drop off location: {order.dropoffLocation}</p>
                    <p>Order status: {order.orderStatus}</p>
                    <p>Delivery time: {order.deliveryTime}</p>
                  </div>
                </Link>
              )
            }
          </section>
          <section>
            <p>Map Overview should be here</p>
          </section>
        </main >
      </>
    )
  } else {
    return (
      <h1>Opps, something went wrong</h1>
    )
  }
}

export default OrderDashboard


