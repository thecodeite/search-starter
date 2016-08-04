require('./pipeline')(
  'userSearchRequest',
  'elasticSearchQuery',
  {transform}
)

function transform ({data}) {
  const myquery = {
    query_string: {
      query: data
    }
  }
  return JSON.stringify({query: myquery})
}
