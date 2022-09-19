import { useState, useEffect } from 'react';

import './demo.scss';
import Web3 from "web3";
import Authenticated from "./Authenticated";
import Web3Login from "./Web3Login";

export {Demo};
function Demo() {
  useEffect(() => {
    document.title = 'Demo page';
  });

  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [provider, setProvider] = useState(window.ethereum);
  const [chainId, setChainId] = useState(null);
  const [web3, setWeb3] = useState(null);

  const NETWORKS = {
    1: "Ethereum Main Network",
    56: "BNB Smart Chain",
  };

  const onLogin = async (provider) => {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask!");
    } else if (accounts[0] !== currentAccount) {
      setProvider(provider);
      setWeb3(web3);
      setChainId(chainId);
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      const web3Accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        onLogout();
      } else if (accounts[0] !== currentAccount) {
        setCurrentAccount(accounts[0]);
      }
    };

    const handleChainChanged = async (chainId) => {
      const web3ChainId = await web3.eth.getChainId();
      setChainId(web3ChainId);
    };

    if (isConnected) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (isConnected) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [isConnected]);

  const onLogout = () => {
    setIsConnected(false);
    setCurrentAccount(null);
  };

  const getCurrentNetwork = (chainId) => {
    return NETWORKS[chainId];
  };

  return (
    <div className="container meme-home">
      <div className="row">
        <div className="col-md-8 col-lg-8 mx-auto">
          <header className="main-header">
            <h1>React &amp; Web3</h1>
            <nav className="nav">
              <ul>
                <li>
                  <a href="/">{currentAccount}</a>
                </li>
              </ul>
            </nav>
          </header>
          <main>
            {!isConnected && <Web3Login onLogin={onLogin} onLogout={onLogout} />}
            {isConnected && (
              <Authenticated
                currentAccount={currentAccount}
                currentNetwork={getCurrentNetwork(chainId)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
