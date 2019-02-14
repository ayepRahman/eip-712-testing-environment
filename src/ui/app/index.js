import React, { Fragment } from 'react';
import { useWeb3Context, Web3Consumer } from 'web3-react';
import { Button, Container, Row, Col } from 'react-bootstrap';

import './index.css';

const App = () => {
  const context = useWeb3Context();
  const { setConnector, connectorName, account, active } = context;
  const web3 = context && connectorName === 'metaMask' && context.library;
  console.log(web3);
  // const {} = library;
  console.log('context', context);

  const renderMetaMaskButton = () => {
    return (
      <Col className="text-center" xs={12}>
        {context.connectorName !== 'metaMask' && (
          <Button onClick={() => setConnector('metaMask')}>Activate MetaMask</Button>
        )}
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
      <Col>
        <Button onClick={() => sendSignTypedData()}>Test Signed</Button>
      </Col>
    );
  };

  const sendSignTypedData = async () => {
    console.log('Trigger send sign');

    try {
      const result = await web3.currentProvider.sendAsync({
        method: 'eth_signTypedData_v3',
        params: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col className="pb-3 text-center" xs={12}>
          <h1>EIP712 testing environment</h1>
        </Col>

        {renderMetaMaskButton()}
        {active && renderUserMetamask()}
        {active && signedWithMetaMaskButton()}
      </Row>
    </Container>
  );
};

export default App;
