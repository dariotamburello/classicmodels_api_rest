export const getFormattedDateTime = () => {
  const date = new Date()
  const formattedDateTime = date.toISOString().slice(0, 19).replace('T', ' ')
  return formattedDateTime
}
