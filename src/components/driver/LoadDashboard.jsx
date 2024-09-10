import { useEffect, useState } from 'react';
import driverServices from '../../services/driverOrder/driverServices';
import { Link } from 'react-router-dom';
import './driver.css';

const LoadDashboard = ({ user }) => {
  const userDisplay = (user.role).charAt(0).toUpperCase() + user.role.slice(1);
  const [driver, setDriver] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      const driverData = await driverServices.indexDriverOrders();
      setDriver(sortByOrderId(driverData));
      setFilteredData(sortByOrderId(driverData));
    } catch (err) {
      console.log(err);
    }
  };

  const sortByOrderId = (data) => {
    return data.slice().sort((a, b) => a.orderId - b.orderId);
  };

  const claimedOrders = () => {
    const filtered = driver.filter((status) => status.orderStatus === 'pending');
    setFilteredData(sortByOrderId(filtered));
    setActiveTab('claimed');
  };

  const orderHistory = () => {
    const filtered = driver.filter((status) => status.orderStatus === 'completed');
    setFilteredData(sortByOrderId(filtered));
    setActiveTab('history');
  };

  const unclaimedOrders = () => {
    const filtered = driver.filter((order) => !order.driverId);
    setFilteredData(sortByOrderId(filtered));
    setActiveTab('unclaimed');
  };

  const viewAllOrders = () => {
    const filtered = driver;
    setFilteredData(sortByOrderId(filtered));
    setActiveTab('all');
  };

  if (user.role === 'driver') {
    return (
      <>
        <main>
          <section>
            <h1 class="title has-text-dark custome-title">Welcome {userDisplay}</h1>
            <p>Map Overview should be here</p>
          </section>
          <section>
            <div className="tabs is-boxed is-centered">
              <ul>
                <li className={activeTab === 'all' ? 'is-active' : ''}>
                  <a onClick={viewAllOrders}>View All Orders</a>
                </li>
                <li className={activeTab === 'unclaimed' ? 'is-active' : ''}>
                  <a onClick={unclaimedOrders}>Unclaimed Orders</a>
                </li>
                <li className={activeTab === 'claimed' ? 'is-active' : ''}>
                  <a onClick={claimedOrders}>Claimed Orders</a>
                </li>
                <li className={activeTab === 'history' ? 'is-active' : ''}>
                  <a onClick={orderHistory}>Order History</a>
                </li>
              </ul>
            </div>

            {filteredData.length === 0 ? (
              <p className='title has-text-dark custom-message'>This section is currently empty. Check back later!</p>
            ) : (
              <div className="columns is-multiline">
                {filteredData.map((order) => (
                  <div className="column is-half" key={order.id}>
                    <div className="card custom-card">
                      <Link to={`/drivers/orders/${order.orderId}`}>
                        <div className="card-content">
                          <div className="media">
                            <div className="media-content">
                              <p className="title is-4">Order #{order.orderId}</p>
                            </div>
                          </div>
                          <div className="content">
                            <p><strong>Pick up location:</strong> {order.pickupLocation}</p>
                            <p><strong>Drop off location:</strong> {order.dropoffLocation}</p>
                            <p><strong>Order status:</strong> {order.orderStatus}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            )}
          </section >
        </main >
      </>
    );
  } else {
    return (
      <h1>Oops, something went wrong</h1>
    );
  }
};

export default LoadDashboard;
