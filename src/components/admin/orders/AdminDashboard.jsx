import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../admin/dashboard.css"; 
import adminServices from '../../../services/adminOrder/adminServices'; 
import profileServices from '../../../services/user/profileServices';  

const AdminDashboard = ({ user, formatTimestamp }) => {
  const [userDisplay, setUserDisplay] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  if (user.role === 'admin') {  

    const fetchAdminOrders = async () => {
      try {
        const orderData = await adminServices.indexAdminOrders(); 
        const adminName = await profileServices.showUser(user.userId); 
        setOrders(sortByOrderId(orderData));
        setFilteredData(sortByOrderId(orderData));
        setUserDisplay(adminName);
      } catch (err) {
        console.log(err);
      }
    };

    const sortByOrderId = (data) => {
      return data.slice().sort((a, b) => a.orderId - b.orderId);
    };

    const claimedOrders = () => {
      const filtered = orders.filter(order => order.orderStatus === 'pending');
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('claimed');
    };

    const orderHistory = () => {
      const filtered = orders.filter(order => order.orderStatus === 'completed');
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('history');
    };

    const unclaimedOrders = () => {
      const filtered = orders.filter(order => !order.driverId);
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('unclaimed');
    };

    const viewAllOrders = () => {
      setFilteredData(sortByOrderId(orders));
      setActiveTab('all');
    };

    const onRoute = () => {
      const filtered = orders.filter(order => order.orderStatus === 'on_route');
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('on-route');
    };

    useEffect(() => {
      fetchAdminOrders(); 
    }, []);

    return (
      <>
        <main>
          <section>
            <h1 className="title is-1">Welcome {userDisplay.username}</h1>
          </section>
          <section>
            <div className="tabs is-centered">
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
                <li className={activeTab === 'on-route' ? 'is-active' : ''}>
                  <a onClick={onRoute}>In Route</a>
                </li>
                <li className={activeTab === 'history' ? 'is-active' : ''}>
                  <a onClick={orderHistory}>Order History</a>
                </li>
                <li>
                  <button type="button" style={{ marginLeft: '30px' }}>
                    <Link to="/admins/orders/new">New Delivery</Link>
                  </button>
                </li>
              </ul>
            </div>
            {filteredData.length === 0 ? (
              <p className="title has-text-dark custom-message">Check back later!</p>
            ) : (
              <div className="columns is-multiline">
                {filteredData.map((order) => (
                  <div className="column is-half" key={order.orderId}>
                    <div className="card custom-card-dashboard">
                      <Link to={`/admins/orders/${order.orderId}`}>
                        <div className="card-content">
                          <div className="media">
                            <div className="media-content">
                              <div className="media-left">
                                <figure className="image is-64x64">
                                  <img src="/checklist.png" alt="Service 3" />
                                </figure>
                                <p className="title is-3">Order #{order.orderId}</p>
                              </div>
                            </div>
                          </div>
                          <div className="content">
                            <p className="subtitle is-5">Pick up location: {order.pickupLocation}</p>
                            <p className="subtitle is-5">Drop off location: {order.dropoffLocation}</p>
                            <p className="subtitle is-5">Order status: {order.orderStatus === 'completed' ? 'Completed' : order.orderStatus === 'on_route' ? 'In Route' : 'Pending'}</p>
                            <p className="subtitle is-5">ETA: {formatTimestamp(order.deliveryTime)}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </>
    );
  } else {
    return <h1>Oops, something went wrong</h1>;
  }
};

export default AdminDashboard;
