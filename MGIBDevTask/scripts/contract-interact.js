require('dotenv').config();
//read in keys
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//for alchemy API
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

//get ABI of contract
const contract = require("../artifacts/contracts/MGIBDevTaskContract.sol/MGIBDevTaskContract.json");

//get on chain contract
const contractAddress = "0x31E5Bdbd48f93DA7F811aAd217e406cad6759B4c";
const mgDevTaskContract = new web3.eth.Contract(contract.abi, contractAddress);

//unencrypted data to send
const data = "Manas Gandhi\nmanaspgandhi@gmail.com\nhttps://github.com/ManasGandhi73/IlliniBlockchainDevTask\n Lou Malnatis";

//Eth-crypto
const EthCrypto = require('eth-crypto');

//send task function
async function sendTaskIB(_IBContract, sendData) {
    
    //first encrypt the data
    const pubKeyEncrypt = "8c0456ac31fb6f53a15ff1ad5555c71d96760f8119dc9a8a992f02c89ad226e1f0cf81273a8017c8409d210cf4969135bb53ea2be22fd3e2eab093830a5c2ad3"
    //encrypt with public key
    const encrypted = await EthCrypto.encryptWithPublicKey(
        pubKeyEncrypt, // publicKey
        sendData // message
    );
    //cipher
    const encryptedString = EthCrypto.cipher.stringify(encrypted); //feed this into the event
    
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce
    const gasEstimate = await mgDevTaskContract.methods.sendTaskIB(_IBContract, encryptedString).estimateGas(); // estimate gas

    // Creating transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': gasEstimate, 
      'data': mgDevTaskContract.methods.sendTaskIB(_IBContract, encryptedString).encodeABI()
    };

    // Signing transaction
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
          console.log("The transaction hash is: ", hash);
        } else {
          console.log("Error with submitting transaction:", err)
        }
      });
    }).catch((err) => {
      console.log("Promise Failed:", err);
    });
}

//send task
async function main() {
    await sendTaskIB("0xf192Ed383b8C03F1a22eD52Bf9f45a5a700F285d", data);
}

main();

