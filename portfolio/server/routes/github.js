const express = require('express');

const router = express.Router();

// GET /api/github-stats — public
// If GITHUB_TOKEN and GITHUB_USERNAME are set, fetch live data.
// Otherwise returns curated static data.
router.get('/', async (_req, res) => {
  try {
    const { GITHUB_TOKEN, GITHUB_USERNAME } = process.env;

    if (GITHUB_TOKEN && GITHUB_USERNAME) {
      // Live GitHub REST data
      const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-server',
      };

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers }),
      ]);

      const user = await userRes.json();
      const repos = await reposRes.json();

      const topRepos = (Array.isArray(repos) ? repos : [])
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map((r) => ({
          name: r.name,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.fork_count,
          language: r.language,
          url: r.html_url,
        }));

      const languageCounts = {};
      (Array.isArray(repos) ? repos : []).forEach((r) => {
        if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      });
      const topLanguages = Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

      return res.json({
        username: GITHUB_USERNAME,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        totalStars: (Array.isArray(repos) ? repos : []).reduce((s, r) => s + r.stargazers_count, 0),
        topRepos,
        topLanguages,
        contributions: [],   // GraphQL needed for contribution calendar
      });
    }

    // ── Static fallback ────────────────────────────────────────────────────
    res.json({
      username: 'alexjohnson',
      avatar: null,
      bio: 'Full Stack Developer passionate about open source',
      followers: 1240,
      following: 320,
      publicRepos: 87,
      totalStars: 3420,
      topRepos: [
        { name: 'flux-design-system', description: 'Production-ready React component library', stars: 1240, forks: 180, language: 'TypeScript', url: 'https://github.com/alexjohnson/flux-ds' },
        { name: 'nexacloud-api', description: 'Cloud management REST API', stars: 890, forks: 120, language: 'Node.js', url: 'https://github.com/alexjohnson/nexacloud' },
        { name: 'aura-ai', description: 'GPT-4 powered writing assistant', stars: 760, forks: 95, language: 'TypeScript', url: 'https://github.com/alexjohnson/aura' },
        { name: 'orbit-pm', description: 'Notion-like project management', stars: 530, forks: 70, language: 'JavaScript', url: 'https://github.com/alexjohnson/orbit' },
      ],
      topLanguages: [
        { name: 'TypeScript', count: 34 },
        { name: 'JavaScript', count: 28 },
        { name: 'Python', count: 12 },
        { name: 'Go', count: 8 },
        { name: 'Rust', count: 5 },
      ],
      contributions: [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
