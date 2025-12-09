//modular route file for repository-related endpoints
const express = require('express');
const { getRepositories, getRepositoryDetails } = require('../controllers/repoController');

const router = express.Router();

router.get('/repos/:username', getRepositories);// Endpoint to get user repositories
router.get('/repos/:username/:repo', getRepositoryDetails);// Endpoint to get repository details

module.exports = router;
