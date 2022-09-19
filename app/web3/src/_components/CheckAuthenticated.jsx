import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { history } from '_helpers';

export { CheckAuthenticated };
function CheckAuthenticated({ children }) {
  const { isConnected } = useSelector(x => x.web3Connector)

  if (!isConnected) {
    // not connected in so redirect to login page with the return url
    return <Navigate to="/user-login" state={{ from: history.location }} />
  }
  // authorized so return child components
  return children;
}
