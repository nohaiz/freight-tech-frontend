import { Link } from "react-router-dom";

const OrderList = ({ orders, handleDeleteOrder }) => {
  if (!orders || orders.length === 0) {
    return (
      <main>
        <div id="NoOrderlist" className="NoOrderlist">
          <h1 className="NoOrder">There are no orders.</h1>
        </div>
      </main>
    );
  }

  return (
    <main>
      
      {orders.map((order) => (
        
        <div className="orderList">
          <section key={order._id}>
            <ul>
              <li>
                <h2 className="from-to">
                  Origin: ({order.from}) - Destination: ({order.to})
                </h2>
                <Link to={`/orders/${order._id}`}>
                <div id="viewdetailsbtn">
                  <button className="button is-info">View Details</button>
                </div>
                </Link>
                <button class="button is-danger"
                
                  onClick={() => {
                    handleDeleteOrder(order._id);
                  }}
                >
                  Cancel Order
                </button>
              </li>
            </ul>
          </section>
        </div>
      ))}
    </main>
    
  );
};

export default OrderList;
