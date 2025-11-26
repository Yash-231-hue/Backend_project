# RBAC REST API - Complete Backend

A production-ready REST API with JWT Authentication, Role-Based Access Control (RBAC), and comprehensive documentation.

## 🚀 Features

- ✅ **User Authentication** - Register, Login with JWT tokens
- ✅ **Password Hashing** - Secure password storage using bcryptjs
- ✅ **Role-Based Access Control** - User & Admin roles with different permissions
- ✅ **Product CRUD Operations** - Complete Create, Read, Update, Delete
- ✅ **API Versioning** - `/api/v1` prefix for future compatibility
- ✅ **Input Validation** - express-validator for request validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **MySQL Database** - Sequelize ORM with MySQL
- ✅ **API Documentation** - Swagger/OpenAPI documentation
- ✅ **Postman Collection** - Ready-to-use API testing collection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Postman (for API testing)

## 🛠️ Installation

### 1. Clone/Setup Project

```bash
cd C:\Users\LENOVO\Desktop\ALL\intership_primetrade.ai\rbac-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup MySQL Database

Open MySQL Workbench or command line:

```sql
CREATE DATABASE rbac_db;
```

### 4. Configure Environment Variables

Create `.env` file in root directory:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=rbac_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=24h

CORS_ORIGIN=http://localhost:3000
```

### 5. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# View logs
npm run logs              # View all logs
npm run logs:auth         # View authentication logs
npm run logs:error        # View error logs
npm run logs:requests     # View API request logs
```

Server will start on: `http://localhost:5000`

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:5000/api-docs
```

### Postman Collection
Import `RBAC_API_Postman_Collection.json` into Postman for ready-to-use API requests.

## 🔐 Authentication Flow

### 1. Register User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Pass123",
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

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "Pass123"
}
```

### 3. Use Token in Requests

Add to request headers:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

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

## 🎯 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Private | Get current user |
| PUT | `/updatepassword` | Private | Update password |

### Product Routes (`/api/v1/products`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get all products (with pagination) |
| GET | `/:id` | Private | Get single product |
| GET | `/my-products` | Private | Get user's products |
| POST | `/` | Private (User/Admin) | Create product |
| PUT | `/:id` | Private (Owner/Admin) | Update product |
| DELETE | `/:id` | Private (Admin only) | Delete product |

### User Routes (`/api/v1/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private (Admin) | Get all users |
| GET | `/:id` | Private (Admin) | Get single user |
| PUT | `/:id` | Private (Admin) | Update user |
| DELETE | `/:id` | Private (Admin) | Delete user |

## 🔒 Role-Based Permissions

### User Role
- ✅ Create products
- ✅ View all products
- ✅ Update own products
- ✅ View own profile
- ❌ Delete products
- ❌ Manage users

### Admin Role
- ✅ All user permissions
- ✅ Delete any product
- ✅ Update any product
- ✅ View all users
- ✅ Update/delete users

## 🧪 Testing with Postman

### Step 1: Import Collection
1. Open Postman
2. Click **Import**
3. Select `RBAC_API_Postman_Collection.json`

### Step 2: Setup Environment
1. Create new environment: `RBAC Local`
2. Add variable:
   - `base_url`: `http://localhost:5000`
   - `jwt_token`: (will be auto-set after login)

### Step 3: Test Authentication
1. **Register Admin**: Use "Register Admin" request
2. **Login**: Use "Login" request (token auto-saved)
3. **Test Protected Routes**: Try "Get My Profile"

### Step 4: Test Products
1. Create products as user
2. Try to delete (should fail - admin only)
3. Login as admin and try again

## 📁 Project Structure

```
rbac-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD
│   │   └── userController.js    # User management (admin)
│   ├── middleware/
│   │   ├── auth.js              # JWT & RBAC middleware
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   └── userRoutes.js        # User endpoints
│   └── server.js                # Main application
├── .env                         # Environment variables
├── package.json
├── README.md
└── RBAC_API_Postman_Collection.json
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_NAME | Database name | rbac_db |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | your_password |
| JWT_SECRET | JWT secret key | random_secret_key |
| JWT_EXPIRE | Token expiration | 24h |
| CORS_ORIGIN | Allowed origins | http://localhost:3000 |

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Bearer TOKEN_HERE`
- Verify token hasn't expired

## 📈 Future Enhancements

- [ ] Refresh tokens
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] Request logging
- [ ] File upload for products
- [ ] Advanced search/filtering
- [ ] API caching with Redis

## 📝 License

ISC

## 👨‍💻 Author

Created for internship at PrimeTrade.ai

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [JWT Introduction](https://jwt.io/introduction)
- [RESTful API Best Practices](https://restfulapi.net/)

---

**Happy Coding! 🚀**