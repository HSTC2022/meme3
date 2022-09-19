import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Web3 from 'web3'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { WEB3_NETWORKS, INFURA_ID } from '_store/config';

// create slice
const name = 'web3Connector'
const initialState = createInitialState()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const slice = createSlice({ name, initialState, extraReducers })

// exports

export const web3ConnectorActions = { ...slice.actions, ...extraActions };
export const web3ConnectorReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        web3Modal: null,
        provider: null,
        web3: null,
        account: '',
        chainId: '',
        isConnected: false
    }
}

function createExtraActions() {
    return {
        connect: connect(),
        disconnect: disconnect(),
        changeAccount: changeAccount(),
        changeChain: changeChain()
    }

    function connect() {
        return createAsyncThunk(
            "connect",
            async () => {
                const options = new WalletConnectProvider({
                    rpc: {
                        43114: 'https://api.avax.network/ext/bc/C/rpc',
                        1287: 'https://rpc.api.moonbase.moonbeam.network'
                    },
                    infuraId: INFURA_ID,
                });

                const providerOptions = {
                    walletconnect: {
                        package: WalletConnectProvider, // required
                        options: options
                    }
                };
                
                const web3Modal = new Web3Modal({
                    // network: "mainnet",
                    cacheProvider: true,
                    providerOptions: providerOptions,
                    theme: "dark"
                });

                const provider = await web3Modal.connect()
                const web3 = new Web3(provider)
            
                await web3.currentProvider.request({ method: 'eth_requestAccounts' })
                const accounts = await web3.eth.getAccounts()
                let account = ''
                if (accounts.length) account = accounts[0]
            
                let chainId = await web3.eth.net.getId()
                chainId = Web3.utils.toHex(chainId)
            
                let isConnected = Object.keys(WEB3_NETWORKS).includes(chainId)

                if (!Object.keys(WEB3_NETWORKS).includes(chainId)) {
                    chainId = Object.keys(WEB3_NETWORKS)[0]
                    try {
                        await web3.currentProvider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: chainId }],
                        });
                        isConnected = true
                    } catch (error) {
                        if (error.code === 4902) {
                            try {
                                await web3.currentProvider.request({
                                    method: "wallet_addEthereumChain",
                                    params: [WEB3_NETWORKS[chainId]],
                                });
                                isConnected = true
                            } catch (error) {
                                alert(error.message);
                            }
                        }
                    }
                }
              
                return {
                    web3Modal: web3Modal,
                    provider: provider,
                    web3: web3,
                    account: account,
                    chainId: chainId,
                    isConnected: isConnected
                }
            }
        )
    }

    function disconnect() {
        return createAsyncThunk(
            "disconnect",
            async () => {
                return {
                    provider: null,
                    web3: null,
                    account: '',
                    isConnected: false
                }
            }
        )
    }

    function changeAccount(accounts) {
        return createAsyncThunk(
            "changeAccount",
            async (accounts) => {
                if (accounts.length > 0) {
                    return {
                        account: accounts[0],
                        isConnected: true
                    }
                  } else {
                    return {
                        account: '',
                        isConnected: false
                    }
                  }
            }
        )
    }

    function changeChain(chainId) {
        return createAsyncThunk(
            "changeChain",
            async (chainId) => {
                return {
                    chainId: chainId,
                    isConnected: Object.keys(WEB3_NETWORKS).includes(chainId)
                  }   
            }
        )
    }
}

function createExtraReducers() {
    return {
        ...connect(),
        ...disconnect(),
        ...changeAccount(),
        ...changeChain()
    }

    function connect() {
        var { pending, fulfilled, rejected } = extraActions.connect
        return {
            [pending]: (state) => {
            },
            [fulfilled]: (state, action) => {
                state.web3Modal = action.payload.web3Modal
                state.provider = action.payload.provider
                state.web3 = action.payload.web3
                state.account = action.payload.account
                state.chainId = action.payload.chainId
                state.isConnected = action.payload.isConnected
            },
            [rejected]: (state, action) => {}
        }
    }

    function disconnect() {
        var { pending, fulfilled, rejected } = extraActions.disconnect
        return {
            [pending]: (state) => {},
            [fulfilled]: (state, action) => {
                state.web3Modal.clearCachedProvider()        
                state.provider = action.payload.provider
                state.web3 = action.payload.web3
                state.account = action.payload.account
                state.isConnected = action.payload.isConnected
            },
            [rejected]: (state, action) => {}
        }
    }

    function changeAccount() {
        var { pending, fulfilled, rejected } = extraActions.changeAccount
        return {
            [pending]: (state) => {},
            [fulfilled]: (state, action) => {
                state.provider = action.payload.provider
                state.web3 = action.payload.web3
                state.account = action.payload.account
                state.isConnected = action.payload.isConnected
            },
            [rejected]: (state, action) => {}
        }
    }

    function changeChain() {
        var { pending, fulfilled, rejected } = extraActions.changeChain
        return {
            [pending]: (state) => {},
            [fulfilled]: (state, action) => {
                state.chainId = action.payload.chainId
                state.isConnected = action.payload.isConnected
            },
            [rejected]: (state, action) => {}
        }
    }
}