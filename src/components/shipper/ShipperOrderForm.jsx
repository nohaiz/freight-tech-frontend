import OrderForm from "../form/OrderForm"

const ShipperOrderForm = ({ user, formatTimestamp }) => {
  return (<OrderForm user={user} formatTimestamp={formatTimestamp} />)
}

export default ShipperOrderForm