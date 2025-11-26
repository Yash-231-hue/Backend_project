# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# RBAC REST API - Complete Backend

A production-ready REST API with **JWT Authentication**, **Role-Based Access Control (RBAC)**, comprehensive **input sanitization**, and **security features**.

---

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - Secure registration and login with JWT tokens
- ✅ **Password Security** - Bcrypt hashing with salt rounds
- ✅ **Role-Based Access Control** - User & Admin roles with different permissions
- ✅ **Product Management** - Complete CRUD operations
- ✅ **User Management** - Admin-only user control panel

### Security Features
- ✅ **Input Sanitization** - All inputs sanitized to prevent XSS attacks
- ✅ **Input Validation** - Comprehensive validation using validator.js
- ✅ **Rate Limiting** - Built-in protection against brute force attacks
- ✅ **SQL Injection Prevention** - Sequelize ORM with parameterized queries
- ✅ **CORS Protection** - Configured allowed origins
- ✅ **JWT Token Security** - Secure token-based authentication
- ✅ **Error Handling** - Centralized error handling without exposing sensitive data

### Developer Experience
- ✅ **API Documentation** - Interactive Swagger/OpenAPI docs
- ✅ **API Versioning** - `/api/v1` prefix for future compatibility
- ✅ **Clean Architecture** - Organized controllers, models, routes, middleware
- ✅ **Environment Configuration** - Easy setup with .env file

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** or **yarn** package manager

---

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
cd rbac-backend
```

### 2. Install Dependencies

```bash
npm install
```

**Required packages:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "mysql2": "^3.6.0",
  "sequelize": "^6.32.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "validator": "^13.11.0",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

### 3. Setup MySQL Database

Open **MySQL Workbench** or **MySQL CLI** and run:

```sql
CREATE DATABASE rbac_db;
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rbac_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

⚠️ **Important:** Change `JWT_SECRET` to a strong random string in production!

### 5. Start the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on: `http://localhost:5000`

---

## 📚 API Documentation

### Interactive Documentation
Access the **Swagger UI** documentation at:
```
http://localhost:5000/api-docs
```

### API Base URL
```
http://localhost:5000/api/v1
```

---

## 🔐 Authentication Flow

### 1. Register a New User

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. Using the JWT Token

Add the token to your request headers:

```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Example with curl:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Access | Description | Rate Limit |
|--------|----------|--------|-------------|------------|
| POST | `/register` | Public | Register new user | 20/min |
| POST | `/login` | Public | Login user | 20/min |
| GET | `/me` | Private | Get current user profile | 20/min |
| PUT | `/updatepassword` | Private | Update user password | 20/min |

**Input Validation:**
- Username: 3-50 characters, alphanumeric + underscore
- Email: Valid email format
- Password: Minimum 6 characters

---

### Product Routes (`/api/v1/products`)

| Method | Endpoint | Access | Description | Rate Limit |
|--------|----------|--------|-------------|------------|
| GET | `/` | Private | Get all products (paginated) | 50/min |
| GET | `/:id` | Private | Get single product | 50/min |
| GET | `/my-products` | Private | Get user's own products | 50/min |
| POST | `/` | Private | Create new product | 50/min |
| PUT | `/:id` | Private (Owner/Admin) | Update product | 50/min |
| DELETE | `/:id` | Private (Admin only) | Delete product | 50/min |

**Query Parameters for GET /**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `category` - Filter by category

**Example:**
```bash
GET /api/v1/products?page=1&limit=20&category=electronics
```

---

### User Routes (`/api/v1/users`)

| Method | Endpoint | Access | Description | Rate Limit |
|--------|----------|--------|-------------|------------|
| GET | `/` | Private (Admin) | Get all users | 30/min |
| GET | `/:id` | Private (Admin) | Get single user | 30/min |
| PUT | `/:id` | Private (Admin) | Update user | 30/min |
| DELETE | `/:id` | Private (Admin) | Delete user | 30/min |

---

## 🔒 Role-Based Permissions

### User Role (`role: "user"`)
- ✅ Create products
- ✅ View all products
- ✅ Update own products
- ✅ View own profile
- ✅ Update own password
- ❌ Delete products
- ❌ Manage other users

### Admin Role (`role: "admin"`)
- ✅ All user permissions
- ✅ Delete any product
- ✅ Update any product
- ✅ View all users
- ✅ Update users
- ✅ Delete users
- ✅ Change user roles

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123",
    "role": "user"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123"
  }'
```

