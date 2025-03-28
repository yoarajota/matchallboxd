
# Matchallboxd

Matchallboxd is an interactive web application that allows users to connect in real-time rooms and collaboratively match films they want to watch, dynamically selecting the perfect movie for their viewing session.

## Features

- Real-time room-based connections using WebSockets
- User authentication with JWT via Passport.js
- Interactive movie matching system
- Responsive UI built with Shadcn, and Tailwind CSS
- Dynamic movie selection based on user preferences

## Tech Stack

### Frontend
- [Shadcn](https://ui.shadcn.com/) - Beautifully designed components (via Radix UI)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - JavaScript library for UI
- [Vite](https://vitejs.dev/) - Frontend tooling

### Backend
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [ws](https://github.com/websockets/ws) - WebSocket implementation
- [Passport.js](http://www.passportjs.org/) - Authentication middleware with JWT
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Sequelize](https://sequelize.org/) - SQL ORM with MySQL2 support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser
- MongoDB and/or MySQL database (optional, depending on configuration)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/matchallboxd.git
cd matchallboxd
```

2. Install dependencies:
```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
JWT_SECRET=your-secret-key
PORT=3001
# Add database credentials if using MongoDB or MySQL
# MONGODB_URI=mongodb://localhost:27017/matchallboxd
# MYSQL_HOST=localhost
# MYSQL_USER=youruser
# MYSQL_PASSWORD=yourpassword
# MYSQL_DATABASE=Matchallboxd
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory in new terminal)
npm run dev
```

## Usage

1. Register or log in to your account
2. Create or join a movie room
3. Add films you'd like to watch
4. Match with other users' preferences
5. Enjoy your dynamically selected movie!

## Backend Details

The backend is built with TypeScript and Express.js, using ESM modules. Key dependencies include:

- **Authentication**: Passport.js with JWT and local strategies, bcrypt for hashing
- **Database**: Supports both MongoDB (Mongoose) and SQL (Sequelize with MySQL2)
- **WebSocket**: ws for real-time communication
- **Utilities**: axios, cors, cookie-parser, dotenv, lodash
- **Dev Tools**: tsx for TypeScript execution, sequelize-cli for database migrations

Run `npm run dev` in the backend directory to start the server with hot-reloading.

## Frontend Details

The frontend is built with TypeScript and Vite, using ESM modules. Key dependencies include:

- **Core**: React, React DOM, Vite for fast development
- **UI Components**: Radix UI primitives (avatar, dialog, label, etc.), Shadcn integration
- **Styling**: Tailwind CSS, tailwind-merge, class-variance-authority
- **Forms**: react-hook-form with zod for validation
- **Routing**: react-router-dom
- **Internationalization**: i18next, react-i18next
- **Utilities**: axios, lodash, localforage, match-sorter
- **Dev Tools**: ESLint, TypeScript, vite-plugin-react-swc
