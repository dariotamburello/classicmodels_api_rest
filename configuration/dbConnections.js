if (process.env.ENV !== 'PRD') process.loadEnvFile()

export const msyqlConfiguration = {
  host: process.env.DBHOST ?? 'localhost',
  port: process.env.DBPORT ?? '3306',
  user: process.env.ENV !== 'PRD' ? 'root' : 'tdnic2_prd', // process.env.DBUSER ?? 'root',
  password: process.env.DBPASSWORD ?? '',
  database: process.env.DBNAME ?? 'classicmodels'
}
