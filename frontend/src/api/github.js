import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const HEALTH_POLL_INTERVAL_MS = 3000;
const HEALTH_TIMEOUT_MS = 90000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE}/health`, { timeout: 2000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

export const waitForBackend = async (onAttempt) => {
  const startedAt = Date.now();
  let attemptCount = 0;

  while (Date.now() - startedAt < HEALTH_TIMEOUT_MS) {
    attemptCount += 1;
    onAttempt?.(attemptCount);

    if (await checkHealth()) {
      return true;
    }

    const remainingMs = HEALTH_TIMEOUT_MS - (Date.now() - startedAt);
    if (remainingMs <= 0) {
      break;
    }

    await sleep(Math.min(HEALTH_POLL_INTERVAL_MS, remainingMs));
  }

  return false;
};

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
        error: "GitHub API rate limit reached. Try again in a few minutes.",
      };
    }
    if (err.response?.status === 504 || err.code === "ECONNABORTED") {
      return {
        data: null,
        error: "Connection lost. Please check your internet and try again.",
      };
    }
    return {
      data: null,
      error: "Connection lost. Please check your internet and try again.",
    };
  }
};
