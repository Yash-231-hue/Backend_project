# 📝 Logging System Guide

## Overview

The RBAC backend now includes a comprehensive logging system that tracks all activities, errors, and API requests.

---

## 📁 Log Files Location

All logs are stored in: `rbac-backend/logs/`

### Log Files Created:
- `auth-YYYY-MM-DD.log` - Authentication activities (login, register, logout)
- `crud-YYYY-MM-DD.log` - CRUD operations (create, update, delete)
- `error-YYYY-MM-DD.log` - Errors and exceptions
- `info-YYYY-MM-DD.log` - General information
- `requests-YYYY-MM-DD.log` - All API requests
- `success-YYYY-MM-DD.log` - Successful operations
- `warning-YYYY-MM-DD.log` - Warnings and potential issues
- `debug-YYYY-MM-DD.log` - Debug information (dev mode only)
- `database-YYYY-MM-DD.log` - Database operations

**Example:** `auth-2024-11-25.log`

---

## 🎯 What Gets Logged

### 1. Authentication Events
```
[2024-11-25T10:30:15.123Z] Auth LOGIN: testuser - SUCCESS
Data: {
  "action": "LOGIN",
  "username": "testuser",
  "success": true,
  "timestamp": "2024-11-25T10:30:15.123Z"
}
```

### 2. CRUD Operations
```
[2024-11-25T10:31:22.456Z] CRUD CREATE on Product by User 5 (ID: 12)
Data: {
  "action": "CREATE",
  "entity": "Product",
  "userId": 5,
  "entityId": 12,
  "timestamp": "2024-11-25T10:31:22.456Z"
}
```

### 3. API Requests
```
[2024-11-25T10:32:10.789Z] POST /api/v1/auth/login
Data: {
  "method": "POST",
  "url": "/api/v1/auth/login",
  "ip": "::1",
  "userAgent": "Mozilla/5.0...",
  "user": "Unauthenticated"
}
```

### 4. Errors
```
[2024-11-25T10:33:45.012Z] Login error
Data: {
  "error": "Invalid credentials",
  "stack": "Error: Invalid credentials\n    at ..."
}
```

---

## 🔧 Setup Instructions

### Step 1: Create Scripts Directory
```bash
cd C:\Users\LENOVO\Desktop\ALL\intership_primetrade.ai\rbac-backend
mkdir scripts
```

### Step 2: Add Files
1. Copy `src/utils/logger.js` (logging utility)
2. Copy `src/middleware/requestLogger.js` (request logging)
3. Copy `scripts/viewLogs.js` (log viewer)

### Step 3: Update Package.json Scripts
Add to your `package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "logs": "node scripts/viewLogs.js",
    "logs:auth": "node scripts/viewLogs.js auth",
    "logs:error": "node scripts/viewLogs.js error",
    "logs:requests": "node scripts/viewLogs.js requests"
  }
}
```

---

## 📊 Viewing Logs

### Method 1: Using Scripts (Recommended)

**View all logs:**
```bash
npm run logs
```

**View specific log type:**
```bash
npm run logs:auth        # Authentication logs
npm run logs:error       # Error logs
npm run logs:requests    # Request logs
```

**Custom view:**
```bash
node scripts/viewLogs.js auth 100       # Last 100 auth logs
node scripts/viewLogs.js error 50       # Last 50 error logs
node scripts/viewLogs.js requests 200   # Last 200 requests
```

### Method 2: Manual File Access

**Open log files directly:**
```bash
cd logs
notepad auth-2024-11-25.log
```

**In VS Code:**
1. Open `logs` folder in sidebar
2. Click any `.log` file
3. View/search logs

---

## 🎨 Console Output

The logger provides color-coded console output:

- 🔵 **[INFO]** - Cyan - General information
- 🟢 **[SUCCESS]** - Green - Successful operations
- 🟡 **[WARNING]** - Yellow - Warnings
- 🔴 **[ERROR]** - Red - Errors
- 🟣 **[DEBUG]** - Purple - Debug info (dev only)

---

## 💻 Using Logger in Your Code

### Import Logger
```javascript
const logger = require('../utils/logger');
```

### Log Levels

**Info - General Information:**
```javascript
logger.info('Server started');
logger.info('User profile loaded', { userId: 123 });
```

**Success - Successful Operations:**
```javascript
logger.success('Product created successfully');
logger.success('Email sent', { to: 'user@example.com' });
```

**Warning - Potential Issues:**
```javascript
logger.warning('Low stock detected', { productId: 5, stock: 2 });
```

**Error - Errors and Exceptions:**
```javascript
logger.error('Database connection failed', error);
logger.error('Payment processing error', error);
```

