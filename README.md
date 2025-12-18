# 🚀 Event Platform


## ✨ Features

-   🎯 **Event Creation & Management**: Organize and publish events with details like title, description, date, time, and location.
-   🔍 **Event Discovery**: Browse a wide array of events through a user-friendly interface.
-   ✅ **User Authentication**: Secure user registration and login with JWT-based authentication.
-   🎟️ **Event Registration/RSVP**: Allow attendees to register for events of interest.
-   👤 **User Profiles**: Manage personal information and view registered/created events.
-   ⚡ **Responsive Design**: Optimized for a seamless experience across various devices.
-   🔑 **Secure API**: Robust backend API for managing all event and user data.
   
RSVP System (Critical Business Logic)

Join / Leave events
Capacity enforcement (no overbooking)
Prevent duplicate RSVPs
Real-time attendee count updates
Joined events shown on dashboard

To solve the RSVP capacity and concurrency-
Multiple users may attempt to RSVP for the same event simultaneously, which can lead to:
Overbooking
Inconsistent attendee counts
Duplicate RSVPs

 Strategy

This project uses MongoDB transactions combined with atomic updates to guarantee data integrity under concurrency.

🧩 How the RSVP System Works
1️⃣ Start a MongoDB Transaction

const session = await mongoose.startSession();
session.startTransaction();

2️⃣ Atomically Increment Attendees Count (Capacity Check)

const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    $expr: { $lt: ["$attendeesCount", "$capacity"] }
  },
  { $inc: { attendeesCount: 1 } },
  { new: true, session }
);


✔ Ensures attendeesCount < capacity
✔ Prevents race conditions
✔ Fails safely if event is full

3️⃣ Create RSVP Document (Duplicate Prevention)

await RSVP.create(
  [{ user: userId, event: eventId }],
  { session }
);


Database-level unique constraint:

rsvpSchema.index({ user: 1, event: 1 }, { unique: true });


✔ Prevents multiple RSVPs per user
✔ Enforced at database level

4️⃣ Commit or Rollback Transaction
await session.commitTransaction();


On any error:

await session.abortTransaction();

🔄 Leaving an Event

Deletes RSVP document
Atomically decrements attendeesCount
Uses the same transactional guarantees

📊 Dashboard

My Created Events
Events I Joined
Edit / delete owned events

🔍 Search
Search events by title or location
Instant client-side filtering

🎨 UI / UX

Modern responsive UI
Dark & Light theme (CSS variables, no Tailwind config)
Clean cards, modals, and navigation
Mobile-friendly design

## 🛠️ Tech Stack
Frontend

React (Vite)
React Router
Axios
Tailwind CSS (utility-only, no custom config)
Context API

Backend

Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
MongoDB Transactions
Multer + Cloudinary (image upload)

## 🚀 Quick Start

Follow these steps to get your development environment up and running.

