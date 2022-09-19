export const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE5OERGODIxZjIwRTZkN0U5YjUxNzg0QTUwNDZiRjYwQzBkM2U5Y2QiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Njk5NDA0MTk2NSwibmFtZSI6Im1lbWUzYXBpIn0.tg36EU8fAe15HxeT3iEezAD7mGXUx7nk2dJASIssAiQ'

export const WEB3_NETWORKS = {
    "0x507": {
      chainId: "0x507",
      rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
      chainName: "Moonbase Network",
      nativeCurrency: { name: "DEV", decimals: 18, symbol: "DEV" },
      blockExplorerUrls: ["https://moonbase.moonscan.io/"]
    },
    "0xa86a": {
      chainId: "0xa86a",
      rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
      chainName: "Avalanche Network",
      nativeCurrency: { name: "AVAX", decimals: 18, symbol: "AVAX" },
      blockExplorerUrls: ["https://snowtrace.io/"]
    },
    "0x1691": {
      chainId: "0x1691",
      rpcUrls: ["http://localhost:8545"],
      chainName: "Localhost 8545",
      nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
      blockExplorerUrls: []
    },
    "0x539": {
      chainId: "0x539",
      rpcUrls: ["http://localhost:8545"],
      chainName: "Localhost 8545",
      nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
      blockExplorerUrls: []
    },
};

export const CONTRACT_ADDRESS = {
  "development": {
    Meme3App: "0x180633cd59426feC6D3f69525112037FdBCB2eeE",
    Meme3Donation: "0x5ec151FaB29C2062aef2E4eeda89a7B9f5011f46",
    Meme4Faucet: "0x85CA82F8e96e09B448386066982eB8e2020E2538",
    Meme3Manager: "0xec0Eda71E768049ebe34f6d5b9FAAEb9EBE388db",
    Meme3NFT: "0x586527c7527E7D6E5310470C7e5c7D13771C657e",
    Meme3Token: "0x3740D351A3a25c27616CC2F5184184a4401ad66f",
    Meme3User: "0xf16C3C6AAA1469cA8675518fc02F09Ac8130C037"
  },
  "production": {
    Meme3App: "0x180633cd59426feC6D3f69525112037FdBCB2eeE",
    Meme3Donation: "0x5ec151FaB29C2062aef2E4eeda89a7B9f5011f46",
    Meme4Faucet: "0x85CA82F8e96e09B448386066982eB8e2020E2538",
    Meme3Manager: "0xec0Eda71E768049ebe34f6d5b9FAAEb9EBE388db",
    Meme3NFT: "0x586527c7527E7D6E5310470C7e5c7D13771C657e",
    Meme3Token: "0x3740D351A3a25c27616CC2F5184184a4401ad66f",
    Meme3User: "0xf16C3C6AAA1469cA8675518fc02F09Ac8130C037"
  }
};

export const INFURA_ID = '36be01a8008c4b0eb35be297275450cb'

//Main page setting
export const NUM_OF_POST = 3
export const SCROLL_RATIO = 0.7

//defaultGas
export const DEFAULT_GAS = 500000

//User MEME page setting
export const MINT_SUCCESS = 1
export const MINT_FAILED = 2
export const NUM_NFT_PER_PAGE = 8