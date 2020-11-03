const dotenv = require('dotenv')
const crypto = require('crypto')

dotenv.config()


const hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const TP_FAMILY = 'hv_tp'
const TP_NAMESPACE = hash(TP_FAMILY).substring(0, 6)
const TP_VERSION = '1.1.1'

const env = {
  validatorUrl: process.env.VALIDATOR_URL || 'tcp://validator:4004',
  TP_VERSION,
  TP_FAMILY,
  TP_NAMESPACE,
  hash
}

module.exports = env