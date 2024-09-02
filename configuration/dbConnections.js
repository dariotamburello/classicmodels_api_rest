if (process.env.ENV !== 'PRD') process.loadEnvFile()

export const configuration = {
  host: process.env.DBHOST ?? 'localhost',
  port: process.env.DBPORT ?? '3306',
  user: 'tdnic_prd', // process.env.DBUSER ?? 'root',
  password: process.env.DBPASSWORD ?? '',
  database: process.env.DBNAME ?? 'classicmodels'
}
