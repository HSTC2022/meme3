import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Avatar from "react-avatar";
import {history} from '_helpers';
import { useSelector, useDispatch } from 'react-redux';

export {HeaderUser};
function HeaderUser() {
  const [state, setState] = useState({
    currentPath: history.location.pathname || ''
  });
  const { provider, account, isConnected } = useSelector(x => x.web3Connector)
  return (
    <div className="card">
      <div className="h-200px rounded-top" style={{backgroundImage: 'url(assets/images/bg/meme.jpg)', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}/>
      <div className="card-body py-0">
        <div className="d-sm-flex align-items-start text-center text-sm-start">
          <div>
            <div className="avatar avatar-xxl mt-n5 mb-3">
              {/*<img className="avatar-img rounded-circle border border-white border-3" src="assets/images/avatar/07.jpg" alt="" />*/}
              {<Avatar className="avatar-img rounded-circle" value={account.substring(0, 5) + "..." + account.slice(-5)} maxInitials={2} size="100"/>}
            </div>
          </div>
          <div className="ms-sm-4 mt-sm-3">
            <h1 className="mb-0 h5">{account.substring(0, 5)} <i className="bi bi-patch-check-fill text-success small"/></h1>
            <p className="mb-0 small text-warning">
                <b>Rank:  </b>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
            </p>
          </div>
          <div className="d-flex mt-3 justify-content-center ms-sm-auto">
            <Link className="btn btn-primary-soft me-2" to="/user-update"> <i className="bi bi-pencil-fill pe-1"/> Edit profile </Link>
          </div>
        </div>
        <ul className="list-inline mb-0 text-center text-sm-start mt-3 mt-sm-0">
          <li className="list-inline-item">
            <p>YOU ARE WELLCOME !</p>
          </li>
        </ul>
      </div>
      <div className="card-footer mt-3 pt-2 pb-0">
        <ul className="nav nav-bottom-line align-items-center justify-content-center justify-content-md-start mb-0 border-0">
          <li className="nav-item">
            <Link className={(state.currentPath === '/user-about' || state.currentPath === '/user-update') ? 'nav-link active' : 'nav-link'} to="/user-about"> About </Link>
          </li>
          {/* <li className="nav-item">
            <Link className={state.currentPath === '/user-nft' ? 'nav-link active' : 'nav-link'} to="/user-nft"> NFTs </Link>
          </li> */}
          <li className="nav-item">
            <Link className={state.currentPath === '/user-meme' ? 'nav-link active' : 'nav-link'} to="/user-meme"> Meme </Link>
          </li>
          {/* <li className="nav-item">
            <Link className={state.currentPath === '#connection' ? 'nav-link active' : 'nav-link'} to="#connection"> Connections <span className="badge bg-success bg-opacity-10 text-success small"> 230</span></Link>
          </li> */}
          {/* <li className="nav-item">
            <Link className={state.currentPath === '#activity' ? 'nav-link active' : 'nav-link'} to="#activity"> Activity </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
