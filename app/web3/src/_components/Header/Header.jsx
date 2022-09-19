import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { web3ConnectorActions } from '../../_store';

import {Container, Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Avatar from "react-avatar";

export {Header};

function Header() {
  const dispatch = useDispatch();
  const { provider, account, isConnected } = useSelector(x => x.web3Connector)

  const [state, setState] = useState({
    account: '',
    isConnected: false,
    theme: localStorage.getItem('data-theme') || 'light'
  })

  useEffect(() => {
    document.title = 'Meme3App';
    if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
      dispatch(web3ConnectorActions.connect());
    } else {
      localStorage.setItem('WEB3_LOGINED', false)
    }
  },[]);

  /*const handleStateChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };*/

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {    
    if(state.theme === 'dark'){
      let style = document.getElementById("style-switch");
      style.setAttribute('href', 'assets/css/style-dark.css');
    }

    provider?.on('accountsChanged', (accounts) => {
      dispatch(web3ConnectorActions.changeAccount(accounts))
      window.location.reload();
    });

    // Subscribe to chainId change
    provider?.on('chainChanged', (chainId) => {
      dispatch(web3ConnectorActions.changeChain(chainId))
      window.location.reload();
    });
  });

  const toggleTheme = () => {
    let style = document.getElementById("style-switch");
    if(state.theme === 'light'){
      style.setAttribute('href', 'assets/css/style-dark.css');
      setState(prevState => ({
        ...prevState,
        theme: 'dark'
      }));
      localStorage.setItem("data-theme", 'dark');
    } else {
      style.setAttribute('href', 'assets/css/style.css');
      setState(prevState => ({
        ...prevState,
        theme: 'light'
      }));
      localStorage.setItem("data-theme", 'light');
    }
  }

  return (
    <header className="navbar-light fixed-top header-static bg-mode meme-component-header">
      <Navbar expand="lg" className="navbar-expand-lg">
        <Container>
          <Navbar.Brand className="navbar-brand" to="/">
            <Link to="/">
              <img className="light-mode-item navbar-brand-item" src="assets/images/favicon.ico" alt="logo"/>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle className="navbar-toggler icon-md btn btn-light p-0" aria-controls="navbarCollapse"/>
          <Navbar.Collapse className="collapse navbar-collapse" id="navbarCollapse">

            <Nav.Item>
                <Link className='nav-link' to=""><i className="fa-solid fa-mobile" />	&nbsp; Meme3 App </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className='nav-link' to=""><i className="fa-solid fa-hand-holding-dollar" />	&nbsp; Meme3 Earn </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className='nav-link' to=""><i className="fa-solid fa-cart-shopping" />	&nbsp; Meme3 Market </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className='nav-link' to=""><i className="fa-solid fa-bomb" />	&nbsp; Meme3 INO </Link>
            </Nav.Item>
            
            <Nav className={isConnected ? "navbar-nav navbar-nav-scroll ms-auto" : "d-none"}>
              <Nav.Item>
                <a className='nav-link' href="https://apps.moonbeam.network/moonbase-alpha/faucet/">Claim Token</a>
              </Nav.Item>
              <Nav.Item>
                <Link className='nav-link' to="/user-meme">Create MEME </Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
          <div className="nav ms-auto align-items-center ms-sm-3 list-unstyled">
            {/* <Nav.Link
              className="nav-link btn-icon btn btn-light me-2"
              onClick={() => {
                toggleTheme()
              }}
            >{state.theme === 'dark' ? <i className="bi bi-sun-fill fs-6"> </i> : <i className="bi bi-moon-fill fs-6"> </i>}</Nav.Link> */}
            <Nav.Link href="#link" className={isConnected ? "d-none" : "nav-link btn-icon btn btn-light p-2"} onClick={(event) => {
              event.preventDefault()
              dispatch(web3ConnectorActions.connect())
            }}>
              <i className="fa-solid fa-wallet" /> Connect
            </Nav.Link>
          </div>
          <NavDropdown
            id="dropdown-wallet"
            className={isConnected ? 'icon-lg p-0 m-0' : 'd-none'}
            align={{sm: 'end'}}
            title={<Avatar value={account.substring(0, 5)} maxInitials={2} size="40"/>}
          >
            <Link className="dropdown-item" to="/user-about">
              <i className="bi bi-person fa-fw me-2"></i>View profile
            </Link>
            <NavDropdown.Divider/>
            <Link className="dropdown-item" to="#" onClick={(event) => {
              event.preventDefault()
              dispatch(web3ConnectorActions.disconnect())
            }}>
              <i className="bi bi-power fa-fw me-2"></i>Disconnect
            </Link>
          </NavDropdown>
        </Container>
      </Navbar>
    </header>
  );
}
