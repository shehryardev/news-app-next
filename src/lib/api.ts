const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Login failed");
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
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
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
