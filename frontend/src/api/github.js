import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export const analyzeUser = async (username) => {
  try {
    const response = await axios.get(`${API_BASE}/api/analyze/${username}`, {
      timeout: 90000,
    });
    return { data: response.data, error: null };
  } catch (err) {
    if (err.response?.status === 404) {
      return {
        data: null,
        error: "GitHub user not found. Check the username.",
      };
    }
    if (err.response?.status === 429 || err.response?.status === 403) {
      return {
        data: null,
        error: "GitHub API rate limit hit. Try again in a few minutes.",
      };
    }
    if (err.response?.status === 504 || err.code === "ECONNABORTED") {
      return { data: null, error: "Request timed out. GitHub may be slow." };
    }
    return { data: null, error: "Something went wrong. Please try again." };
  }
};
