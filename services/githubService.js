const axios = require('axios');// Import axios for HTTP requests

const GITHUB_API = 'https://api.github.com';

// Function to fetch user repositories from GitHub API
const fetchUserRepos = async (username) => {
  const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
    params: { per_page: 100 },
    timeout: 10000
  });
  return response.data;
};

// Function to fetch repository details from GitHub API
const fetchRepoDetails = async (username, repo) => {
  const response = await axios.get(`${GITHUB_API}/repos/${username}/${repo}`, {
    timeout: 10000
  });
  return response.data;
};

module.exports = { fetchUserRepos, fetchRepoDetails };
