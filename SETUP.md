# 🚀 Gharbeti Backend - Setup Instructions

## ✅ Backend Development Complete!

All backend files have been created successfully. Here's what we built:

### 📦 What's Included

- ✅ Complete Express.js server with MongoDB
- ✅ User authentication (JWT-based)
- ✅ Property CRUD operations with advanced filters
- ✅ Favorites system
- ✅ Image upload with Cloudinary
- ✅ Role-based access control
- ✅ Error handling and validation
- ✅ Security middleware (helmet, CORS, rate limiting)

---

## 🔧 Setup Steps (Run these commands)

### 1. Fix NPM Cache Permissions (if needed)

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Dependencies

```bash
cd /Users/amanchaudhary/Documents/personal/gharbetibaa/gharbetibackend
npm install
```

### 3. Configure Environment Variables

Update the `.env` file with your credentials:

```env
# Already configured, but update if needed:
CLOUDINARY_CLOUD_NAME=your-actual-cloudinary-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

### 4. Start MongoDB (if using local)

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Or check if already running
brew services list
```

**Alternative**: Use MongoDB Atlas (cloud) - update `MONGODB_URI` in `.env`

### 5. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Or production mode
npm start
```

Server will run on: **http://localhost:5000**

---

## 🧪 Test API Endpoints

### Health Check
```bash
curl http://localhost:5000
```

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "owner"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Properties
```bash
curl http://localhost:5000/api/properties
```

---

## 📁 Backend Structure

```
gharbetibackend/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── cloudinary.js            # Cloudinary config
├── models/
│   ├── User.js                  # User schema
│   ├── Property.js              # Property schema
│   └── Favorite.js              # Favorite schema
├── controllers/
│   ├── auth.controller.js       # Auth logic
│   ├── property.controller.js   # Property logic
│   └── favorite.controller.js   # Favorite logic
├── routes/
│   ├── auth.routes.js           # Auth endpoints
│   ├── property.routes.js       # Property endpoints
│   └── favorite.routes.js       # Favorite endpoints
├── middleware/
│   ├── auth.middleware.js       # JWT verification
│   ├── error.middleware.js      # Error handling
│   └── upload.middleware.js     # File uploads
├── utils/
│   ├── asyncHandler.js          # Async wrapper
│   ├── validators.js            # Input validation
│   └── imageUpload.js           # Cloudinary helpers
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── server.js                    # Entry point
└── README.md
```

---

## 🎯 Available API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Login user
- `GET /me` - Get current user (protected)
- `PUT /profile` - Update profile (protected)
- `PUT /role` - Update user role (protected)
- `PUT /password` - Change password (protected)

### Properties (`/api/properties`)
- `GET /` - Get all properties (with filters)
- `GET /featured` - Get featured properties
- `GET /:id` - Get single property
- `POST /` - Create property (owner only)
- `PUT /:id` - Update property (owner only)
- `DELETE /:id` - Delete property (owner only)
- `GET /me/listings` - Get my listings (protected)
- `PATCH /:id/status` - Update status (owner only)
- `POST /:id/view` - Increment views
- `POST /:id/call` - Increment call clicks

### Favorites (`/api/favorites`)
- `GET /` - Get user favorites (protected)
- `POST /` - Add to favorites (protected)
- `DELETE /:id` - Remove from favorites (protected)
- `GET /check/:propertyId` - Check if favorited (protected)
- `DELETE /clear` - Clear all favorites (protected)

---

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## ✨ Next Steps

1. **Install packages**: Run `npm install`
2. **Start MongoDB**: Make sure it's running
3. **Start server**: Run `npm run dev`
4. **Test endpoints**: Use curl or Postman
5. **Ready for Flutter**: Backend is ready to integrate!

---

## 📝 Notes

- Default port: 5000
- MongoDB: localhost:27017 (or Atlas)
- Image uploads: Requires Cloudinary setup
- Rate limit: 100 requests per 15 minutes

**Backend is ready! Now building the Flutter app... 🚀**

