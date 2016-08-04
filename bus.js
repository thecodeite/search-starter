const kafka = require('kafka-node')

function bus (topic) {
  const kafkaAddress = process.env.KAFKA_ADDRESS
  console.log('Connecting to Kafka at:', JSON.stringify(kafkaAddress))
  const client = new kafka.Client(kafkaAddress, 'kafka-node-client')
  const producer = new kafka.Producer(client)
  const consumer = new kafka.Consumer(client, [{ topic }])

  producer.on('error', err => console.error('producer error', err))
  consumer.on('error', err => console.error('consumer error', err))

  return new Promise((res, rej) => {
    producer.on('ready', () => {
      console.log('producer ready')
      res({producer, consumer})
    })
  })
}

module.exports = bus
