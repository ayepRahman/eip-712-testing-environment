import React, { useState, useEffect } from 'react';
import { useWeb3Context } from 'web3-react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';

import './index.css';

const App = props => {
  const context = useWeb3Context();
  const { domain, Bid, Identity, domainData, message } = props;
  const { setConnector, connectorName, account, active } = context;
  const [web3, setWeb3] = useState();
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  console.log('ERROR', !!errorMsg);

  const [data] = useState({
    types: {
      EIP712Domain: domain,
      Bid,
      Identity,
    },
    domain: domainData,
    primaryType: 'Bid',
    message,
  });

  const finalizeData = JSON.stringify(data);
  debugger;

  useEffect(() => {
    const web3Library = connectorName === 'metaMask' && context.library;

    if (web3Library) {
      setWeb3(web3Library);
      setHasMetaMask(true);
    } else {
      setConnector('metaMask');
    }
  });

  const renderMetaMaskInstallation = () => {
    return (
      <Col className="text-center pb-3" xs={12}>
        <h2>
          Please install{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          >
            MetaMask
          </a>{' '}
          to start using this feature
        </h2>
      </Col>
    );
  };

  const renderUserMetamask = () => {
    return (
      <Col xs={8}>
        <ul>
          <li>
            <b>Wallet Address:</b> {account}
          </li>
          <li>
            <b> Network Type:</b> {connectorName}
          </li>
        </ul>
      </Col>
    );
  };

  const signedWithMetaMaskButton = () => {
    return (
      <Col className="text-center" xs={12}>
        <Button onClick={() => sendSignTypedData()}>Test Signed</Button>
      </Col>
    );
  };

  const sendSignTypedData = () => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData_v3',
        params: [account, finalizeData],
        from: account,
        jsonrpc: '2.0',
        id: new Date().getTime(),
      },
      (error, result) => {
        if (error) {
          return setErrorMsg(error.message);
        }

        debugger;

        const signature = result.result.substring(2);
        const r = '0x' + signature.substring(0, 64);
        const s = '0x' + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        console.log(r, s, v);
        debugger;
      }
    );
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {!!errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Col className="pb-5 text-center" xs={12}>
          <h1>EIP712 testing environment</h1>
        </Col>

        {!hasMetaMask && renderMetaMaskInstallation()}
        {hasMetaMask && renderUserMetamask()}
        {hasMetaMask && signedWithMetaMaskButton()}
      </Row>
    </Container>
  );
};

App.defaultProps = {
  domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
    { name: 'salt', type: 'bytes32' },
  ],
  domainData: {
    name: 'EIP 712 Testing Dapp',
    version: '2',
    // chainId: 4,
    verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',
    salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
  },
  message: {
    amount: 100,
    bidder: {
      userId: 123123,
      wallet: '0x3333333333333333333333333333333333333333',
    },
  },
  Bid: [{ name: 'amount', type: 'uint256' }, { name: 'bidder', type: 'Identity' }],
  Identity: [{ name: 'userId', type: 'uint256' }, { name: 'wallet', type: 'address' }],
};

export default App;
