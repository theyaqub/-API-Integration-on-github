const Repository = require('../models/Repository');
const { fetchUserRepos, fetchRepoDetails } = require('../services/githubService');

// Helper to check if cached data is still valid for 24 hours
const isCacheValid = (cachedAt) => {
  const expiryHours = process.env.CACHE_EXPIRY_HOURS || 24;
  const expiryMs = expiryHours * 60 * 60 * 1000;
  return Date.now() - new Date(cachedAt).getTime() < expiryMs;
};

// Controller to get list of repositories for a user
const getRepositories = async (req, res) => {
  //try-catch block to handle async operations and errors
  try {
    const { username } = req.params;
    const { language, min_stars, exclude_forks, refresh } = req.query;

    // finding username in cached repositories
    let repos = await Repository.find({ username });

    //if not present then fetch from github
    if (!repos.length || refresh === 'true' || !isCacheValid(repos[0]?.cached_at)) {
      const githubData = await fetchUserRepos(username);

      // Clear old cached data
      await Repository.deleteMany({ username });

      // Prepare data for insertion or filtering
      const repoData = githubData.map(repo => ({
        username,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        open_issues: repo.open_issues_count,
        is_fork: repo.fork,
        html_url: repo.html_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at
      }));
      // Insert new data into the mongodb database
      repos = await Repository.insertMany(repoData);
    }
    // Apply filters
    let filtered = repos;
    if (language) filtered = filtered.filter(r => r.language?.toLowerCase() === language.toLowerCase());
    if (min_stars) filtered = filtered.filter(r => r.stars >= parseInt(min_stars));
    if (exclude_forks === 'true') filtered = filtered.filter(r => !r.is_fork);

    // Respond with filtered repositories
    res.json({
      username,
      count: filtered.length,
      repositories: filtered.map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stars,
        forks: r.forks,
        is_fork: r.is_fork,
        url: r.html_url
      }))
    });
    //catch block to handle errors
  } catch (error) {
    // HTTP response errors (4xx, 5xx)
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (error.response.status === 403) {
        return res.status(403).json({ error: 'GitHub API rate limit exceeded' });
      }
      return res.status(error.response.status).json({
        error: 'GitHub API error',
        details: error.response.data
      });
    }

    // Network errors (no response)
    if (error.request) {
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({ error: 'Request timeout' });
      }
      return res.status(503).json({ error: 'Unable to reach GitHub API' });
    }

    // Application/database errors
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
// Controller to get details of a specific repository
const getRepositoryDetails = async (req, res) => {
  try {
    const { username, repo } = req.params;
    const { refresh } = req.query;

    let repository = await Repository.findOne({ username, name: repo });

    if (!repository || refresh === 'true' || !isCacheValid(repository.cached_at)) {
      const githubData = await fetchRepoDetails(username, repo);

      repository = await Repository.findOneAndUpdate(
        { full_name: githubData.full_name },
        {
          username,
          name: githubData.name,
          full_name: githubData.full_name,
          description: githubData.description,
          language: githubData.language,
          stars: githubData.stargazers_count,
          forks: githubData.forks_count,
          open_issues: githubData.open_issues_count,
          is_fork: githubData.fork,
          html_url: githubData.html_url,
          created_at: githubData.created_at,
          updated_at: githubData.updated_at,
          cached_at: Date.now()
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      name: repository.name,
      full_name: repository.full_name,
      description: repository.description,
      language: repository.language,
      stars: repository.stars,
      forks: repository.forks,
      open_issues: repository.open_issues,
      is_fork: repository.is_fork,
      url: repository.html_url,
      created_at: repository.created_at,
      updated_at: repository.updated_at
    });
  } catch (error) {
    // HTTP response errors (4xx, 5xx)
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (error.response?.status === 403) {
        return res.status(403).json({ error: 'GitHub API rate limit exceeded' });
      }
      return res.status(error.response.status).json({
        error: 'GitHub API error',
        details: error.response.data
      });
    }

    // Network errors (no response)
    if (error.request && !error.response) {
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({ error: 'Request timeout' });
      }
      return res.status(503).json({ error: 'Unable to reach GitHub API' });
    }

    // Application/database errors
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { getRepositories, getRepositoryDetails };
