import React, { useState, useEffect } from 'react';
import { useWeb3Context } from 'web3-react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import ReactJson from 'react-json-view';
// import { useForm, useField } from 'react-final-form-hooks';
import { Form as FinalForm, Field } from 'react-final-form';
import validate from 'validate.js';

import './index.css';

const fieldNames = {
  username: 'username',
  walletAddress: 'walletAddress',
  token: 'token',
};

const constraints = {
  [fieldNames.username]: {
    presence: true,
  },
  [fieldNames.walletAddress]: {
    presence: true,
  },
  [fieldNames.token]: {
    presence: true,
    numericality: true,
  },
};

const App = props => {
  const context = useWeb3Context();
  const { domain, Bid, Identity, domainData } = props;
  const { setConnector, connectorName, account } = context;
  const [message, setMessage] = useState({
    amount: '',
    bidder: {
      username: '',
      wallet: '',
    },
  });
  const [web3, setWeb3] = useState();
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  useEffect(() => {
    const web3Library = connectorName === 'metaMask' && context.library;

    if (web3Library) {
      setWeb3(web3Library);
      setHasMetaMask(true);
    } else {
      setConnector('metaMask');
    }
  });

  // const onSubmit = values => {
  //   console.log('trigger values'.values);
  // };

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

  const signTypedData = values => {
    const { username, walletAddress, token } = values;

    const [data, setData] = useState({
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
          { name: 'salt', type: 'bytes32' },
        ],
        Bid: [{ name: 'amount', type: 'uint256' }, { name: 'bidder', type: 'Identity' }],
        Identity: [{ name: 'username', type: 'uint256' }, { name: 'wallet', type: 'address' }],
      },
      domain: {
        name: 'EIP 712 Testing Dapp',
        version: '2',
        chainId: 4,
        verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',
        salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
      },
      primaryType: 'Bid',
      message,
    });

    const finalizeData = JSON.stringify(data);
    const parseData = JSON.parse(finalizeData);

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
          const errMsg = response.error.message.substring(0, 70).concat('...');
          return setErrorMsg(errMsg);
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

  const validators = field => {
    return validate(field, constraints);
  };

  const renderForm = () => {
    return (
      <FinalForm
        onSubmit={signTypedData}
        initialValues={{ walletAddress: account }}
        validate={validators}
        render={({ handleSubmit, pristine, invalid }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Field name="username">
                {({ input, meta }) => {
                  return (
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control {...input} type="text" placeholder="John Doe" />
                      {meta.touched && meta.error && (
                        <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
                      )}
                    </Form.Group>
                  );
                }}
              </Field>

              <Field name="walletAddress">
                {({ input, meta }) => {
                  return (
                    <Form.Group>
                      <Form.Label>Wallet Address</Form.Label>
                      <Form.Control disabled {...input} type="text" />
                      {meta.touched && meta.error && (
                        <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
                      )}
                    </Form.Group>
                  );
                }}
              </Field>
              <Field name="token">
                {({ input, meta }) => (
                  <Form.Group>
                    <Form.Label>Token Amount</Form.Label>
                    <Form.Control {...input} type="text" placeholder="0.00" />
                    {meta.touched && meta.error && (
                      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                )}
              </Field>

              <Button color="primary" size="lg" type="submit" disabled={pristine || invalid}>
                Signed
              </Button>
            </Form>
          );
        }}
      />
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
        {!hasMetaMask && <Col xs={6}>{renderMetaMaskInstallation()}</Col>}
        {hasMetaMask && <Col xs={6}>{renderForm()}</Col>}
        <Col xs={6}>{renderJsonViewer()}</Col>
      </Row>
    </Container>
  );
};

// App.defaultProps = {
//   domain: [
//     { name: 'name', type: 'string' },
//     { name: 'version', type: 'string' },
//     { name: 'chainId', type: 'uint256' },
//     { name: 'verifyingContract', type: 'address' },
//     { name: 'salt', type: 'bytes32' },
//   ],
//   domainData: {
//     name: 'EIP 712 Testing Dapp',
//     version: '2',
//     chainId: 4,
//     verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',
//     salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
//   },
//   Bid: [{ name: 'amount', type: 'uint256' }, { name: 'bidder', type: 'Identity' }],
// };

export default App;