### Prerequisites
-   Node.js (LTS version recommended, e.g., 18.x or 20.x)
-   npm (Node Package Manager) or yarn
-   MongoDB (running locally or a cloud instance like MongoDB Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/pawanprasad2/event_platform.git
    cd event_platform
    ```

2.  **Install Frontend dependencies**
    ```bash
    cd client
    npm install # or yarn install
    cd ..
    ```

3.  **Install Backend dependencies**
    ```bash
    cd server
    npm install # or yarn install
    cd ..
    ```

4.  **Environment setup (Backend)**
    Create a `.env` file in the `server` directory based on the example (if any, otherwise configure manually):
    ```bash
    cp server/.env.example server/.env # if .env.example exists in server/
    ```
    Edit `server/.env` and configure your environment variables. Essential variables typically include:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/event_platform
    JWT_SECRET=your_jwt_secret_key
    ```
    _Note: Ensure `JWT_SECRET` is a strong, random string in production._

5.  **Database setup**
    Ensure your MongoDB instance is running. The application will create the necessary collections upon first data insertion.

### Run Development Servers

1.  **Start Frontend development server**
    From the root directory:
    ```bash
    cd client
    npm run dev # or yarn dev
    ```
    This will typically start the frontend on `http://localhost:5173` (Vite default) or `http://localhost:3000` (Create React App default).

2.  **Start Backend development server**
    Open a new terminal, navigate to the root directory:
    ```bash
    cd server
    npm start # or yarn start or npm run dev
    ```
    This will typically start the backend API on `http://localhost:5000` (or the `PORT` specified in `server/.env`).

3.  **Open your browser**
    Visit `http://localhost:[detected-frontend-port]` to access the application.

## 📁 Project Structure

```
event_platform/
├── .gitignore         # Specifies intentionally untracked files to ignore
├── README.md          # Project documentation
├── client/            # Frontend application source code (e.g., React)
│   ├── public/        # Static assets (HTML, images, etc.)
│   ├── src/           # Main application source
│   │   ├── assets/    # Images, icons, etc.
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Application specific pages/views
│   │   ├── services/  # API interaction logic
│   │   ├── utils/     # Utility functions
│   │   ├── App.jsx    # Main React component
│   │   └── main.jsx   # Entry point for React app
│   └── package.json   # Frontend dependencies and scripts
└── server/            # Backend API source code (e.g., Node.js/Express)
    ├── config/        # Database connection and other configurations
    ├── controllers/   # Request handlers for API endpoints
    ├── models/        # Database schemas (e.g., Mongoose models)
    ├── routes/        # API endpoint definitions
    ├── middleware/    # Express middleware (e.g., authentication)
    ├── .env.example   # Example environment variables
    ├── server.js      # Main entry point for the backend server
    └── package.json   # Backend dependencies and scripts
```

## ⚙️ Configuration

### Environment Variables
The backend requires a `.env` file in its root directory (`server/.env`).

| Variable    | Description                                   | Default                | Required |

|-------------|-----------------------------------------------|------------------------|----------|

| `PORT`      | Port for the backend server to listen on.     | `5000`                 | Yes      |

| `MONGO_URI` | MongoDB connection string.                    | `mongodb://localhost:27017/event_platform` | Yes      |

| `JWT_SECRET`| Secret key for signing and verifying JWTs.    | `your_jwt_secret_key`  | Yes      |

### Configuration Files
-   `server/config/db.js`: Likely contains the MongoDB connection logic.
-   `server/package.json`: Contains backend script commands and dependencies.
-   `client/package.json`: Contains frontend script commands and dependencies.

## 🔧 Development

### Available Scripts
Assuming standard React/Node.js project setups:

| Command             | Directory | Description                                       |

|---------------------|-----------|---------------------------------------------------|

| `npm run dev`       | `client/` | Starts the frontend development server.           |

| `npm start`         | `server/` | Starts the backend server in development mode.    |

| `npm run build`     | `client/` | Creates a production-ready build of the frontend. |

| `npm test`          | `client/` | Runs frontend tests (if configured).              |

| `npm test`          | `server/` | Runs backend tests (if configured).               |

### Development Workflow
1.  Ensure both frontend and backend development servers are running simultaneously in separate terminal windows.
2.  Any changes saved in the `client/src` directory will automatically trigger a recompile and refresh in the browser.
3.  Changes in `server/` will often require a manual server restart to take effect (depending on `nodemon` or similar setup).

## 🧪 Testing

Testing frameworks were not explicitly detected. If you wish to implement testing:

-   **Frontend**: For a React application, Jest and React Testing Library are common choices.
-   **Backend**: For a Node.js/Express application, Jest, Mocha, or Supertest are frequently used.

```bash

# Example command for running tests (if configured)

# cd client && npm test

# cd server && npm test
```

## 🚀 Deployment

### Production Build
To create a minified and optimized production build of the frontend:

```bash
cd client
npm run build
```
This will generate a `dist` (or `build`) folder in the `client/` directory, containing the static assets ready for deployment.

### Deployment Options
-   **Frontend (Static Hosting)**: The `client/dist` folder can be deployed to static hosting services like Vercel, Netlify, GitHub Pages, or any web server.
-   **Backend (Server Hosting)**: The `server/` application can be deployed to platforms like Render, Heroku, AWS EC2, DigitalOcean, or a custom VPS.
-   **Containerization**: A `Dockerfile` could be added for both client and server to deploy using Docker and Kubernetes.

## 📚 API Reference

The backend provides a RESTful API for interacting with user and event data. Authentication is handled via JSON Web Tokens (JWT).

### Authentication
Users can register and log in to receive a JWT. This token must be included in the `Authorization` header of subsequent requests (as `Bearer <token>`) to access protected routes.

### Endpoints (Inferred)

| Method | Endpoint                    | Description                                       | Authentication Required |

|--------|-----------------------------|---------------------------------------------------|-------------------------|

| `POST` | `/api/auth/register`        | Register a new user account.                      | No                      |

| `POST` | `/api/auth/login`           | Log in an existing user and receive a JWT.        | No                      |

| `GET`  | `/api/events`               | Retrieve a list of all available events.          | No (or optional)        |

| `POST` | `/api/events`               | Create a new event.                               | Yes                     |

| `GET`  | `/api/events/:id`           | Get details for a specific event by ID.           | No (or optional)        |

| `PUT`  | `/api/events/:id`           | Update an existing event by ID.                   | Yes (Owner only)        |

| `DELETE`| `/api/events/:id`          | Delete an event by ID.                            | Yes (Owner only)        |

| `POST` | `/api/events/:id/register`  | Register for a specific event.                    | Yes                     |

| `GET`  | `/api/users/me`             | Get the profile of the authenticated user.        | Yes                     |

| `GET`  | `/api/users/me/events`      | Get events created or registered by the user.     | Yes                     |




</div>

