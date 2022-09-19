import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';

// import { NFTStorage, File } from 'nft.storage'
import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js'
import {NFT_STORAGE_KEY, DEFAULT_GAS, CONTRACT_ADDRESS, MINT_SUCCESS, MINT_FAILED } from '_store/config'
import Meme3NFT from "_abi/Meme3NFT.json";

import { connectSmartcontractActions } from '_store';

export default function MintNFT({show}) {

    const dispatch = useDispatch();
    const { web3 } = useSelector(x => x.web3Connector)
    const { mintNFTStatus } = useSelector(x => x.connectSmartcontract)
    const [state, setState] = useState({
        NFTStorageConnected: null,
        NftContractConnected: null,
        defaultOptions: {},
        imgURL: "",
        name: "",
        description: "",
        imgData: "",
        isDisabledBtn: true,
        isMinting: false
    });

    //init connect smartcontract object
    useEffect(() => {
        if(web3){
            checkWalletIsConnected()
        }
    }, [web3])

    //after mintNFT 
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            imgURL: "",
            name: "",
            description: "",
            imgData: "",
            isDisabledBtn: true,
            isMinting: false
        }));
    }, [mintNFTStatus])

    //disable btn
    useEffect(() => {
        if (state.imgURL !== "" && state.name !== "" && state.imgData !== "" && state.description !== "") {
            setState(prevState => ({
                ...prevState,
                isDisabledBtn: false
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                isDisabledBtn: true
            }));
        }
      }, [state.imgURL, state.name, state.imgData, state.description]);

    const checkWalletIsConnected = async() => {
        //option sender
        let senderAddress = web3.currentProvider.selectedAddress
        let defaultGas = DEFAULT_GAS
        let defaultOptions = {from: senderAddress, gasLimit: defaultGas}
    
        //connect contract
        let NftContractConnected = await new web3.eth.Contract(Meme3NFT.abi, CONTRACT_ADDRESS[process.env.NODE_ENV].Meme3NFT)

        //connect NFT.store
        let NFTStorageConnected = new NFTStorage({ token: NFT_STORAGE_KEY })
    
        setState(prevState => ({
        ...prevState,
            defaultOptions: defaultOptions,
            NftContractConnected: NftContractConnected,
            NFTStorageConnected: NFTStorageConnected
        }));
    }

    const handleChangeImage = (e) => {
        setState(prevState => ({
        ...prevState,
            imgURL: URL.createObjectURL(e.target.files[0]),
            imgData: e.target.files[0]
        }));
    }

    const handleChangeDescription = (e) => {
        setState(prevState => ({
        ...prevState,
            description: e.target.value
        }));
      }
    
    const handleChangeName = (e) => {
        setState(prevState => ({
        ...prevState,
            name: e.target.value
        }));
    }

    const handleMintNFT = () => {
        setState(prevState => ({
        ...prevState,
            isMinting: true,
            isDisabledBtn: true
        }));

        let mintNFTpack = {
            image: state.imgData,
            name: state.name,
            description: state.description,
            NFTStorageConnected: state.NFTStorageConnected,
            NftContractConnected: state.NftContractConnected,
            defaultOptions: state.defaultOptions,

        }
        //console.log(mintNFTpack)
        dispatch(connectSmartcontractActions.mintNFTMeme(mintNFTpack));
    }

  return (
    <div className={show ? 'card-header' : 'd-none'}>
        <div className='row'>
            <div className='col'>
                <div className="row">
                    <div className="col pb-3">
                        <label htmlFor="NftName" >NFT name</label>
                        <input type="text" className="form-control" id="NftName" onChange={handleChangeName} value={state.name} placeholder="Name your meme..."/>
                    </div>
                </div>
                <div className="row">
                    <div className='col pb-3'>
                        <label htmlFor="NftDescription" >NFT description</label>
                        <input type="text" className="form-control" id="NftDescription" onChange={handleChangeDescription} value={state.description} placeholder="Description of it..."/>
                    </div>
                </div>
                <div className="row">
                    <div className='col pb-3'>
                        <label htmlFor="formFile" >
                            Upload your image
                        </label>
                        <input type="file" id="formFile" name="img" accept="image/*" className="form-control" onChange={handleChangeImage} />
                    </div>
                </div>
            </div>
            <div className='col text-center'>
                <img src={state.imgURL} alt="Choose an image" style={{height:"200px"}} className={state.imgURL == "" ? "d-none" : ""} />
            </div>
        </div>
        
        <div className='row mt-3'>
            <p className={ mintNFTStatus === MINT_SUCCESS ? 'text-success' : 'd-none'}>MINT NFT is SUCCESS !!!</p>
            <p className={ mintNFTStatus === MINT_FAILED ? 'text-danger' : 'd-none'}>MINT NFT is FAILED !!!</p>

            <Button variant="primary" onClick={handleMintNFT} disabled={state.isDisabledBtn}>{state.isMinting ? 'MINTING...' : 'MINT'}</Button>
        </div>
    </div>
  )
}
