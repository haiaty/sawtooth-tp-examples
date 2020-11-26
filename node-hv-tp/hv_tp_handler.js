
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const stringify = require('json-stringify-deterministic')


const  {TP_FAMILY, TP_NAMESPACE, TP_VERSION, hash} = require('./env');


//NOTES: 
// - errors will be logged in the validator, therefore you should open the /var/log/sawtooth/validator-error.logs to see them
// - the output of the console will be logged in the standart output of the machine that you have started the transaction processor. If it
//   it is a docker container , then it is in its logs

class HvTpHandler extends TransactionHandler {
  constructor() {
       console.log("Instatiating tp handler: ", TP_FAMILY, TP_NAMESPACE, TP_VERSION, hash);
      super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
  }


  /**
   * 
   * @param {*} transaction 
   * @param {*} context 
   */
  async apply(transaction, context) {

    //console.log("ook");

    let a = await _decodeRequest();

    console.log("a:" + a);

    // here we get the bytes in the transaction payload.
    // Remember that we have a stream of bytes as the payload from sawtooth transaction
    // so we need to convert those bytes into an object...
     let payloadFromClientBytes = transaction.payload;

     //...and to do so, we first convert the bytes to string
     // and parse that string to an object
     let payloadFromClient = JSON.parse(payloadFromClientBytes.toString());

     console.log(payloadFromClient);
     
     // here we get the uuid because we will need to constrcut
     // the merkle tree leaf address
     let uuid = payloadFromClient.uuid;
   
      // here we create the address with the uuid.
      // the address is a kind of uuid on the blockchain merkle tree, because 
      // it identifies a single leaf having a value
      const address = `${TP_NAMESPACE}${hash(uuid).substr(0,64)}`;
      
      console.log(address);

     
      if(! payloadFromClient.hasOwnProperty("dataToStoreOnBlockchain")) {
        throw new InvalidTransaction("The payload sent to the transaction handler does not contain the property 'dataToStoreOnBlockchain'")
      }

      //here we get the value of the address in the global state.
      // the actual value is a object having the address as the key
      // and the value is a buffer of bytes
      let addressStateRaw = await context.getState([address]);

      let valueAsByteBuffer = addressStateRaw[address];

      let valueAsObject = JSON.parse(valueAsByteBuffer.toString());

      console.log("actual state as json object:");
      console.log(valueAsObject);

    
      // we need to store the value of the address
      // as a buffer of bytes and we MUST BE SURE that the value stored
      // is deterministic, which means that every time we transform it into bytes
      // we will get the same sequence of bytes. Why we must assure that it should be deterministic? because
      // the transaction handler will be executed in every node (and could be executed several times) therefore
      // it should give the same value otherwise we could have different merkle tree hashes and the block 
      // will be invalid. 
      // NOTE: we are using the stringify function wich is from a library that guarantee that the object will always give the same string.
      // we can't use JSON.stringify because it IS NOT DETERMINISTIC - https://stackoverflow.com/questions/42491226/is-json-stringify-deterministic-in-v8
      let entries = {
          [address]: Buffer.from(new String(stringify(payloadFromClient.dataToStoreOnBlockchain)))
      }

      // and here we set the state into the blockchain. Obviously in order to have the state
      // set the transaction should be valid end the block should be validated
      return context.setState(entries)
          .catch(error => {
              let message = (error.message) ? error.message : error
              throw new InvalidTransaction(message)
          });
  }
}


const _decodeRequest = (payload) =>
  new Promise((resolve, reject) => {

    resolve(3);
    
    /*payload = payload.toString().split(',')
    if (payload.length === 2) {
      resolve({
        action: payload[0],
        amount: payload[1]
      })
    }
   else if(payload.length === 3){ 
	resolve({
	  action:payload[0],
	  amount:payload[1],
	  toKey:payload[2]
	})
    }
    else {
      let reason = new InvalidTransaction('Invalid payload serialization')
      reject(reason)
    }*/
})

module.exports = HvTpHandler;