#!/bin/bash
# Useful variables. Source from the root of the project

# Shockingly hard to get the sourced script's directory in a portable way
if [[ "${0}" == "bash" || "${0}" == "sh" ]]; then
    script_name="${BASH_SOURCE[0]}"
else
    script_name="${0}"
fi
dir_path="$( cd "$(dirname "$script_name")" >/dev/null 2>&1 ; pwd -P )"
secrets_path="${dir_path}/../secret"
test ! -d $secrets_path && echo "ERR: ../secret dir missing!" && return 1

export GOPATH=$PWD
export PATH="$PATH:$PWD/bin:$PWD/tools/protoc-3.6.1/bin"
export DOCKER_BUILDKIT=1
export INFURA_KEY="$(cat ${secrets_path}/infura_key)"
export ALCHEMY_KEY="$(cat ${secrets_path}/alchemy_key)"
export ETH_NODE_URL="https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}"
export SENDGRID_API_KEY="$(cat ${secrets_path}/sendgrid_api_key)"
# Mnemonic for Truffle Admin account: 0x2883Ed845726adacD3677e6b0065E9F6DFBB491b
export CONTRACTS_MNEMONIC_SEED="$(cat ${secrets_path}/keys/truffle-admin.seed)"

echo "=> Environment Variables Loaded"