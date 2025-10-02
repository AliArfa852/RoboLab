// API service for RoboLab backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Component {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  description: string;
  specifications: Record<string, any>;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  supplier: string;
  tags: string[];
  rating: number;
  reviews: ComponentReview[];
  createdAt: string;
  updatedAt: string;
}

export interface ComponentReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  circuitData?: any;
  isPublic: boolean;
  tags: string[];
  collaborators: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  estimatedTime: string;
  requiredComponents: string[];
  instructions: IdeaStep[];
  images: string[];
  authorId: string;
  isPublic: boolean;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
  code?: string;
  tips?: string[];
}

export interface AIUsage {
  userId: string;
  usageDate: string;
  promptsUsed: number;
  tokensUsed: number;
  remainingPrompts: number;
  resetAt: string;
}

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const { auth } = await import('@/lib/firebase');
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// API service class
export class ApiService {
  // Components API
  static async getComponents(params?: {
    query?: string;
    category?: string;
    subcategory?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    minRating?: number;
    tags?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Component[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/components?${searchParams}`, {
      headers: await getAuthHeaders()
    });
    
    return handleResponse<Component[]>(response);
  }

  static async getComponentById(id: string): Promise<ApiResponse<Component>> {
    const response = await fetch(`${API_BASE_URL}/components/${id}`, {
      headers: await getAuthHeaders()
    });
    
    return handleResponse<Component>(response);
  }

  static async getCategories(): Promise<ApiResponse<string[]>> {
    const response = await fetch(`${API_BASE_URL}/components/categories`, {
      headers: await getAuthHeaders()
    });
    
    return handleResponse<string[]>(response);
  }

  static async getSubcategories(category: string): Promise<ApiResponse<string[]>> {
    const response = await fetch(`${API_BASE_URL}/components/categories/${category}/subcategories`, {
      headers: await getAuthHeaders()
    });
    
    return handleResponse<string[]>(response);
  }

  static async searchComponents(query: string, filters?: any): Promise<ApiResponse<Component[]>> {
    const searchParams = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/components/search?${searchParams}`, {
      headers: await getAuthHeaders()
    });
    
    return handleResponse<Component[]>(response);
  }

  // Projects API
  static async getProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
  }): Promise<ApiResponse<Project[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/projects?${searchParams}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<Project[]>(response);
  }

  static async createProject(data: {
    title: string;
    description?: string;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<ApiResponse<Project>> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<Project>(response);
  }

  static async getProjectById(id: string): Promise<ApiResponse<Project>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<Project>(response);
  }

  static async updateProject(id: string, data: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    tags?: string[];
    circuitData?: any;
  }): Promise<ApiResponse<Project>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<Project>(response);
  }

  static async deleteProject(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse<void>(response);
  }

  // AI Assistant API
  static async chatWithAI(message: string, projectId?: string): Promise<ApiResponse<{
    message: string;
    usage: AIUsage;
  }>> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, projectId })
    });
    
    return handleResponse<{ message: string; usage: AIUsage }>(response);
  }

  static async getAIUsage(): Promise<ApiResponse<AIUsage>> {
    const response = await fetch(`${API_BASE_URL}/ai/usage`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<AIUsage>(response);
  }

  // Ideas API
  static async getIdeas(params?: {
    page?: number;
    limit?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    search?: string;
  }): Promise<ApiResponse<Idea[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/ideas?${searchParams}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<Idea[]>(response);
  }

  static async getIdeaById(id: string): Promise<ApiResponse<Idea>> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<Idea>(response);
  }

  static async createIdea(data: {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    tags?: string[];
    estimatedTime?: string;
    requiredComponents?: string[];
    instructions?: IdeaStep[];
    images?: string[];
    isPublic?: boolean;
  }): Promise<ApiResponse<Idea>> {
    const response = await fetch(`${API_BASE_URL}/ideas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<Idea>(response);
  }

  static async updateIdea(id: string, data: Partial<{
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    tags: string[];
    estimatedTime: string;
    requiredComponents: string[];
    instructions: IdeaStep[];
    images: string[];
    isPublic: boolean;
  }>): Promise<ApiResponse<Idea>> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse<Idea>(response);
  }

  static async deleteIdea(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse<void>(response);
  }

  static async likeIdea(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    return handleResponse<void>(response);
  }

  // Health check
  static async healthCheck(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<any>(response);
  }
}

// Export default instance
export default ApiService;
