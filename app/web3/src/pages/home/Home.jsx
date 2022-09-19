import { useState, useEffect } from 'react';
import Card from "_components/Home/Card";
import './home.scss';
import { useSelector, useDispatch } from 'react-redux';
import { connectSmartcontractActions } from '_store';
import { CONTRACT_ADDRESS, ENV, NUM_OF_POST, SCROLL_RATIO } from '_store/config';
import Meme3App from "_abi/Meme3App.json";
import Meme3NFT from "_abi/Meme3NFT.json";
import Web3 from 'web3';

export {Home};
export default function Home() {
  const dispatch = useDispatch();
  const { web3, account, isConnected } = useSelector(x => x.web3Connector)
  const { postsIdArray } = useSelector(x => x.connectSmartcontract)
  const { posts } = useSelector(x => x.connectSmartcontract)
  const [AppContractConnected, setAppContractConnected] = useState(null)
  const [NftContractConnected, setNftContractConnected] = useState(null)
  const [senderAddress, setSenderAddress] = useState(null)
  const [isCheckScroll, setisCheckScroll] = useState(true)
  const [startPostComp, setstartPostComp] = useState(0)

  const { newVoteState } = useSelector(x => x.connectSmartcontract)
  const [isLogin, setIsLogin] = useState(false);
  
  //scroll event for lazy load
  useEffect(() => {
      window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCheckScroll, AppContractConnected, startPostComp]);

  useEffect(() => {
    if(!localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
      connectAppWithoutWallet()
    }
  }, [])

  //init connect smartcontract object
  useEffect(() => {
    if(account){
      checkWalletIsConnected()
      if(localStorage.getItem('WEB3_LOGINED') == 'false') {
        localStorage.setItem('WEB3_LOGINED', true);
        window.location.reload()
      }
    }
  }, [account])

  useEffect(() => {
    if(isConnected == true && isLogin == false){
      setIsLogin(true);
    } 
    if(isConnected == false && isLogin == true) {
      window.location.reload();
    }
  }, [isConnected])

  //get postid arr newest
  useEffect(() => {
    if(AppContractConnected && NftContractConnected){
      getPostsByPageComp()
    }
  }, [AppContractConnected, NftContractConnected])

  //get post content bt id
  useEffect(() => {
    for (let index = postsIdArray.length - 1; index >= 0; index--) {
        let postID = postsIdArray[index]
        let getPostContentidPack = {
          AppContractConnected: AppContractConnected,
          NftContractConnected: NftContractConnected,
          account: senderAddress,
          postID: postID
        }
        dispatch(connectSmartcontractActions.getPostContentid(getPostContentidPack));
    }
  }, [postsIdArray])
  
  //scroll event
  const handleScroll = () => {
    if (!isCheckScroll){
      return
    }
    let docHeight = document.documentElement.scrollHeight
    let scrollTop = document.documentElement.scrollTop + 900
    let ratio = scrollTop/docHeight
    if (ratio > SCROLL_RATIO) {
      setisCheckScroll(false)
      getPostsByPageComp()
      setTimeout(() => {
        setisCheckScroll(true)   
      }, 3000);
    }
  }

  //init smartcontract
  const connectAppWithoutWallet = async() => {
    // Create default web3 for moonbase
    var defaultWeb3 = new Web3('https://rpc.api.moonbase.moonbeam.network');
    //connect contract
    var AppContractConnected = new defaultWeb3.eth.Contract(Meme3App.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3App)
    var NftContractConnected = new defaultWeb3.eth.Contract(Meme3NFT.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3NFT)
    setAppContractConnected(AppContractConnected)
    setNftContractConnected(NftContractConnected)
    setSenderAddress(null)
  }

  //init smartcontract
  const checkWalletIsConnected = async() => {
    //option sender
    //let senderAddress = web3.currentProvider.selectedAddress
    //let defaultGas = defaultGas
    //let defaultOptions = {from: senderAddress, gasLimit: defaultGas}

    //connect contract
    var AppContractConnected = new web3.eth.Contract(Meme3App.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3App)
    var NftContractConnected = new web3.eth.Contract(Meme3NFT.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3NFT)
    var sender = account;
    setAppContractConnected(AppContractConnected)
    setNftContractConnected(NftContractConnected)
    setSenderAddress(account)
  }

  //get post arr id newest
  const getPostsByPageComp = () => {
    let getPostsByPagePack = {
      AppContractConnected: AppContractConnected,
      startPost: startPostComp,
      endPost: startPostComp + NUM_OF_POST
    }
    setstartPostComp(startPostComp + NUM_OF_POST)
    dispatch(connectSmartcontractActions.getPostsByPage(getPostsByPagePack));
  }

  return (
    <div className="container meme-home">
      <div className="row">
        <div className="col-md-3 col-lg-3">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <i className="fa-solid fa-house" /> Hot
            </li>
            <li className="list-group-item">
              <i className="fa-solid fa-arrow-trend-up" /> Trending
            </li>
            <li className="list-group-item">
              <i className="fa-solid fa-ranking-star" /> Top
            </li>
            <li className="list-group-item">
              <i className="fa-solid fa-location-pin" /> Location
            </li>
          </ul>
          <p>
            <span className="btn badge bg-secondary">Ukraine</span> 	&nbsp;
            <span className="btn badge bg-secondary">Crypto</span> 	&nbsp;
            <span className="btn badge bg-secondary">VietNam</span> 	&nbsp;
            <span className="btn badge bg-secondary">Girls</span> 	&nbsp;
            <span className="btn badge bg-secondary">Scam</span> 	&nbsp;
          </p>
        </div>
        <div className="col-md-6 col-lg-6">
          {posts.map((item, idx) => {
              return (
                <Card key={idx} item={item} />
              );
            })}
        </div>
      </div>
    </div>
  );
}
