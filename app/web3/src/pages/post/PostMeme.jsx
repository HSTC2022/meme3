import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { connectSmartcontractActions } from '_store';
import { CONTRACT_ADDRESS, ENV, NUM_OF_POST, SCROLL_RATIO } from '_store/config';
import Meme3App from "_abi/Meme3App.json";
import Meme3NFT from "_abi/Meme3NFT.json";
import Web3 from 'web3';

export { PostMeme };
export default function PostMeme() {
  // Some global variable
  const dispatch = useDispatch();
  const { web3, account, isConnected } = useSelector(x => x.web3Connector)
  const { listPostDetail } = useSelector(x => x.connectSmartcontract)
  // Some state
  const [AppContractConnected, setAppContractConnected] = useState(null)
  const [NftContractConnected, setNftContractConnected] = useState(null)
  const [senderAddress, setSenderAddress] = useState(null)

  //meme id
  let { id } = useParams();
  useEffect(() => {
    let memeID = parseInt(id)
    if (!Number.isInteger(memeID) || memeID <= 0) {
      window.location.href = "/";
    }
    if (AppContractConnected !== null && NftContractConnected !== null) {
      let getPostContentidPack = {
        AppContractConnected: AppContractConnected,
        NftContractConnected: NftContractConnected,
        account: senderAddress,
        postID: memeID
      }
      dispatch(connectSmartcontractActions.getPostDetail(getPostContentidPack));
    }
  }, [senderAddress])

  // Default loading content
  useEffect(() => {
    if (!account) {
      connectAppWithoutWallet()
    }
  }, [])

  // Update when user connect wallet
  useEffect(() => {

    if (web3) {
      checkWalletIsConnected()
    }
  }, [web3])

  // Some Function
  //init smartcontract
  const connectAppWithoutWallet = async () => {
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
  const checkWalletIsConnected = async () => {
    //option sender
    //let senderAddress = web3.currentProvider.selectedAddress
    //let defaultGas = defaultGas
    //let defaultOptions = {from: senderAddress, gasLimit: defaultGas}

    //connect contract
    var AppContractConnected = new web3.eth.Contract(Meme3App.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3App)
    var NftContractConnected = new web3.eth.Contract(Meme3NFT.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3NFT)

    setAppContractConnected(AppContractConnected)
    setNftContractConnected(NftContractConnected)
    setSenderAddress(account)
  }

  useEffect(() => {
    if (listPostDetail[id] !== undefined) {
      console.log(listPostDetail[id])
    }
  }, [listPostDetail])


  return (
    <div className="container meme-home">
      <div className="row">
        <div className="col-md-6 col-lg-6 mx-auto">
          <div className="card">
            {/* Card header START */}
            <div className="card-header border-0 pb-0">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  {/* Avatar */}
                  <div className="avatar avatar-story me-2">
                    <Avatar value={listPostDetail[id] ? listPostDetail[id].publisher.substring(0, 5) : ''} maxInitials={2} size="40" round={true} />
                  </div>
                  <div>
                    <div className="nav nav-divider">
                      <h6 className="nav-item card-title mb-0"><a href="#"> {listPostDetail[id] ? listPostDetail[id].publisher.substring(0, 5) + "..." + listPostDetail[id].publisher.slice(-5) : ''} </a></h6>
                    </div>
                    <p className="mb-0 small text-secondary">
                      {listPostDetail[id] ? new Date(listPostDetail[id].publishTime * 1000).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
                {/* Card feed action dropdown END */}
              </div>
            </div>
            {/* Card header END */}
            {/* Card body START */}
            <div className="card-body">
              <h4>{listPostDetail[id] ? listPostDetail[id].description : ''}</h4>
              {/* Card img */}
              <img className="card-img" src={listPostDetail[id] ? listPostDetail[id].image : ''} />
              {/* Feed react START */}
              <ul className="nav nav-stack mt-3 small">
                <li className="nav-item"><button type="button" className="py-1 btn-sm btn btn-outline-secondary"><i className="fa-solid fa-heart"></i><span className="px-1">0</span></button></li>
                <li className="nav-item"><button type="button" className="py-1 btn-sm btn btn-outline-secondary"><i className="fa-solid fa-heart-crack"></i><span className="px-1">1</span></button></li>
                <li className="nav-item ms-sm-auto"><button className="btn btn-outline-secondary"><i className="fa-solid fa-share"></i></button></li>
              </ul>
              {/* Feed react END */}
            </div>
            {/* Card body END */}
          </div>
        </div>
        {/* <CardComment /> */}
        <div className='col-md-6 col-lg-6'>
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="card">
                <div className="card-body p-4">
                  <h4 className="text-center mb-4 pb-2">{listPostDetail[id] ? listPostDetail[id].commentCount : ''} Comments</h4>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Add a comment..." aria-label="Add a comment..." aria-describedby="button-addon2" />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2"> <i className="fa-solid fa-paper-plane" /> </button>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="d-flex flex-start">
                        <img className="rounded-circle shadow-1-strong me-3" src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width={65} height={65} />
                        <div className="flex-grow-1 flex-shrink-1">
                          <div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-1">
                                Maria Smantha <span className="small">- 2 hours ago</span>
                              </p>
                              <a href="#!"><i className="fas fa-reply fa-xs" /><span className="small"> reply</span></a>
                            </div>
                            <p className="small mb-0">
                              It is a long established fact that a reader will be distracted by
                              the readable content of a page.
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="d-flex flex-start">
                        <img className="rounded-circle shadow-1-strong me-3" src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width={65} height={65} />
                        <div className="flex-grow-1 flex-shrink-1">
                          <div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-1">
                                Maria Smantha <span className="small">- 2 hours ago</span>
                              </p>
                              <a href="#!"><i className="fas fa-reply fa-xs" /><span className="small"> reply</span></a>
                            </div>
                            <p className="small mb-0">
                              It is a long established fact that a reader will be distracted by
                              the readable content of a page.
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="d-flex flex-start">
                        <img className="rounded-circle shadow-1-strong me-3" src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width={65} height={65} />
                        <div className="flex-grow-1 flex-shrink-1">
                          <div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-1">
                                Maria Smantha <span className="small">- 2 hours ago</span>
                              </p>
                              <a href="#!"><i className="fas fa-reply fa-xs" /><span className="small"> reply</span></a>
                            </div>
                            <p className="small mb-0">
                              It is a long established fact that a reader will be distracted by
                              the readable content of a page.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
