const kafka = require('kafka-node')
const client = new kafka.Client(process.env.KAFKA_ADDRESS, 'kafka-node-client')
const producer = new kafka.Producer(client)
const consumer = new kafka.Consumer(client, ['elasticSearchResult'])

const searchTerm = process.argv[2]

const transactionId = 'query_' + Math.floor(Math.random() * 1000000)

const payloads = [
  {
    topic: 'userSearchRequest',
    messages: JSON.stringify({
      transactionId,
      data: searchTerm
    })
  }
]

producer.on('ready', function () {
  console.time('request took');
  producer.send(payloads, function (err, data) {
    console.log(data);
  });

  setTimeout(function() {
    console.log('Timed out, took more than 5 seconds')
    process.exit()
  }, 5000);
});

consumer.on('message', function (message) {
  console.timeEnd('request took');
  console.log('Found:', message.value)
  process.exit()
})

producer.on('error', function (err) {})

