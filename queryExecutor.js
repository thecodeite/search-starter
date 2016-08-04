const requestp = require('request-promise')
require('./pipeline')(
  'elasticSearchQuery',
  'elasticSearchResult',
  {transform}
)

function transform ({data}) {
  console.log('data:', data)

  const options = {
    uri: 'http://elastic.dev:9200/dis-local/intelligence/_search',
    body: JSON.parse(data),
    json: true,
    method: 'POST'
  }
  console.log('starting elastic search query')
  return requestp(options)
    .then(body => JSON.stringify(body.hits.hits.map(h => h._source.headline)))
    .catch(err => console.err('elasticsearch error:', err))
}
