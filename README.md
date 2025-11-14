# 🏠 Gharbeti Backend API

Backend API for **Gharbeti** - Nepal's Premier Rental Property Platform

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gharbeti
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Start MongoDB

Make sure MongoDB is running locally:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### 4. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tenant"  // Options: tenant, owner, both
}
```

#### 2. Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9841234567"
}
```

### Property Endpoints

#### 1. Get All Properties (with filters)
```http
GET /api/properties?city=Kathmandu&minRent=5000&maxRent=20000&page=1&limit=20
```

#### 2. Get Single Property
```http
GET /api/properties/:id
```

#### 3. Create Property (Owner only)
```http
POST /api/properties
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Spacious 2BHK in Thamel",
  "description": "Beautiful apartment...",
  "propertyType": "apartment",
  "rent": 15000,
  "location": {
    "city": "Kathmandu",
    "area": "Thamel"
  },
  "images": [files]
}
```

#### 4. Update Property
```http
PUT /api/properties/:id
Authorization: Bearer <token>
```

#### 5. Delete Property
```http
DELETE /api/properties/:id
Authorization: Bearer <token>
```

#### 6. Get My Listings
```http
GET /api/properties/my-listings
Authorization: Bearer <token>
```

### Favorite Endpoints

#### 1. Get My Favorites
```http
GET /api/favorites
Authorization: Bearer <token>
```

#### 2. Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "property_id_here"
}
```

#### 3. Remove from Favorites
```http
DELETE /api/favorites/:id
Authorization: Bearer <token>
```

#### 4. Check if Favorited
```http
GET /api/favorites/check/:propertyId
Authorization: Bearer <token>
```

## 🗂️ Project Structure

```
gharbetibackend/
├── config/              # Configuration files
│   ├── db.js           # MongoDB connection
│   └── cloudinary.js   # Cloudinary setup
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── property.controller.js
│   └── favorite.controller.js
├── middleware/          # Custom middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── upload.middleware.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Property.js
│   └── Favorite.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── property.routes.js
│   └── favorite.routes.js
├── utils/               # Helper functions
│   ├── asyncHandler.js
│   └── validators.js
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js            # Entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS protection
- Input validation and sanitization

## 📝 Notes

- Make sure MongoDB is running before starting the server
- Update `.env` file with your credentials
- For image uploads, configure Cloudinary credentials
- API is protected with rate limiting for security

## 🤝 Contributing

This is a private project. For any issues or suggestions, contact the development team.

## 📄 License

MIT License - See LICENSE file for details

