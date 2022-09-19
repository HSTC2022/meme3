import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from "react-js-pagination";
import {HeaderUser} from "_components/Header";
import './UserMeme.scss';
import MintNFT from './component/MintNFT'
import NftCard from './component/NftCard';
import Meme3App from "_abi/Meme3App.json";
import Meme3NFT from "_abi/Meme3NFT.json";
import {DEFAULT_GAS, CONTRACT_ADDRESS, NUM_NFT_PER_PAGE} from '_store/config'
import { connectSmartcontractActions } from '_store';

export {UserMeme};
function UserMeme() {

  const dispatch = useDispatch();
  const { web3 } = useSelector(x => x.web3Connector)
  const { listAllNFT } = useSelector(x => x.connectSmartcontract)
  const { listNftByPage } = useSelector(x => x.connectSmartcontract)
  const { mintNFTStatus } = useSelector(x => x.connectSmartcontract)
  const [state, setState] = useState({
    MintNFTShow: false,
    AppContractConnected: null,
    NftContractConnected: null,
    defaultOptions: {},
    activePage: 1
  });



  //init connect smartcontract object
  useEffect(() => {
    if(web3){
        checkWalletIsConnected()
    }
  }, [web3])

  //get list nft id
  useEffect(() => {
    
    if(state.NftContractConnected){
      getListNftIdMinted(0)
    }
  }, [state.NftContractConnected, mintNFTStatus])

  //get list nft by page
  useEffect(() => {
    if(listAllNFT.length === 0){ return }
    getListNftByPage()
  }, [listAllNFT, state.activePage])

  // init smartcontract
  const checkWalletIsConnected = async() => {
    //option sender
    let senderAddress = web3.currentProvider.selectedAddress
    let defaultGas = DEFAULT_GAS
    let defaultOptions = {from: senderAddress, gasLimit: defaultGas}

    //connect contract
    let NftContractConnected = await new web3.eth.Contract(Meme3NFT.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3NFT)
    let AppContractConnected = await new web3.eth.Contract(Meme3App.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3App)

    setState(prevState => ({
    ...prevState,
        defaultOptions: defaultOptions,
        NftContractConnected: NftContractConnected,
        AppContractConnected: AppContractConnected
    }));
  }

  const getListNftIdMinted = async(isPost) => {
    let getListNFTpack = {
      NftContractConnected: state.NftContractConnected,
      senderAddress: web3.currentProvider.selectedAddress,
      isPost: parseInt(isPost)
    }

    if (!getListNFTpack.NftContractConnected){return}
    dispatch(connectSmartcontractActions.getListNFT(getListNFTpack));
  }

  const getListNftByPage = async() => {
    let startIndex = listAllNFT.length - (state.activePage * NUM_NFT_PER_PAGE)
    startIndex = startIndex > 0 ? startIndex : 0
    let endIndex = listAllNFT.length - ((state.activePage - 1) * NUM_NFT_PER_PAGE)
    let listNftIDByPage = listAllNFT.slice(startIndex, endIndex)

    let getListNftByPagepack = {
      NftContractConnected: state.NftContractConnected,
      listNftID: listNftIDByPage
    }
    if (!getListNftByPagepack.NftContractConnected){return}
    dispatch(connectSmartcontractActions.getListNFTByPage(getListNftByPagepack));
  }

  const handleMintNFTShow = () => {
    setState(prevState => ({
      ...prevState,
      MintNFTShow: !state.MintNFTShow
    }));
  }

  const handlePageChange = (pageNumber) => {
    if (state.activePage === pageNumber) {return}
    setState(prevState => ({
      ...prevState,
      activePage: pageNumber
    }));
  }

  const handleFilterChange = (input) => {
    getListNftIdMinted(input.target.value)
    setState(prevState => ({
      ...prevState,
      activePage: 1
    }));
  }

  return (
    <div className="container meme-user-meme-page">
      <div className="row g-4">
        {/* Main content START */}
        <div className="col-lg-12 vstack gap-4">
          {/* Card START */}
          <HeaderUser/>
          {/* Card END */}
          {/* media START */}
          <div className="card">
            {/* Card header START */}
            <div className="card-header d-sm-flex align-items-center justify-content-between border-0 pb-0">
              {/* Button modal */}
              <button className="btn btn-sm btn-primary-soft" onClick={handleMintNFTShow}>
                <i className={state.MintNFTShow ? "fa-solid fa-minus pe-1" : "fa-solid fa-plus pe-1"} /> Create NFT
              </button>
            </div>
            {/* Card header END */}
            <MintNFT show={state.MintNFTShow} />
            {/* Card body START */}
            <div className="card-body">
              {/* Photos of you tab START */}
              <div className="g-12 mb-2">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="0"
                    onChange={handleFilterChange.bind(this)}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    ALL
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="1"
                    onChange={handleFilterChange.bind(this)}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    ALL POST
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio3"
                    value="2"
                    onChange={handleFilterChange.bind(this)}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio3">
                    ALL NFT NON POST
                  </label>
                </div>
              </div>
              <div className="row g-3">
                {listNftByPage.map((item, i) => {
                  return (
                    <NftCard key={item.id} item={item} AppContractConnected={state.AppContractConnected} defaultOptions={state.defaultOptions} />
                  );
                })}
              </div>
              {/* Photos of you tab END */}
            </div>
            {/* Card body END */}
            <Pagination
              innerClass="pagination pagination mb-1 justify-content-center"
              itemClass="page-item"
              linkClass="page-link"
              activePage={state.activePage}
              itemsCountPerPage={NUM_NFT_PER_PAGE}
              totalItemsCount={listAllNFT.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange.bind(this)}
            />
          </div>
          {/* media END */}
        </div>
        {/* Main content END */}
      </div> {/* Row END */}
    </div>
  );
}
