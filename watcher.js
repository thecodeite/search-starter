const kafka = require('kafka-node')
const client = new kafka.Client(process.env.KAFKA_ADDRESS, 'kafka-node-client')
const producer = new kafka.Producer(client)

const topics = [
  'userSearchRequest',
  'elasticSearchQuery',
  'elasticSearchResult'
]

producer.on('ready', () => {
  producer.createTopics(topics, false, (err, res) => {
    console.log('topics created', err, res)
    const consumer = new kafka.Consumer(client,
      topics.map(t => ({ topic: t })))

    consumer.on('message', message => {
      console.log(new Date(), 'heard:', message.topic, message.value)
    })
  })
})
