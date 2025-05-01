const DIFY_API_KEY = 'app-xxx';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

export interface DifyMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessageToDify(message: string): Promise<string> {
  try {
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'user',
      }),
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Error sending message to Dify:', error);
    throw error;
  }
} 
