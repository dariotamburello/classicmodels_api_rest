export const handlePagination = (model, pageValue, limitValue) => {
  const page = parseInt(pageValue)
  const limit = parseInt(limitValue)

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {}

  if (endIndex < model.length) {
    results.next = {
      page: page + 1,
      limit
    }
  }

  results.current = { page }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit
    }
  }

  results.result = model.slice(startIndex, endIndex)

  return results
}