**Debug - Detailed Information (Dev only):**
```javascript
logger.debug('Request payload', req.body);
logger.debug('Query results', results);
```

### Specialized Loggers

**Authentication:**
```javascript
// Success
logger.auth('LOGIN', username, true);

// Failure
logger.auth('LOGIN', username, false, 'Invalid password');
```

**CRUD Operations:**
```javascript
logger.crud('CREATE', 'Product', userId, productId);
logger.crud('UPDATE', 'User', adminId, userId);
logger.crud('DELETE', 'Product', adminId, productId);
```

**Database:**
```javascript
logger.database('INSERT', 'users', true);
logger.database('UPDATE', 'products', false, error);
```

---

## 🔍 Log Analysis Examples

### Find Failed Login Attempts
```bash
# View auth logs and search for "FAILED"
npm run logs:auth | findstr "FAILED"
```

### Check Today's Errors
```bash
npm run logs:error
```

### Monitor API Activity
```bash
npm run logs:requests
```

### Track Specific User Activity
```bash
# View logs and search for username
npm run logs | findstr "testuser"
```

---

## 🗂️ Log Rotation

Logs are automatically organized by date:
- Each log type creates a new file per day
- Example: `auth-2024-11-25.log`, `auth-2024-11-26.log`

### Manual Cleanup
Delete old logs (older than 30 days):
```bash
cd logs
# Delete files manually or use a script
```

---

## 🐛 Debugging with Logs

### Scenario 1: User Can't Login

**Step 1:** Check auth logs
```bash
npm run logs:auth
```

**Look for:**
- "Login attempt for username: [username]"
- "Auth LOGIN: [username] - FAILED"
- Reason: "Invalid password" or "User not found"

### Scenario 2: API Request Failing

**Step 1:** Check request logs
```bash
npm run logs:requests
```

**Look for:**
- Request method and URL
- Status code (400, 401, 500, etc.)
- Response time

**Step 2:** Check error logs
```bash
npm run logs:error
```

### Scenario 3: Product Not Creating

**Step 1:** Check CRUD logs
```bash
node scripts/viewLogs.js crud
```

**Look for:**
- "CRUD CREATE on Product"
- Any errors

**Step 2:** Check error logs for details

---

## 📈 Log File Structure

Each log entry contains:
```
[TIMESTAMP] MESSAGE
Data: {
  // Additional context as JSON
}
----------------------------------------
```

**Example:**
```
[2024-11-25T14:23:15.456Z] Product created: Laptop (ID: 5)
Data: {
  "action": "CREATE",
  "entity": "Product",
  "userId": 3,
  "entityId": 5,
  "timestamp": "2024-11-25T14:23:15.456Z"
}
--------------------------------------------------------------------------------
```

---

## ⚙️ Configuration

### Enable/Disable Logging

In production, you might want to disable certain logs:

**Edit `src/utils/logger.js`:**
```javascript
// Disable debug logs in production
debug: (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    // ... logging code
  }
}
```

### Change Log Directory

**Edit `src/utils/logger.js`:**
```javascript
const logsDir = path.join(__dirname, '../../logs'); // Default
// Change to:
const logsDir = path.join(__dirname, '../../my-custom-logs');
```

---

## 🔒 Security Considerations

**Never log:**
- ❌ Passwords (plain text)
- ❌ JWT tokens (full token)
- ❌ Credit card numbers
- ❌ API keys/secrets

**Logs currently exclude:**
- User passwords (hashed only in database)
- Sensitive personal information

---

## 📊 Log Statistics

After running for a day, you can analyze:

1. **Most active users** - Count entries in auth logs
2. **Error frequency** - Number of lines in error logs
3. **API usage** - Request count in requests logs
4. **Peak times** - Timestamps in logs

---

## 🎯 Best Practices

1. **Check logs daily** during development
2. **Monitor error logs** in production
3. **Archive old logs** monthly
4. **Use appropriate log levels** (don't log everything as ERROR)
5. **Include context** in log messages
6. **Review logs** when debugging issues

---

## 🚀 Quick Commands Reference

```bash
# View all logs
npm run logs

# View specific type
npm run logs:auth
npm run logs:error
npm run logs:requests

# Custom view (last N lines)
node scripts/viewLogs.js auth 100
node scripts/viewLogs.js error 50

# Search in logs (Windows)
npm run logs | findstr "username"
npm run logs:error | findstr "database"

# View logs in real-time (while server runs)
# Open logs folder in VS Code and refresh
```

---

## 📞 Need Help?

- Check `error-YYYY-MM-DD.log` for detailed error messages
- Look at `requests-YYYY-MM-DD.log` for API call issues
- Review `auth-YYYY-MM-DD.log` for login problems

Happy logging! 📝✨