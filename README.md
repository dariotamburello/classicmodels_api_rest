# Classic Models - REST API & Backoffice

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

<p>REST API and backoffice for managing an e-commerce database. Built with Node.js and Express, it supports both MySQL and MongoDB as interchangeable databases. Includes a secure, EJS-rendered admin interface and authentication system.</p>

![Preview](https://classicmodels-api-rest.vercel.app/preview.jpg)

> **Test it!**  
> Access: [https://classicmodels-api-rest.vercel.app](https://classicmodels-api-rest.vercel.app)  
> User: `test`  
> Pass: `test123`

---

## 🔧 Features

- MVC architecture
- Switchable database (MySQL or MongoDB) via `.env`
- RESTful routes for:
  - **Products**
  - **Orders**
  - **Payments**
  - **Customers**
- Schemas defined with [Zod](https://zod.dev)
- Full-featured admin panel with EJS templates
- Authentication with Cookies + JWT
- User/group-based access control
- Middleware:
  - CORS
  - Error handling (dev and production modes)
  - Pagination and search
- End-to-end testing with Mocha

---

## 🚀 Getting Started

1. Clone this repo:

```bash
git clone https://github.com/your-username/classicmodels-api-rest.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
DB_TYPE=mysql # or 'mongodb'
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=classicmodels

JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

4. Start the server:

```bash
npm run dev
```

---

## 🧪 Run tests

```bash
npm test
```

---

## 📁 Project Structure

```
src/
├── config/           # DB config
├── controllers/      # Route handlers
├── models/           # Data models (Zod)
├── routes/           # API endpoints
├── middleware/       # CORS, auth, errors, pagination
├── views/            # EJS templates for backoffice
├── public/           # Static files
```