**Create Product (requires token):**
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 10,
    "category": "electronics"
  }'
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(50),
  isActive BOOLEAN DEFAULT true,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 📁 Project Structure

```
rbac-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration & connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD operations
│   │   └── userController.js    # User management (admin)
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & RBAC
│   │   ├── sanitize.js          # Input sanitization & validation
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User model with password hashing
│   │   ├── Product.js           # Product model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   └── userRoutes.js        # User management endpoints
│   └── server.js                # Main application entry point
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🛡️ Security Best Practices

### Input Sanitization
All text inputs are automatically:
- Trimmed of whitespace
- HTML-escaped to prevent XSS attacks
- Validated for correct format and length

**Example:**
```javascript
// Malicious Input:
"<script>alert('XSS')</script>"

// After Sanitization:
"&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;"
```

### Rate Limiting
Built-in rate limiting prevents brute force attacks:
- **Auth routes:** 20 requests per minute per IP
- **Product routes:** 50 requests per minute per IP
- **User routes:** 30 requests per minute per IP

### Password Security
- Passwords hashed using **bcrypt** with 10 salt rounds
- Never stored or transmitted in plain text
- Automatic hashing on user creation and password updates

### JWT Tokens
- Signed with secret key
- Include user ID and role
- Configurable expiration time
- Verified on every protected route

---

## 🔧 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment | `development` / `production` | No |
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_PORT` | MySQL port | `3306` | No |
| `DB_NAME` | Database name | `rbac_db` | Yes |
| `DB_USER` | MySQL username | `root` | Yes |
| `DB_PASSWORD` | MySQL password | `your_password` | Yes |
| `JWT_SECRET` | JWT secret key | `random_secret_key` | Yes |
| `JWT_EXPIRE` | Token expiration | `7d` / `24h` | No |
| `CORS_ORIGIN` | Allowed origin | `http://localhost:3000` | No |

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Create database if missing
CREATE DATABASE rbac_db;
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Bearer TOKEN_HERE`
- Verify token hasn't expired (default 7 days)

### "Cannot find module" Errors
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Rate Limit Exceeded
Wait 1 minute or restart the server to reset rate limits.

---

## 📈 Creating an Admin User

### Method 1: Register with Admin Role
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin123",
    "role": "admin"
  }'
```

### Method 2: Update Existing User
```sql
UPDATE users 
SET role = 'admin' 
WHERE username = 'yourUsername';
```

### Method 3: Direct Database Insert
```sql
-- First, hash your password using bcrypt
-- Then insert:
INSERT INTO users (username, email, password, role, isActive, createdAt, updatedAt)
VALUES ('admin', 'admin@example.com', 'HASHED_PASSWORD_HERE', 'admin', 1, NOW(), NOW());
```

---

## 🚦 Testing Workflow

1. **Start Server**
   ```bash
   npm start
   ```

2. **Register a User**
   - Use `/api/v1/auth/register`
   - Save the returned token

3. **Login**
   - Use `/api/v1/auth/login`
   - Verify token matches registration

4. **Test Protected Routes**
   - Use token in `Authorization` header
   - Try creating a product

5. **Test Admin Features**
   - Register/promote an admin user
   - Test user management endpoints
   - Test product deletion

6. **Test Security**
   - Try accessing protected routes without token (should fail)
   - Try admin routes as regular user (should fail)
   - Test rate limiting by making 25+ requests quickly

---

## 📝 Example API Responses

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description here"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Username must be between 3 and 50 characters"
}
```

### Rate Limit Error
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM Guide](https://sequelize.org/docs/v6/)
- [JWT Introduction](https://jwt.io/introduction)
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- [validator.js](https://www.npmjs.com/package/validator)
- [RESTful API Best Practices](https://restfulapi.net/)

---

## 📄 License

ISC

---

## 👨‍💻 Author

**Created for PrimeTrade.ai Internship**

---

## 🤝 Contributing

This is an internship project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## ⚡ Performance Tips

### Production Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Enable HTTPS
4. Use a process manager (PM2)
5. Set up proper logging
6. Configure database connection pooling
7. Add Redis for caching (optional)

### Optimization
- Add database indexes on frequently queried columns
- Implement pagination for large datasets
- Use compression middleware
- Enable response caching where appropriate

---

## 📞 Support

For issues or questions:
- Check the **Troubleshooting** section
- Review **API Documentation** at `/api-docs`
- Check server logs for error details

---

**Happy Coding! 🚀**
## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
