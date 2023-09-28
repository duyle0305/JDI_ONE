import { useState, useEffect } from "react";
import { ethers } from "ethers";
import logo from "./logo.svg";
import { net } from "web3";

function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [toBalance, setToBalance] = useState("");
  const [isTransfer, setIsTransfer] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(null);
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    const check = async () => {
      const isCorrectNetwork = await checkNetWork();
      setIsCorrectNetwork(isConnected);
    };
    check();
  });

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);

      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const checkNetWork = async () => {
    const network = await provider.getNetWork();
    const networkID = network.chainID;
    const networkName = network.name;
    if (networkID == 97n && networkName == "bnbt") {
      alert("Successfully");
      return true;
    } else {
      alert("ERROR");
      return false;
    }
  };

  const transferWallet = async () => {
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner(accounts[0]);
    const tx = {
      to: toAddress,
      value: ethers.utils.parseEther(toBalance, "ether"),
    };
    const transaction = await signer.sendTransaction(tx);
  };

  return (
    <div className="App">
      <header className="App-header">
        {haveMetamask ? (
          <div className="App-header">
            {isCorrectNetwork ? (
              <p>{isCorrectNetwork}</p>
            ) : (
              <p></p>
            )}
            {isConnected ? (
              <div className="card">
                <div className="card-row">
                  <h3>Wallet Address:</h3>
                  <p>
                    {accountAddress.slice(0, 4)}...
                    {accountAddress.slice(38, 42)}
                  </p>
                </div>
                <div className="card-row">
                  <h3>Wallet Balance:</h3>
                  <p>{accountBalance}</p>
                </div>
                <div>
                  <div>
                    <div>
                      <input
                        type="text"
                        placeholder="Receiver Address"
                        onChange={(e) => setToAddress(e.target.value)}
                      />{" "}
                      <br />
                      <input
                        type="text"
                        placeholder="Amount to transfer"
                        onChange={(e) => setToBalance(e.target.value)}
                      />{" "}
                      <br />
                      <button onClick={transferWallet}>SENT</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <img src={logo} className="App-logo" alt="logo" />
            )}

            {isConnected ? (
              <p className="info"> Connected Successfully</p>
            ) : (
              <button className="btn" onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        ) : (
          <p>Please Install MataMask</p>
        )}
      </header>
    </div>
  );
}

export default App;
