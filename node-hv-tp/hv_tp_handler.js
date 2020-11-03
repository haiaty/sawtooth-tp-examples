
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const stringify = require('json-stringify-deterministic')


const  {TP_FAMILY, TP_NAMESPACE, TP_VERSION, hash} = require('./env');


//NOTE: errors will be logged in the validator

class HvTpHandler extends TransactionHandler {
  constructor() {
       console.log("Instatiating tp handler: ", TP_FAMILY, TP_NAMESPACE, TP_VERSION, hash);
      super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
  }


  // !!!!! ATTENTTION !!!! -  JSON.stringify IS NOT DETERMINISTIC - https://stackoverflow.com/questions/42491226/is-json-stringify-deterministic-in-v8

  /*
> obj1 = {};
> obj1.b = 5;
> obj1.a = 15;

> obj2 = {};
> obj2.a = 15;
> obj2.b = 5;

> JSON.stringify(obj1)
'{"b":5,"a":15}'
> JSON.stringify(obj2)
'{"a":15,"b":5}'


maybe this could help: (to try first)

const sortObj = (obj) => (
  obj === null || typeof obj !== 'object'
  ? obj
  : Array.isArray(obj)
  ? obj.map(sortObj)
  : Object.assign({}, 
      ...Object.entries(obj)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([k, v]) => ({ [k]: sortObj(v) }),
    ))
);


or this library:

npm install json-stringify-deterministic --save

https://www.npmjs.com/package/json-stringify-deterministic

  */
  apply(transaction, context) {

     let payloadFromClientBytes = transaction.payload;

     let payloadFromClient = JSON.parse(payloadFromClientBytes.toString());

     console.log(payloadFromClient);
     let uuid = payloadFromClient.uuid;
      console.log(uuid);

      // here we create the address with the uuid.
      // the address is a kind of uuid on the blockchain merkle tree
      const address = `${TP_NAMESPACE}${hash(uuid).substr(0,64)}`;
      console.log(address);

      let entries = {
          [address]: Buffer.from(new String(stringify(payloadFromClient.dataToStoreOnBlockchain)))
      }
      return context.setState(entries)
          .catch(error => {
              let message = (error.message) ? error.message : error
              throw new InvalidTransaction(message)
          });
  }
}

module.exports = HvTpHandler;