# 📅 Advanced Calendar Task Manager

A modern, feature-rich calendar application built with React, TypeScript, and Node.js. This application combines powerful task management capabilities with beautiful UI design and comprehensive analytics.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Calendar Views**: Switch between Month and Week views
- **Task Management**: Create, edit, delete, and organize tasks with drag & drop
- **Priority System**: Categorize tasks by priority (Low, Medium, High, Urgent)
- **Recurring Tasks**: Set up daily, weekly, monthly, or yearly recurring tasks
- **Holiday Integration**: Automatic holiday display for multiple countries
- **Search & Filter**: Find tasks quickly with real-time search

### 📊 Advanced Analytics Dashboard
- **Completion Statistics**: Track task completion rates and productivity metrics
- **Priority Distribution**: Visual breakdown of tasks by priority levels
- **Productivity Heatmap**: GitHub-style activity heatmap showing daily productivity
- **Streak Tracking**: Monitor consecutive days of task completion
- **Trend Analysis**: Weekly and monthly productivity trends
- **Category Insights**: Top performing categories and time allocation
- **Productivity Score**: AI-powered scoring algorithm (0-100 scale)

### 🎨 User Experience
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Touch-Friendly Interface**: Optimized for touch devices with proper sizing
- **Drag & Drop**: Intuitive task reordering and date changes
- **Real-time Updates**: Instant synchronization across all views
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Dark/Light Theme Support**: Customizable appearance

### ⚙️ Customization
- **Flexible Settings**: Customize calendar behavior and appearance
- **Multiple Countries**: Holiday support for 10+ countries
- **Week Start Options**: Start week on Sunday or Monday
- **Task Density**: Comfortable, compact, or spacious layouts
- **Font Size Options**: Small, medium, or large text sizes

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Emotion** - CSS-in-JS styling with theme support
- **React Router** - Client-side routing
- **Recharts** - Beautiful, responsive charts for analytics
- **Date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands simultaneously

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd calendar-task-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/calendar-tasks
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately:
   # Backend: npm run server
   # Frontend: npm run client
   ```

6. **Open your browser**
   ```
   Frontend: http://localhost:5173
   Backend API: http://localhost:5000
   ```

## 📱 Usage Guide

### Basic Task Management

1. **Creating Tasks**
   - Click the "+" button on any calendar day
   - Fill in task details (title, description, priority, recurrence)
   - Save to add the task to your calendar

2. **Managing Tasks**
   - Click on any task to view details
   - Edit tasks by clicking the edit button in task details
   - Delete tasks using the delete button
   - Mark tasks as complete with the checkbox

3. **Drag & Drop**
   - Drag tasks between different dates
   - Reorder tasks within the same day
   - Visual feedback shows drop zones

### Calendar Navigation

1. **View Switching**
   - Toggle between Month and Week views
   - Use navigation arrows to move between periods
   - Current date is highlighted

2. **Search & Filter**
   - Use the search bar to find specific tasks
   - Search works across title, description, and categories
   - Results update in real-time

### Analytics Dashboard

1. **Accessing Analytics**
   - Click the 📊 analytics button in the navigation
   - Choose time period (7, 30, 90, or 365 days)
   - View comprehensive productivity insights

2. **Understanding Metrics**
   - **Completion Rate**: Percentage of completed tasks
   - **Productivity Score**: AI-calculated score based on multiple factors
   - **Streak**: Consecutive days with completed tasks
   - **Heatmap**: Visual representation of daily activity

### Settings & Customization

1. **Calendar Settings**
   - Adjust week start day (Sunday/Monday)
   - Toggle weekend display
   - Enable/disable holiday display
   - Choose country for holidays

2. **Appearance Settings**
   - Select task density (comfortable/compact/spacious)
   - Adjust font size
   - Enable/disable animations
   - Toggle compact mode

## 🏗️ Project Structure

```
calendar-task-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Analytics/      # Analytics dashboard components
│   │   ├── Calendar/       # Calendar view components
│   │   ├── Task/          # Task management components
│   │   ├── Settings/      # Settings components
│   │   └── common/        # Shared components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── styles/            # Theme and global styles
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── backend/
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── utils/            # Backend utilities
└── package.json
```

## 🔧 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/trends` - Get trend data

### Holidays
- `GET /api/holidays/:country/:year` - Get holidays for country/year

## 📊 Analytics Features Explained

### Productivity Score Algorithm
The productivity score (0-100) is calculated based on:
- **Completion Rate** (40%): Percentage of tasks completed
- **Consistency** (25%): Regular task completion patterns
- **Priority Handling** (20%): Completion of high-priority tasks
- **Streak Bonus** (15%): Consecutive completion days

### Heatmap Visualization
- **Level 0**: No activity (light gray)
- **Level 1**: Low activity (light green)
- **Level 2**: Moderate activity (medium green)
- **Level 3**: High activity (dark green)
- **Level 4**: Very high activity (darkest green)

## 🎨 Responsive Design

### Breakpoints
- **Mobile**: < 480px
- **Mobile Large**: 480px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1199px
- **Large Desktop**: ≥ 1200px

### Mobile Optimizations
- Touch-friendly button sizes (minimum 44px)
- Optimized grid layouts for small screens
- Horizontal scrolling for heatmap on mobile
- Adaptive font sizes and spacing
- Simplified navigation for touch devices

## 🔒 Security Features

- **Input Validation**: All user inputs are validated
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet Security**: Security headers for Express.js
- **Data Sanitization**: MongoDB injection prevention
- **Error Handling**: Comprehensive error management

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Efficient Rendering**: Optimized re-render cycles
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Strategic caching of API responses

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && npm test

# Run all tests
npm run test:all
```

## 📦 Building for Production

```bash
# Build frontend
npm run build

# Build and start production server
npm run build && npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **Emotion** for powerful CSS-in-JS styling
- **Nager.Date API** for holiday data
- **MongoDB** for reliable data storage
- **React Community** for excellent ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Provide system information (OS, Node.js version, etc.)

## 🔄 Changelog

### Version 2.0.0 (Latest)
- ✅ Added comprehensive Analytics Dashboard
- ✅ Implemented responsive design for all screen sizes
- ✅ Added productivity scoring algorithm
- ✅ Enhanced drag & drop functionality
- ✅ Improved mobile touch interface
- ✅ Added GitHub-style activity heatmap
- ✅ Implemented streak tracking
- ✅ Added trend analysis charts

### Version 1.0.0
- ✅ Basic calendar functionality
- ✅ Task CRUD operations
- ✅ Holiday integration
- ✅ Settings management
- ✅ MongoDB integration

---

**Made with ❤️ using React, TypeScript, and Node.js**
