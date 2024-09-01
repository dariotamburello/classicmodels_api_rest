export function generateCheckNumber () {
  const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const suffix = Math.floor(100000 + Math.random() * 900000).toString()
  return prefix + suffix
}
