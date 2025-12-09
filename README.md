# GitHub API Cache with MongoDB

A Node.js Express application that fetches GitHub repository data and caches it in MongoDB with filtering capabilities.

## Features

- Fetches data from two GitHub API endpoints
- Caches repository data in MongoDB
- Filters by language, stars, and fork status
- Automatic cache expiry and refresh
- Comprehensive error handling

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote instance)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/github-cache
CACHE_EXPIRY_HOURS=24
```

4. Start MongoDB service

5. Run the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### 1. Get User Repositories

**Endpoint:** `GET /api/users/:username/repos`

**GitHub API Used:** `https://api.github.com/users/{username}/repos`

**Query Parameters:**
- `language` - Filter by programming language (e.g., `JavaScript`, `Python`)
- `min_stars` - Minimum number of stars (e.g., `10`)
- `exclude_forks` - Exclude forked repositories (`true`/`false`)
- `refresh` - Force refresh from GitHub API (`true`/`false`)

**Example:**
```bash
GET http://localhost:3000/api/users/torvalds/repos?language=C&min_stars=100&exclude_forks=true
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

### 2. Get Repository Details

**Endpoint:** `GET /api/repos/:username/:repo`

**GitHub API Used:** `https://api.github.com/repos/{username}/{repo}`

**Query Parameters:**
- `refresh` - Force refresh from GitHub API (`true`/`false`)

**Example:**
```bash
GET http://localhost:3000/api/repos/torvalds/linux
```

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

## External APIs Used

1. **GitHub Users Repos API**
   - Endpoint: `https://api.github.com/users/{username}/repos`
   - Purpose: Fetch all repositories for a given user

2. **GitHub Repository Details API**
   - Endpoint: `https://api.github.com/repos/{username}/{repo}`
   - Purpose: Fetch detailed information about a specific repository

## Error Handling

The application handles:
- **404 errors** - User or repository not found
- **Network timeouts** - 10-second timeout with 504 response
- **Invalid responses** - Malformed data handling
- **Database errors** - MongoDB connection and query errors
- **API rate limits** - GitHub API rate limit responses

## Caching Strategy

- Data is cached in MongoDB after first fetch
- Cache expires after 24 hours (configurable via `CACHE_EXPIRY_HOURS`)
- Use `?refresh=true` to force refresh from GitHub
- Cache is automatically refreshed when expired

## Assumptions

- GitHub API is accessible without authentication (public data only)
- MongoDB is running locally on default port 27017
- Cache expiry of 24 hours is sufficient for most use cases
- Maximum 100 repositories per user are fetched
- Network timeout is set to 10 seconds

## Project Structure

```
.
├── models/
│   └── Repository.js       # MongoDB schema
├── services/
│   └── githubService.js    # GitHub API client
├── controllers/
│   └── repoController.js   # Business logic
├── routes/
│   └── repoRoutes.js       # API routes
├── server.js               # Application entry point
├── .env                    # Environment variables
├── package.json            # Dependencies
└── README.md               # Documentation
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database for caching
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client for GitHub API
- **dotenv** - Environment configuration
