require("@nomicfoundation/hardhat-toolbox");

// Will be deleted from Infura post-hackathon
const apiPublicKeyEthereum = "5b3ae89e5ef9475ca9a74a911b814a69"

// Throw-and-use: Will never contain mainnet funds
const privateKey = "3a70a24835d53a7ffbfc39235ff6f0253089cd3211d6f9d41f10ce4516bc1d7e"

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: `https://goerli.infura.io/v3/${apiPublicKeyEthereum}`,
      },
      chainId: 1337
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${apiPublicKeyEthereum}`,
      accounts: [privateKey]
    },
    polygon_zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [privateKey]
    }
  }
};
