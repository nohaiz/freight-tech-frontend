import { useEffect, useState } from 'react'
import driverServices from '../../../services/orderServices/driverServices'
const DriverDashboard = (user) => {

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

export default DriverDashboard
