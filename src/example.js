export const sample = {
  amount: 100,
  token: '0x1230x',
  id: 15,
  bidder: {
    userId: 123,
    wallet: '0x',
  },
};

// Bid : {
// amount: uint256,
// bidder: Identity,
// };

// Identity: {
// userId: uint256,
// wallet: address,
// }

// Design your domain separator
// The next step is to create a domain separator. This mandatory field helps
// to prevent a signature meant for one dApp from working in another. As EIP712 explains:

// name: the dApp or protocol name, e.g. “CryptoKitties”

// version: The current version of what the standard calls a “signing domain”.
// This can be the version number of your dApp or platform. It prevents signatures
// from one dApp version from working with those of others.

// chainId: The EIP-155 chain id. Prevents a signature meant for one network,
// such as a testnet, from working on another, such as the mainnet.

// verifyingContract: The Ethereum address of the contract that will verify the
// resulting signature. The thiskeyword in Solidity returns the contract’s own address,
// which it can use when verifying the signature.

// salt: A unique 32-byte value hardcoded into both the contract and the dApp meant
// as a last-resort means to distinguish the dApp from others.

// {
//   name: "My amazing dApp",
//   version: "2",
//   chainId: "1",
//   verifyingContract: "0x1c56346cd2a2bf3202f771f50d3d14a367b48070",
//   salt: "0x43efba6b4ccb1b6faa2625fe562bdd9a23260359"
// }

// defining data types
const domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
  { name: 'salt', type: 'bytes32' },
];
const bid = [{ name: 'amount', type: 'uint256' }, { name: 'bidder', type: 'Identity' }];
const identity = [{ name: 'userId', type: 'uint256' }, { name: 'wallet', type: 'address' }];

// domain separator
const domainData = {
  name: 'My amazing dApp',
  version: '2',
  // chainId: parseInt(web3.version.network, 10),
  verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',
  salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
};
var message = {
  amount: 100,
  bidder: {
    userId: 323,
    wallet: '0x3333333333333333333333333333333333333333',
  },
};

const data = JSON.stringify({
  types: {
    EIP712Domain: domain,
    Bid: bid,
    IdentityL: identity,
  },
  domain: domainData,
  primaryType: 'Bid',
  message: message,
});
