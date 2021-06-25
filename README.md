# Escrow Dapp

### Compile and deploy
```
truffle compile
truffle migrate
```

### Deploying to networks
```sh
# Add mnemonic words on .secret file
export INFURA_KEY=<your-key>
truffle migrate --network ropsten
```

## History
### Ropsten
```sh
Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 10075070 (0x99bbbe)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x81af85f095325d0faf3316250fa426d161fc9b3bb6e171b7fbf2a72e34637ee8
   > Blocks: 13           Seconds: 170
   > contract address:    0xA79D1AFa74756AD9b6455156A3e82Dd5A66c2284
   > block number:        10508540
   > block timestamp:     1624615589
   > account:             0x1bdE485751FC4552e9d727f22038945D3D2ddaD9
   > balance:             4.547990524140354297
   > gas used:            188239 (0x2df4f)
   > gas price:           99.348056777 gwei
   > value sent:          0 ETH
   > total cost:          0.018701178859645703 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 2 (block: 10508544)

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.018701178859645703 ETH


2-deploy-contract.js
====================

   Deploying 'EscrowDapp'
   ----------------------
   > transaction hash:    0xa32e6a28ff5c911ea4e86d0231a0c0bfd63bb4d0665e1028b197a92142f6f9a6
   > Blocks: 3            Seconds: 45
   > contract address:    0xB4a08Df657Be5DCeCd3b483710a007EeAa8f4473
   > block number:        10508554
   > block timestamp:     1624615704
   > account:             0x1bdE485751FC4552e9d727f22038945D3D2ddaD9
   > balance:             4.469809190785374156
   > gas used:            1191048 (0x122c88)
   > gas price:           62.763566932 gwei
   > value sent:          0 ETH
   > total cost:          0.074754420867224736 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 10508555)
   > confirmation number: 2 (block: 10508556)

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.074754420867224736 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.093455599726870439 ETH
```