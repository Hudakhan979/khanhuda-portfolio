import { Router } from "express";

const router = Router();

router.get("/github-stats", async (req, res): Promise<void> => {
  // Return curated stats — in production you'd fetch from GitHub API
  // using process.env.GITHUB_TOKEN for authenticated requests
  const username = process.env.GITHUB_USERNAME ?? "alexjohnson";
  
  res.json({
    username,
    publicRepos: 48,
    followers: 312,
    following: 89,
    totalStars: 1240,
    totalCommits: 3872,
    contributionStreak: 47,
    topLanguages: [
      { name: "TypeScript", percentage: 38, color: "#3178c6" },
      { name: "JavaScript", percentage: 26, color: "#f7df1e" },
      { name: "Python", percentage: 18, color: "#3776ab" },
      { name: "Go", percentage: 10, color: "#00add8" },
      { name: "Rust", percentage: 8, color: "#dea584" },
    ],
    contributions: Array.from({ length: 52 * 7 }, (_, i) => ({
      date: new Date(Date.now() - (52 * 7 - i) * 86400000).toISOString().split("T")[0],
      count: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 10),
    })),
  });
});

export default router;
