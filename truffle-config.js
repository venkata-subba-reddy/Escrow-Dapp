const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = process.env.INFURA_KEY;

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,    // Skip dry run before migrations? (default: false for public nets )
      // from: <address>,  // Account to send txs from (default: accounts[0])
      // websocket: true   // Enable EventEmitter interface for web3 (default: false)
    },
  },
  // contracts_directory: './src/contracts/',
  compilers: {
    solc: {
      version: "0.7.0",
    }
  },
  db: {
    enabled: false
  }
};
