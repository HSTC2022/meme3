import { configureStore } from '@reduxjs/toolkit';

import {web3ConnectorReducer} from './web3Connector.slice'
import {connectSmartcontractReducer} from './connectSmartcontract.slice'

export * from './web3Connector.slice'
export * from './connectSmartcontract.slice'

export const store = configureStore({
    reducer: {
        web3Connector: web3ConnectorReducer,
        connectSmartcontract: connectSmartcontractReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false
    }),
});