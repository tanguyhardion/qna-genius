import { QuizResponse, ChatResponse } from '@/types';

const API_BASE_URL = 'https://langchain-serverless.vercel.app/api';

export async function generateQuiz(content: string): Promise<QuizResponse> {
  const response = await fetch(`${API_BASE_URL}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ articleInput: content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate quiz: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    questions: data.items || data.questions || []
  };
}

export async function sendChatMessage(
  question: string,
  answer: string,
  context: string,
  userMessage: string,
  attemptCount: number = 0
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      qaData: {
        question,
        answer,
        context,
      },
      userMessage,
      attemptCount,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send chat message: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchArticleFromUrl(url: string): Promise<string> {
  try {
    // For a real implementation, you'd need a backend service to fetch the content
    // For now, we'll use a simple fetch with CORS proxy or show an error
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Basic HTML parsing to extract text content
    // In a real app, you'd want more sophisticated parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());
    
    // Get text content
    const text = doc.body?.textContent || doc.textContent || '';
    
    return text.trim();
  } catch (error) {
    console.error('Error fetching article from URL:', error);
    throw new Error('Impossible de récupérer le contenu de l\'article. Veuillez coller le contenu manuellement.');
  }
}
