# GitHub API Cache with MongoDB

A Node.js Express application that fetches GitHub repository data and caches it in MongoDB with filtering capabilities.

## Features

- Fetches data from two GitHub API endpoints
- Caches repository data in MongoDB
- Filters by language, stars, and fork status
- Automatic cache expiry (24 hours)
- Web interface for easy interaction
- REST API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally)
- npm (comes with Node.js)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- express
- mongoose
- axios
- dotenv
- nodemon (dev dependency)

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/github-cache
CACHE_EXPIRY_HOURS=24
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
- MongoDB should be running as a service
- Check status: Open Services and look for "MongoDB Server"

**Mac/Linux:**
```bash
sudo systemctl start mongodb
```

### 4. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3002`

## How to Use

### Web Interface

1. Open your browser
2. Go to `http://localhost:3002`
3. Use the form to search repositories

### API Endpoints

#### 1. Get User Repositories

**Endpoint:** `GET /api/repos/:username`

**GitHub API Used:** `https://api.github.com/users/{username}/repos`

**Example:**
```
http://localhost:3002/api/repos/torvalds
```

**Query Parameters:**
- `language` - Filter by programming language (e.g., JavaScript, Python, C)
- `min_stars` - Minimum number of stars (e.g., 100)
- `exclude_forks` - Exclude forked repositories (true/false)
- `refresh` - Force refresh from GitHub API (true/false)

**Example with filters:**
```
http://localhost:3002/api/repos/torvalds?language=C&min_stars=100&exclude_forks=true
```

**Response:**
```json
{
  "username": "torvalds",
  "count": 2,
  "repositories": [
    {
      "name": "linux",
      "description": "Linux kernel source tree",
      "language": "C",
      "stars": 150000,
      "forks": 45000,
      "is_fork": false,
      "url": "https://github.com/torvalds/linux"
    }
  ]
}
```

#### 2. Get Repository Details

**Endpoint:** `GET /api/repos/:username/:repo`

**GitHub API Used:** `https://api.github.com/repos/{username}/{repo}`

**Example:**
```
http://localhost:3002/api/repos/torvalds/linux
```

**Query Parameters:**
- `refresh` - Force refresh from GitHub API (true/false)

**Response:**
```json
{
  "name": "linux",
  "full_name": "torvalds/linux",
  "description": "Linux kernel source tree",
  "language": "C",
  "stars": 150000,
  "forks": 45000,
  "open_issues": 500,
  "is_fork": false,
  "url": "https://github.com/torvalds/linux",
  "created_at": "2011-09-04T22:48:12Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```
## ScreenShots
<p align="center">
  <img src="https://github.com/user-attachments/assets/b50d3bd7-3ab6-4956-9cc4-4b0d46a04e20" width="400" />
  <img src="https://github.com/user-attachments/assets/d0ec588c-c4b9-4235-8f99-f98004313771" width="400" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4ec2fa51-7a82-4111-a775-1ea343c26aa6" width="400" />
  <img src="https://github.com/user-attachments/assets/63fa3992-98be-4b83-a661-de454886b611" width="400" />
</p>




## External APIs Used

1. **GitHub Users Repos API**
   - Endpoint: `https://api.github.com/users/{username}/repos`
   - Purpose: Fetch all repositories for a given user
   - Limit: 100 repositories per request

2. **GitHub Repository Details API**
   - Endpoint: `https://api.github.com/repos/{username}/{repo}`
   - Purpose: Fetch detailed information about a specific repository

## Error Handling

The application handles:
- **404 errors** - User or repository not found
- **Network timeouts** - 10-second timeout
- **Database errors** - MongoDB connection issues
- **Invalid responses** - Malformed data handling

## Caching Strategy

- Data is cached in MongoDB after first fetch
- Cache expires after 24 hours (configurable)
- Use `?refresh=true` to force refresh from GitHub
- Cache reduces API calls and improves response time

## Project Structure

```
.
├── controllers/
│   └── repoController.js       # Business logic
├── models/
│   └── Repository.js           # MongoDB schema
├── routes/
│   └── repoRoutes.js           # API routes
├── services/
│   └── githubService.js        # GitHub API client
├── public/
│   └── index.html              # Web interface
├── server.js                   # Application entry point
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # Documentation
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database for caching
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client for GitHub API
- **dotenv** - Environment configuration

## Testing with Postman

**List Repositories:**
```
GET http://localhost:3002/api/repos/theyaqub
```

**Get Repository Details:**
```
GET http://localhost:3002/api/repos/theyaqub/repository-name
```

**With Filters:**
```
GET http://localhost:3002/api/repos/theyaqub?language=JavaScript&min_stars=10
```

## Assumptions

- GitHub API is accessible without authentication (public data only)
- MongoDB is running locally on port 27017
- Cache expiry of 24 hours is sufficient
- Maximum 100 repositories per user are fetched
- Network timeout is set to 10 seconds
- Port 3002 is available
