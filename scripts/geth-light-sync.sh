# Fast sync node for rinkeby
# TODO: rpc safe?

geth --datadir=./geth/lightchaindata \
    --keystore=./keystore \
    --syncmode light \
    --rinkeby \
    --ws --wsorigins "*" \
    --rpc --rpcapi db,eth,net,web3,personal
