const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Debug logging
console.log("API_BASE_URL:", API_BASE_URL);
console.log("import.meta.env.VITE_API_URL:", import.meta.env.VITE_API_URL);

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface GoogleAuthRequest {
  token: string;
}

interface UserResponse {
  _id: string;
  email: string;
  name?: string;
  picture?: string;
  auth_provider?: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface LikeRequest {
  news_id: string;
}

interface LikeResponse {
  news_id: string;
  liked_at: string;
}

interface Article {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  source?: string;
  publishedAt?: string;
  url?: string;
  tags?: string[];
  like_count?: number;
  similarity?: number;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "ngrok-skip-browser-warning": "true",
    };
  }

  private getHeaders() {
    return {
      "ngrok-skip-browser-warning": "true",
    };
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getHeaders(),
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    console.log("Making login request to:", `${API_BASE_URL}/token`);

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: this.getHeaders(),
      body: formData,
    });

    console.log("Login response status:", response.status);
    console.log("Login response headers:", response.headers);

    if (!response.ok) {
      // Read the response text to see what we actually got
      const errorText = await response.text();
      console.log("Login error response:", errorText);
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    // Check content type before parsing JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text();
      console.log("Unexpected response type:", contentType);
      console.log("Response body:", responseText);
      throw new Error(
        `Expected JSON but got ${contentType}: ${responseText.substring(
          0,
          200
        )}`
      );
    }

    const tokenData = await response.json();
    localStorage.setItem("access_token", tokenData.access_token);
    return tokenData;
  }

  async loginWithGoogle(token: string): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getHeaders(),
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Google authentication failed");
    }

    const tokenData = await response.json();
    localStorage.setItem("access_token", tokenData.access_token);
    return tokenData;
  }

  async getCurrentUser(): Promise<UserResponse> {
    console.log("Making getCurrentUser request to:", `${API_BASE_URL}/auth/me`);
    console.log("Auth headers:", this.getAuthHeaders());

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    console.log("getCurrentUser response status:", response.status);
    console.log("getCurrentUser response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("getCurrentUser error response:", errorText);
      throw new Error(
        `Failed to fetch current user: ${response.status} - ${errorText}`
      );
    }

    // Check content type before parsing JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text();
      console.log("Unexpected response type in getCurrentUser:", contentType);
      console.log("Response body:", responseText);
      throw new Error(
        `Expected JSON but got ${contentType}: ${responseText.substring(
          0,
          200
        )}`
      );
    }

    return response.json();
  }

  async logout() {
    localStorage.removeItem("access_token");
  }

  async likeArticle(newsId: string): Promise<LikeResponse> {
    const response = await fetch(`${API_BASE_URL}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ news_id: newsId }),
    });

    if (!response.ok) {
      throw new Error("Failed to like article");
    }

    return response.json();
  }

  async unlikeArticle(newsId: string): Promise<{ detail: string }> {
    const response = await fetch(`${API_BASE_URL}/like`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ news_id: newsId }),
    });

    if (!response.ok) {
      throw new Error("Failed to unlike article");
    }

    return response.json();
  }

  async getLikes(): Promise<LikeResponse[]> {
    const response = await fetch(`${API_BASE_URL}/likes`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch likes");
    }

    return response.json();
  }

  async getRecommendations(
    trending = false,
    topN = 10,
    days = 7,
    skip = 0
  ): Promise<Article[]> {
    const params = new URLSearchParams({
      top_n: topN.toString(),
      trending: trending.toString(),
      days: days.toString(),
      skip: skip.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/recommendations?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    return response.json();
  }

  async getUserTags(
    topN = 10
  ): Promise<{ tags: Array<{ tag: string; count: number }> }> {
    const params = new URLSearchParams({
      top_n: topN.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/user-tags?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user tags");
    }

    return response.json();
  }

  async getArticles(
    search?: string,
    skip = 0,
    limit = 10
  ): Promise<{
    results: Article[];
    skip: number;
    limit: number;
    count: number;
  }> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(`${API_BASE_URL}/articles?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }
}

export const apiService = new ApiService();
export type { Article, LikeResponse, UserResponse, TokenResponse };
