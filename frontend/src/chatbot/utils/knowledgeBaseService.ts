// knowledgeBaseService.ts
// Service to fetch knowledge from database instead of markdown file

const KB_API_URL = 'http://localhost:8080/api/knowledge-base';
// Host-level API base (without the /api/knowledge-base path) for health and conversation endpoints
const API_HOST = KB_API_URL.replace('/api/knowledge-base', '');

interface KnowledgeBaseItem {
  id: number;
  category: string;
  subcategory: string;
  title: string;
  content: string;
  keywords: string[];
  priority: number;
}

interface QueryResponse {
  success: boolean;
  count: number;
  data: KnowledgeBaseItem[];
  query?: string;
}

class KnowledgeBaseService {
  private sessionId: string;

  constructor() {
    // Generate unique session ID for tracking conversations
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Query knowledge base for relevant information
   */
  async queryKnowledge(userMessage: string): Promise<string> {
    try {
      const response = await fetch(`${KB_API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        console.error('API response not OK:', response.status);
        return '';
      }

      const result = await response.json();

      // Handle both array response and object with data property
      const data = Array.isArray(result) ? result : result.data;

      if (data && data.length > 0) {
        // Combine relevant content
        return data.map((item: any) => {
          return `**${item.title}**\n${item.content}`;
        }).join('\n\n---\n\n');
      }

      return '';
    } catch (error) {
      console.error('Error querying knowledge base:', error);
      return '';
    }
  }

  /**
   * Search by category
   */
  async getByCategory(category: string): Promise<KnowledgeBaseItem[]> {
    try {
      const response = await fetch(`${KB_API_URL}/category/${category}`);
      const result: QueryResponse = await response.json();
      
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching category:', error);
      return [];
    }
  }

  /**
   * Search with keywords
   */
  async search(query: string, category?: string): Promise<KnowledgeBaseItem[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (category) params.append('category', category);

      const response = await fetch(`${KB_API_URL}/search?${params.toString()}`);
      const result: QueryResponse = await response.json();
      
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  /**
   * Get all knowledge organized by category
   */
  async getAllKnowledge(): Promise<Record<string, KnowledgeBaseItem[]>> {
    try {
      const response = await fetch(`${KB_API_URL}/all`);
      const result = await response.json();
      
      return result.success ? result.data : {};
    } catch (error) {
      console.error('Error fetching all knowledge:', error);
      return {};
    }
  }

  /**
   * Save conversation to database for analytics
   */
  async saveConversation(
    userMessage: string, 
    botResponse: string, 
    kbItemsUsed: number[] = []
  ): Promise<void> {
    try {
      await fetch(`${API_HOST}/api/conversations/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          user_message: userMessage,
          bot_response: botResponse,
          kb_items_used: kbItemsUsed,
        }),
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  /**
   * Get context for AI prompt based on user query
   */
  async getContextForAI(userMessage: string): Promise<string> {
    const knowledge = await this.queryKnowledge(userMessage);
    
    if (!knowledge) {
      return '';
    }

    return `
RELEVANT INFORMATION FROM KNOWLEDGE BASE:

${knowledge}

Use the above information to provide an accurate and helpful response.
`;
  }

  /**
   * Check if API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_HOST}/health`, {
        method: 'GET',
      });
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Knowledge Base API not available:', error);
      return false;
    }
  }
}

// Export singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService;
