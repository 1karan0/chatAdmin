// API utility functions for data fetching

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response;
}

export async function getBots(): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetchWithAuth('/api/bots');
    const data = await response.json();
    return { data: data.bots || [] };
  } catch (error) {
    console.error('Error fetching bots:', error);
    return { error: 'Failed to fetch bots', data: [] };
  }
}

export async function getBot(botId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetchWithAuth(`/api/bots/${botId}`);
    const data = await response.json();
    return { data: data.bot };
  } catch (error) {
    console.error('Error fetching bot:', error);
    return { error: 'Failed to fetch bot' };
  }
}

export async function createBot(botData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetchWithAuth('/api/bots', {
      method: 'POST',
      body: JSON.stringify(botData),
    });
    const data = await response.json();
    return { data: data.bot };
  } catch (error) {
    console.error('Error creating bot:', error);
    return { error: 'Failed to create bot' };
  }
}

export async function updateBot(botId: string, botData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetchWithAuth(`/api/bots/${botId}`, {
      method: 'PUT',
      body: JSON.stringify(botData),
    });
    const data = await response.json();
    return { data: data.bot };
  } catch (error) {
    console.error('Error updating bot:', error);
    return { error: 'Failed to update bot' };
  }
}

export async function deleteBot(botId: string): Promise<ApiResponse<boolean>> {
  try {
    await fetchWithAuth(`/api/bots/${botId}`, {
      method: 'DELETE',
    });
    return { data: true };
  } catch (error) {
    console.error('Error deleting bot:', error);
    return { error: 'Failed to delete bot' };
  }
}

export async function deployBot(botId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetchWithAuth(`/api/bots/${botId}/deploy`, {
      method: 'POST',
    });
    const data = await response.json();
    return { data: data.bot };
  } catch (error) {
    console.error('Error deploying bot:', error);
    return { error: 'Failed to deploy bot' };
  }
}

export async function getBotAnalytics(botId: string, days: number = 30): Promise<ApiResponse<any>> {
  try {
    const response = await fetchWithAuth(`/api/bots/${botId}/analytics?days=${days}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching bot analytics:', error);
    return { error: 'Failed to fetch analytics' };
  }
}