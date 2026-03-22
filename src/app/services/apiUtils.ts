/**
 * API Utilities for LuppoGrove
 * 
 * Helper functions for making authenticated API requests with
 * automatic token refresh, error handling, and retry logic.
 */

import { authService, AuthTokens } from './auth';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Check if error is due to expired/invalid token
 */
function isAuthError(status: number): boolean {
  return status === 401 || status === 403;
}

/**
 * Make an authenticated API request with automatic token refresh
 */
export async function authenticatedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const authState = authService.getAuthState();
  
  if (!authState.isAuthenticated || !authState.tokens) {
    throw new APIError('Not authenticated', 401, 'AUTH_REQUIRED');
  }

  // Check if token is expired
  if (authState.tokens.expiresAt < Date.now()) {
    // Try to refresh token
    if (authState.tokens.refreshToken) {
      try {
        await authService.refreshToken(authState.tokens.refreshToken);
      } catch (error) {
        // Refresh failed, redirect to login
        await authService.logout();
        window.location.href = '/login';
        throw new APIError('Session expired', 401, 'SESSION_EXPIRED');
      }
    } else {
      // No refresh token, redirect to login
      await authService.logout();
      window.location.href = '/login';
      throw new APIError('Session expired', 401, 'SESSION_EXPIRED');
    }
  }

  // Get fresh auth state after potential refresh
  const freshAuthState = authService.getAuthState();
  
  // Add authorization header
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${freshAuthState.tokens?.accessToken}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle auth errors
      if (isAuthError(response.status)) {
        await authService.logout();
        window.location.href = '/login';
        throw new APIError('Authentication failed', response.status, 'AUTH_FAILED');
      }

      // Parse error response
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `API Error: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or parsing error
    console.error('API request failed:', error);
    throw new APIError(
      'Network error or invalid response',
      0,
      'NETWORK_ERROR',
      error
    );
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry auth errors or client errors (4xx)
      if (error instanceof APIError) {
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
      }
      
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Check backend health/connectivity
 */
export async function checkBackendHealth(baseURL: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseURL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Upload file with progress tracking
 */
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ fileId: string; url: string }> {
  const authState = authService.getAuthState();
  
  if (!authState.isAuthenticated || !authState.tokens) {
    throw new APIError('Not authenticated', 401, 'AUTH_REQUIRED');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });
    }
    
    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new APIError('Invalid response', xhr.status, 'INVALID_RESPONSE'));
        }
      } else {
        reject(new APIError(`Upload failed: ${xhr.statusText}`, xhr.status, 'UPLOAD_FAILED'));
      }
    });
    
    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new APIError('Upload failed', 0, 'NETWORK_ERROR'));
    });
    
    xhr.addEventListener('abort', () => {
      reject(new APIError('Upload cancelled', 0, 'UPLOAD_CANCELLED'));
    });
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Send request
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${authState.tokens.accessToken}`);
    xhr.send(formData);
  });
}

/**
 * Download file with progress tracking
 */
export async function downloadFile(
  url: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const authState = authService.getAuthState();
  
  if (!authState.isAuthenticated || !authState.tokens) {
    throw new APIError('Not authenticated', 401, 'AUTH_REQUIRED');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authState.tokens.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new APIError('Download failed', response.status, 'DOWNLOAD_FAILED');
    }

    // Get content length for progress
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    // Read stream with progress
    const reader = response.body?.getReader();
    if (!reader) {
      throw new APIError('Stream not available', 0, 'STREAM_ERROR');
    }

    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      received += value.length;
      
      if (onProgress && total > 0) {
        const progress = (received / total) * 100;
        onProgress(progress);
      }
    }

    // Create blob and download
    const blob = new Blob(chunks);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Download failed', 0, 'DOWNLOAD_ERROR', error);
  }
}

/**
 * WebSocket connection with authentication and reconnection
 */
export class AuthenticatedWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: string[] = [];

  constructor(
    private url: string,
    private onMessage: (data: any) => void,
    private onError?: (error: Error) => void
  ) {}

  async connect(): Promise<void> {
    const authState = authService.getAuthState();
    
    if (!authState.isAuthenticated || !authState.tokens) {
      throw new APIError('Not authenticated', 401, 'AUTH_REQUIRED');
    }

    const wsUrl = `${this.url}?token=${authState.tokens.accessToken}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Send queued messages
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) this.send(message);
      }
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.onError) {
        this.onError(new Error('WebSocket error'));
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.reconnect();
    };
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (this.onError) {
        this.onError(new Error('Max reconnection attempts reached'));
      }
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  send(data: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      // Queue message if not connected
      this.messageQueue.push(data);
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

/**
 * Export utilities
 */
export default {
  authenticatedFetch,
  retryWithBackoff,
  checkBackendHealth,
  uploadFile,
  downloadFile,
  AuthenticatedWebSocket,
  APIError,
};
