/**
 * LangGraph Backend API Client for LuppoGrove
 * 
 * This service handles all communication with the LangGraph backend
 * deployed on Rahti CSC cloud infrastructure.
 * 
 * Environment Variables Required:
 * - VITE_LANGGRAPH_API_URL: Base URL for the LangGraph API endpoint
 * - VITE_LANGGRAPH_API_KEY: API key for authentication (if required)
 */

const API_BASE_URL = import.meta.env.VITE_LANGGRAPH_API_URL || 'http://localhost:8000/api';
const API_KEY = import.meta.env.VITE_LANGGRAPH_API_KEY || 'YOUR_API_KEY_HERE';

// Type definitions for API requests and responses

export interface ChatMessage {
  role: 'ai' | 'user' | 'system';
  content: string;
  timestamp?: string;
}

export interface ProjectProposalRequest {
  topic: string;
  description: string;
  courseId: string;
  companyId: string;
  requiresNDA?: boolean;
}

export interface ProjectProposalResponse {
  proposalId: string;
  title: string;
  topic: string;
  scope: string;
  timeline: string;
  ndaStatus: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
}

export interface CourseTemplate {
  courseId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  proposalDeadline: string;
  midTermDemo?: string;
  finalDelivery?: string;
  customFields: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text_paragraph' | 'short_text' | 'file_upload';
  maxLength?: number;
  required?: boolean;
}

export interface SmartPasteRequest {
  rawText: string;
  context?: string;
}

export interface SmartPasteResponse {
  courseTitle: string;
  courseDescription: string;
  startDate: string;
  endDate: string;
  proposalDeadline: string;
  suggestedFields: CustomField[];
  confidence: number;
}

/**
 * API Client Class
 */
class LangGraphAPI {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  /**
   * AI Project Wizard - Chat Conversation
   * 
   * Stream or batch process chat messages with LangGraph
   */
  async chatWithAI(
    messages: ChatMessage[],
    context?: { courseId?: string; companyId?: string }
  ): Promise<ChatMessage> {
    // For development/demo: Return mock response
    if (this.apiKey === 'YOUR_API_KEY_HERE') {
      return this.mockChatResponse(messages);
    }

    const response = await this.fetch<{ message: ChatMessage }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, context }),
    });

    return response.message;
  }

  /**
   * Submit Project Proposal via AI Wizard
   */
  async submitProposal(
    data: ProjectProposalRequest
  ): Promise<ProjectProposalResponse> {
    // For development/demo: Return mock response
    if (this.apiKey === 'YOUR_API_KEY_HERE') {
      return this.mockProposalSubmission(data);
    }

    return await this.fetch<ProjectProposalResponse>('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Teacher: Smart Paste - AI Parse Course Info
   * 
   * Use LangGraph to extract structured data from unstructured text
   */
  async smartParseCourseInfo(
    request: SmartPasteRequest
  ): Promise<SmartPasteResponse> {
    // For development/demo: Return mock response
    if (this.apiKey === 'YOUR_API_KEY_HERE') {
      return this.mockSmartParse(request);
    }

    return await this.fetch<SmartPasteResponse>('/courses/smart-parse', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Teacher: Create Course Template
   */
  async createCourse(template: CourseTemplate): Promise<{ courseId: string }> {
    // For development/demo: Return mock response
    if (this.apiKey === 'YOUR_API_KEY_HERE') {
      return {
        courseId: `course_${Math.random().toString(36).substr(2, 9)}`,
      };
    }

    return await this.fetch<{ courseId: string }>('/courses', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  /**
   * Get Course Templates
   */
  async getCourses(filters?: { university?: string }): Promise<CourseTemplate[]> {
    const params = new URLSearchParams(filters as any);
    return await this.fetch<CourseTemplate[]>(`/courses?${params.toString()}`);
  }

  /**
   * Get Proposals for Teacher Review
   */
  async getProposals(courseId: string): Promise<ProjectProposalResponse[]> {
    return await this.fetch<ProjectProposalResponse[]>(
      `/courses/${courseId}/proposals`
    );
  }

  // ==================== MOCK RESPONSES FOR DEVELOPMENT ====================

  private mockChatResponse(messages: ChatMessage[]): ChatMessage {
    const lastUserMessage = messages
      .filter((m) => m.role === 'user')
      .pop();

    const messageCount = messages.filter((m) => m.role === 'user').length;

    // First interaction - topic selection
    if (messageCount === 1) {
      return {
        role: 'ai',
        content:
          'Great choice. Could you give me a quick description of the project in a few sentences?',
        timestamp: new Date().toISOString(),
      };
    }

    // Second interaction - description provided
    if (messageCount === 2) {
      return {
        role: 'ai',
        content:
          'Excellent. I can format that. Does this data require the students to sign an NDA?',
        timestamp: new Date().toISOString(),
      };
    }

    // Third interaction - NDA answered
    if (messageCount === 3) {
      return {
        role: 'ai',
        content:
          "Perfect! I've compiled your proposal. Please review the structured document on the right. When you're ready, you can submit it to the university.",
        timestamp: new Date().toISOString(),
      };
    }

    // Default response
    return {
      role: 'ai',
      content: 'Thank you for the information. Please continue.',
      timestamp: new Date().toISOString(),
    };
  }

  private mockProposalSubmission(
    data: ProjectProposalRequest
  ): ProjectProposalResponse {
    return {
      proposalId: `prop_${Math.random().toString(36).substr(2, 9)}`,
      title: 'Predictive Maintenance Modeling via Telemetry Data',
      topic: data.topic,
      scope:
        'This project involves developing a predictive maintenance algorithm utilizing a comprehensive dataset of crane telemetry. The student team will analyze operational data to identify patterns indicative of potential equipment failures.',
      timeline: '12-14 Weeks',
      ndaStatus: data.requiresNDA ? 'NDA Required' : 'No NDA Required',
      status: 'submitted',
    };
  }

  private mockSmartParse(request: SmartPasteRequest): SmartPasteResponse {
    // Simple mock that extracts some basic info
    const text = request.rawText.toLowerCase();
    
    // Try to extract dates (very basic)
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = request.rawText.match(dateRegex) || [];

    return {
      courseTitle:
        'CS-C3170 Software Engineering Project',
      courseDescription:
        'This course focuses on applying software engineering principles in a real-world context. Students work in teams to deliver a functional software product for an external client.',
      startDate: dates[0] || '2026-09-01',
      endDate: dates[1] || '2026-12-15',
      proposalDeadline: '2026-08-15',
      suggestedFields: [
        {
          id: '1',
          name: 'Project Goals',
          type: 'text_paragraph',
          maxLength: 500,
          required: true,
        },
        {
          id: '2',
          name: 'Technology Stack',
          type: 'short_text',
          required: true,
        },
        {
          id: '3',
          name: 'Team Size',
          type: 'short_text',
          required: false,
        },
      ],
      confidence: 0.85,
    };
  }
}

// Export singleton instance
export const langGraphAPI = new LangGraphAPI(API_BASE_URL, API_KEY);

// Export class for testing or custom instances
export default LangGraphAPI;
