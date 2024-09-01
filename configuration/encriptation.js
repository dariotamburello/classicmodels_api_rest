process.loadEnvFile()

export const configurationEncrypt = {
  SALT_ROUNDS: 10,
  SECRET_KEY_CODE: process.env.SECRET_KEY_CODE ?? 'test-secret-key-code'
}
