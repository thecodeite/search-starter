const bus = require('./bus')

module.exports = function (readTopic, writeTopic, {shouldProcess, transform}) {
  return bus(readTopic)
    .then(({producer, consumer}) => {
      consumer.on('message', (message) => {
        console.log('heard message:', message)
        message = JSON.parse(message.value)

        Promise.resolve()
          .then(() => {
            if (shouldProcess) {
              return shouldProcess(message)
            } else {
              console.log('skipping "shouldProcess"')
              return true
            }
          })
          .then(shouldProcessResult => {
            if (!shouldProcessResult) return null

            if (transform) {
              console.log('starting "transform"')
              const transformResult = transform(message)

              if(typeof transformResult.then === 'function') {
                console.log('waiting for result of "transform"')
                return transformResult.then(transformResult => {
                  console.log('Done async transform:', transformResult)
                  return transformResult
                })
              } else {
                console.log('Done sync transform:', transformResult)
                return transformResult
              }
            } else {
              console.log('skipping "transform"')
              return message
            }
          })
          .then(transformResult => {
            if (transformResult) {
              console.log('have transform result:', transformResult)
              const payloads = [
                { topic: writeTopic, messages: JSON.stringify({
                  transactionId: message.trasactionId,
                  data: transformResult
                }) }
              ]
              return new Promise((resolve, reject) => {
                producer.send(payloads, function (err, data) {
                  if (err) reject(err)
                  else resolve(data)
                })
              })
            } else {
              console.log('no transform result')
            }
          })
          .catch(err => {
            console.error('pipeline error:', err)
          })
      })
    })
}
