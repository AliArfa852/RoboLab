// User types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    projectUpdates: boolean;
    aiQuota: boolean;
  };
  designer: {
    gridSize: number;
    snapToGrid: boolean;
    autoSave: boolean;
  };
  language: string;
}

// Project types
export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  circuitData?: CircuitData;
  isPublic: boolean;
  tags: string[];
  collaborators: ProjectCollaborator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCollaborator {
  userId: string;
  role: 'viewer' | 'editor' | 'admin';
  addedAt: Date;
}

// Circuit types
export interface CircuitData {
  components: CircuitComponent[];
  connections: CircuitConnection[];
  metadata: CircuitMetadata;
}

export interface CircuitComponent {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  properties: Record<string, any>;
  rotation?: number;
  locked?: boolean;
}

export interface CircuitConnection {
  id: string;
  from: { componentId: string; pin: string };
  to: { componentId: string; pin: string };
  color?: string;
  width?: number;
}

export interface CircuitMetadata {
  name: string;
  description?: string;
  version: string;
  createdBy: string;
  lastModified: Date;
  gridSize: number;
  zoom: number;
}

// AI Assistant types
export interface ChatMessage {
  id: string;
  userId: string;
  projectId?: string;
  message: string;
  messageType: 'text' | 'image' | 'file';
  isFromAI: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface AIUsage {
  userId: string;
  usageDate: string;
  promptsUsed: number;
  tokensUsed: number;
  remainingPrompts: number;
  resetAt: Date;
}

// Component types (from MongoDB)
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Idea types
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IdeaStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
  code?: string;
  tips?: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request types
export interface CreateProjectRequest {
  title: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
  circuitData?: CircuitData;
}

export interface CreateCircuitRequest {
  projectId: string;
  name: string;
  circuitJson: CircuitData;
}

export interface UpdateCircuitRequest {
  name?: string;
  circuitJson?: CircuitData;
}

export interface AIChatRequest {
  message: string;
  projectId?: string;
  context?: string;
}

export interface SearchComponentsRequest {
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
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Socket.IO types
export interface SocketEvents {
  'join-project': (projectId: string) => void;
  'leave-project': (projectId: string) => void;
  'circuit-update': (data: { projectId: string; circuitData: CircuitData }) => void;
  'chat-message': (data: { projectId: string; message: string }) => void;
  'user-joined': (data: { projectId: string; userId: string; userName: string }) => void;
  'user-left': (data: { projectId: string; userId: string }) => void;
  'error': (error: string) => void;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Database query types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  databases: {
    mongodb: boolean;
    supabase: boolean;
    redis: boolean;
  };
  services: {
    ai: boolean;
    storage: boolean;
  };
  version: string;
}
