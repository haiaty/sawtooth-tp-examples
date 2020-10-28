/**
 * Copyright 2016 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')

const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const TP_FAMILY = 'hv_tp'
const TP_NAMESPACE = _hash(TP_FAMILY).substring(0, 6)
const TP_VERSION = '1.0'


class HvTpHandler extends TransactionHandler {
  constructor() {
    super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
  }

  apply(transactionProcessRequest, context) {
    return new Promise(function(resolve, reject) {

    });
  }
}

module.exports = HvTpHandler;