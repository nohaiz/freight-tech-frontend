import OrderForm from "../../form/OrderForm";

const AdminOrderForm = ({ user, formatTimestamp }) => {
  return (<OrderForm user={user} formatTimestamp={formatTimestamp} />)
};

export default AdminOrderForm;