import { useEffect, useState } from 'react';
import shipperServices from '../../services/shipperOrder/shipperServices';
import { Link } from 'react-router-dom';
import './shipper.css';

const OrderDashboard = (user) => {
  const userDisplay = (user.user.role).charAt(0).toUpperCase() + user.user.role.slice(1);
  const [shipper, setShipper] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  if (user.user.role === 'shipper') {

    const fetchShipper = async () => {
      try {
        const shipperData = await shipperServices.indexShipperOrders();
        setShipper(sortByOrderId(shipperData));
        setFilteredData(sortByOrderId(shipperData));
      } catch (err) {
        console.log(err);
      }
    };

    const sortByOrderId = (data) => {
      return data.slice().sort((a, b) => a.orderId - b.orderId);
    };

    const claimedOrders = () => {
      const filtered = shipper.filter(status => status.orderStatus === 'pending');
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('claimed');
    };

    const orderHistory = () => {
      const filtered = shipper.filter(status => status.orderStatus === 'completed');
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('history');
    };

    const unclaimedOrders = () => {
      const filtered = shipper.filter(order => !order.driverId);
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('unclaimed');
    };

    const viewAllOrders = () => {
      const filtered = shipper;
      setFilteredData(sortByOrderId(filtered));
      setActiveTab('all');
    };

    useEffect(() => {
      fetchShipper();
    }, []);

    return (
      <>
        <main>
          <section>
            <h1 className="title has-text-dark custome-title">Welcome {userDisplay}</h1>
            <p>Map Overview should be here</p>
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
                <li className={activeTab === 'history' ? 'is-active' : ''}>
                  <a onClick={orderHistory}>Order History</a>
                </li>
                <li>
                  <button type="button"><Link to="/shippers/orders/new">New Delivery</Link></button>
                </li>
              </ul>
            </div>
            {filteredData.length === 0 ? (
              <p className="title has-text-dark custom-message">This section is currently empty. Check back later!</p>
            ) :
              <div className="columns is-multiline">
                {filteredData.map((order) =>
                  <div className="column is-half" key={order.orderId}>
                    <div className="card custom-card-details">
                      <Link to={`/shippers/orders/${order.orderId}`}>
                        <div className="card-content">
                          <div className="media">
                            <div className="media-content">
                              <p className="title is-3">Order #{order.orderId}</p>
                            </div>
                          </div>
                          <div className="content">
                            <p className="subtitle is-6"><strong>Pick up location:</strong> {order.pickupLocation}</p>
                            <p className="subtitle is-6"><strong>Drop off location:</strong> {order.dropoffLocation}</p>
                            <p className="subtitle is-6"><strong>Order status:</strong> {order.orderStatus}</p>
                            <p className="subtitle is-6"><strong>Delivery time:</strong> {order.deliveryTime}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            }
          </section>
        </main>
      </>
    );
  } else {
    return (
      <h1>Oops, something went wrong</h1>
    );
  }
};

export default OrderDashboard;
