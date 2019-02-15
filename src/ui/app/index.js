import React, { useState, useEffect } from 'react';
import { useWeb3Context } from 'web3-react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import './index.css';

const App = props => {
  const context = useWeb3Context();
  const { domain, Bid, Identity, domainData, message } = props;
  const { setConnector, connectorName, account } = context;
  const [web3, setWeb3] = useState();
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const [data, setData] = useState({
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
  const parseData = JSON.parse(finalizeData);

  useEffect(() => {
    const web3Library = connectorName === 'metaMask' && context.library;

    if (web3Library) {
      setWeb3(web3Library);
      setHasMetaMask(true);
    } else {
      setConnector('metaMask');
    }
  });

  const renderJsonViewer = () => {
    return <ReactJson src={parseData} theme="monokai" />;
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

  const signTypedData = () => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData_v3',
        params: [account, finalizeData],
        from: account,
        jsonrpc: '2.0',
        id: new Date().getTime(),
      },
      (error, response) => {
        if (error) {
          return setErrorMsg(error.message);
        } else if (response && response.error) {
          return setErrorMsg(response.error.message);
        } else {
          const result = response && response.result;

          const signature = result && result.substring(2);
          const r = signature && '0x' + signature.substring(0, 64);
          const s = signature && '0x' + signature.substring(64, 128);
          const v = signature && parseInt(signature.substring(128, 130), 16);
          const signatures = {
            signature,
            r,
            s,
            v,
          };

          setSuccessMsg(`Successfully signed data!! ${signature}`);
          setData({ signatures, ...data });
        }
      }
    );
  };

  const signedWithMetaMaskButton = () => {
    return (
      <Col className="text-center" xs={12}>
        <Button size="lg" onClick={() => signTypedData()}>
          Test Signed
        </Button>
      </Col>
    );
  };

  return (
    <Container fluid className="py-5 text-white">
      <Row className="justify-content-center">
        <Col>
          {!!errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          {!!successMsg && <Alert variant="success">{successMsg}</Alert>}
        </Col>
        <Col className="pb-5 text-center" xs={12}>
          <h1>EIP712 testing environment</h1>
        </Col>
        <Col xs={6}>
          {!hasMetaMask && renderMetaMaskInstallation()}
          {hasMetaMask && renderUserMetamask()}
          {hasMetaMask && signedWithMetaMaskButton()}
        </Col>
        <Col xs={6}>{renderJsonViewer()}</Col>
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
    chainId: 4,
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
