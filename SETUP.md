# DrinksHub Setup Guide

This guide will help you set up the DrinksHub application with both frontend and backend connected.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE drinkshub;
```

2. Update the `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=drinkshub
DB_PORT=3306

# JWT Configuration
JWT_SECRET=drinkshub-super-secret-jwt-key-2024

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Configuration

The frontend `.env` file is already created with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_DEBUG=true
```

### 3. Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Connection

The frontend is now connected to the backend through:

- **API Service**: `client/src/services/api.js` - Handles all HTTP requests
- **Configuration**: `client/src/config/config.js` - Manages environment variables
- **Utilities**: `client/src/utils/apiUtils.js` - Provides helper functions

### Available API Endpoints

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Health Check**: `/api/health`

### Default Admin Account

- Email: `admin@drinkshub.com`
- Password: `admin123`

## File Structure

```
├── server/
│   ├── .env                    # Backend environment variables
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── routes/                 # API routes
│   └── server.js              # Main server file
├── client/
│   ├── .env                   # Frontend environment variables
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js         # API service functions
│   │   ├── config/
│   │   │   └── config.js      # App configuration
│   │   └── utils/
│   │       └── apiUtils.js    # API utility functions
│   └── package.json
└── database/
    └── setup.sql              # Database schema
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **CORS Error**
   - Ensure backend is running on port 5000
   - Check CORS_ORIGIN in backend `.env`

3. **API Connection Error**
   - Verify both servers are running
   - Check API_BASE_URL in frontend `.env`
   - Ensure no firewall blocking connections

### Health Check

Test the API connection:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Drinkshub API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:5173`
- API Base URL: `http://localhost:5000/api`

Both servers support hot reloading for development. 