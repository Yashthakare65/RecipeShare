# 🍳 RecipeShare - Your Culinary Community

![RecipeShare Banner](img1.png)

> **Share, Discover, and Savor the World's Best Recipes** 🌍

A full-stack recipe sharing platform where food enthusiasts can create, discover, and rate delicious recipes. Built with modern web technologies and deployed on the cloud for reliability and scalability.

## ✨ Features

### 🎯 Core Functionality
- **Recipe Creation & Management** - Upload photos, ingredients, and step-by-step instructions
- **User Authentication** - Secure registration and login system
- **Recipe Discovery** - Browse recipes by category with beautiful cards
- **Rating & Reviews** - Rate recipes (1-5 stars) and leave comments
- **Favorites System** - Save your favorite recipes for quick access
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 🚀 Advanced Features
- **Real-time Search** - Find recipes by title, ingredients, or categories
- **Image Management** - Cloud-based image storage with automatic optimization
- **Category Filtering** - Organize recipes by cuisine type (Dessert, Dinner, Vegan, Breakfast)
- **User Profiles** - Manage your recipe collection and favorites
- **Social Features** - Comment on recipes and engage with the community

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing for SPA experience
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication with JSON Web Tokens
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage and optimization

### Infrastructure
- **Render** - Backend hosting with automatic deployments
- **Vercel** - Frontend hosting with global CDN
- **MongoDB Atlas** - Cloud database hosting
- **GitHub** - Version control and project management

## 📁 Project Structure

```
recipeshare/
├── 📁 recipeshare-client/          # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── Home.jsx            # Recipe discovery page
│   │   │   ├── Login.jsx           # User authentication
│   │   │   ├── Register.jsx        # User registration
│   │   │   ├── CreateRecipe.jsx    # Recipe creation form
│   │   │   ├── RecipeDetail.jsx    # Recipe view page
│   │   │   └── Favorites.jsx       # User favorites
│   │   ├── 📁 lib/                 # Utility functions
│   │   │   ├── api.js              # API client setup
│   │   │   └── auth.jsx            # Authentication context
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # App entry point
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── vercel.json                 # Vercel deployment config
│
├── 📁 recipeshare-server/          # Node.js Backend
│   ├── 📁 src/
│   │   ├── 📁 models/              # MongoDB schemas
│   │   │   ├── User.js             # User data model
│   │   │   └── Recipe.js           # Recipe data model
│   │   ├── 📁 routes/              # API endpoints
│   │   │   ├── auth.js             # Authentication routes
│   │   │   └── recipes.js          # Recipe CRUD operations
│   │   ├── 📁 middleware/          # Express middleware
│   │   │   └── auth.js             # JWT verification
│   │   ├── 📁 utils/               # Utility functions
│   │   ├── config.js               # Environment configuration
│   │   └── index.js                # Server entry point
│   ├── 📁 uploads/                 # Local image storage (fallback)
│   ├── package.json                # Backend dependencies
│   └── env.example                 # Environment variables template
│
├── render.yaml                      # Render deployment blueprint
├── DEPLOY.md                        # Deployment guide
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)
- **Cloudinary** account (for image storage)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/recipeshare.git
   cd recipeshare
   ```

2. **Backend Setup**
   ```bash
   cd recipeshare-server
   npm install
   cp env.example .env
   # Edit .env with your MongoDB and Cloudinary credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd recipeshare-client
   npm install
   cp env.example .env
   # Set VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

### Environment Variables

#### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recipeshare
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
PUBLIC_URL=http://localhost:5000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Deployment

### Backend (Render)
- **Service Type**: Web Service
- **Root Directory**: `recipeshare-server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Set all required env vars

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `recipeshare-client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_API_URL`

### Database (MongoDB Atlas)
- Create a free cluster
- Set up database user with password
- Configure network access (allow Render IPs)
- Get connection string

### Image Storage (Cloudinary)
- Sign up for free account
- Get cloud name, API key, and secret
- Configure environment variables

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Recipes
- `GET /api/recipes` - Get all recipes (with optional category filter)
- `GET /api/recipes/:id` - Get specific recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Social Features
- `POST /api/recipes/:id/comments` - Add comment
- `POST /api/recipes/:id/ratings` - Rate recipe
- `POST /api/recipes/:id/favorite` - Add to favorites
- `DELETE /api/recipes/:id/favorite` - Remove from favorites
- `GET /api/recipes/me/favorites` - Get user favorites

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface
- **Responsive Design** - Mobile-first approach
- **Card-based Layout** - Easy recipe browsing
- **Image Optimization** - Fast loading with Cloudinary
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - Proper ARIA labels and semantic HTML

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **CORS Protection** - Configurable origin restrictions
- **Input Validation** - Server-side data validation
- **File Upload Security** - Type and size restrictions

## 📱 Mobile Responsiveness

- **Touch-friendly** - Optimized for mobile devices
- **Responsive Grid** - Adapts to all screen sizes
- **Mobile Navigation** - Intuitive mobile menu
- **Image Optimization** - Fast loading on mobile networks

## 🚀 Performance Features

- **CDN Delivery** - Global content distribution
- **Image Optimization** - Automatic compression and resizing
- **Lazy Loading** - Efficient resource loading
- **Caching** - Browser and CDN caching
- **Minified Assets** - Optimized production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Express.js** - For the robust backend framework
- **MongoDB** - For the flexible database solution
- **Cloudinary** - For reliable image storage
- **Render & Vercel** - For excellent hosting services

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yashthakare65/recipeshare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yashthakare65/recipeshare/discussions)
- **Email**: yash44thakare@gmail.com

---

<div align="center">

**Made with ❤️ by Yash Thakare**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashthakare65)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yash-thakare-441393320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app)


**⭐ Star this repository if you found it helpful!**

</div>
