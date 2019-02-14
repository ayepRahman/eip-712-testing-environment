import React, { useState, useEffect } from 'react';
import { useWeb3Context } from 'web3-react';
import { Button, Container, Row, Col } from 'react-bootstrap';

import { data } from 'example';

import './index.css';

const App = () => {
  const context = useWeb3Context();
  const { setConnector, connectorName, account, active } = context;
  const [web3, setWeb3] = useState();
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const web3Library = connectorName === 'metaMask' && context.library;

    if (web3Library) {
      setWeb3(web3Library);
      setHasMetaMask(true);
    }
  });

  const setMetaMask = () => {
    const web3Library = connectorName === 'metaMask' && context.library;

    if (!web3Library) {
      setShowInstall(true);
    } else {
      setConnector('metaMask');
    }
  };

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

  const renderMetaMaskButton = () => {
    return (
      <Col className="text-center pb-3" xs={12}>
        {!hasMetaMask && <Button onClick={() => setMetaMask()}>Activate MetaMask</Button>}
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

  const sendSignTypedData = async () => {
    console.log('Trigger send sign');
    console.log('WEB3', web3);
    console.log('CONTEXT', context);

    try {
      const result = await web3.currentProvider.sendAsync({
        method: 'eth_signTypedData_v3',
        params: [account, data],
        from: account,
      });

      console.log(result);
    } catch (error) {
      console.log('sendSignTypedData ERROR', error.message);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col className="pb-5 text-center" xs={12}>
          <h1>EIP712 testing environment</h1>
        </Col>

        {!showInstall && renderMetaMaskButton()}
        {showInstall && renderMetaMaskInstallation()}
        {hasMetaMask && renderUserMetamask()}
        {hasMetaMask && signedWithMetaMaskButton()}
      </Row>
    </Container>
  );
};

export default App;
