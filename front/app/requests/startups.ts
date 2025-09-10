import axios, { AxiosRequestConfig, AxiosError } from "axios";

export interface Founder {
  id?: number;
  name: string;
  role?: string;
}

export interface Startup {
  id: number;
  name: string;
  legal_status: string;
  address: string;
  email: string;
  phone: string;
  created_at: string;
  description: string;
  website_url: string;
  social_media_url: string;
  project_status: string;
  needs: string;
  sector: string;
  maturity: string;
  founders: Founder[];
}

export interface CreateStartupPayload {
  name: string;
  legal_status: string;
  address: string;
  email: string;
  phone: string;
  created_at: string;
  description: string;
  website_url: string | null;
  social_media_url: string | null;
  project_status: string;
  needs: string;
  sector: string;
  maturity: string;
  founders: { name: string; role: string }[];
}

// Configuration de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const GROUP_TOKEN = process.env.NEXT_PUBLIC_GROUP_TOKEN;

// Fonction utilitaire pour les headers
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (GROUP_TOKEN) {
    headers['X-Group-Authorization'] = GROUP_TOKEN;
  } else {
    console.warn('NEXT_PUBLIC_GROUP_TOKEN is not defined');
  }
  
  return headers;
};

// Fonction utilitaire pour gérer les erreurs Axios
const handleAxiosError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    console.error(`${context} - Axios Error:`, {
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
    });
    
    // Erreurs spécifiques
    if (axiosError.code === 'ECONNREFUSED') {
      throw new Error('Impossible de se connecter au serveur API. Vérifiez que le serveur est démarré.');
    }
    
    if (axiosError.response?.status === 401) {
      throw new Error('Token d\'autorisation invalide ou manquant.');
    }
    
    if (axiosError.response?.status === 403) {
      throw new Error('Accès refusé. Vérifiez vos permissions.');
    }
    
    if (axiosError.response?.status === 404) {
      throw new Error('Ressource non trouvée.');
    }
    
    throw new Error(`Erreur API (${axiosError.response?.status}): ${axiosError.message}`);
  }
  
  if (error instanceof Error) {
    console.error(`${context} - Error:`, error.message);
    throw error;
  }
  
  console.error(`${context} - Unexpected error:`, error);
  throw new Error('Erreur inattendue');
};

export async function createStartup(
  startupData: CreateStartupPayload
): Promise<Startup | null> {
  try {
    console.log('Client: Sending request to API', {
      url: `${API_BASE_URL}/startups`,
      hasToken: !!GROUP_TOKEN,
      data: startupData
    });

    const response = await axios.post<Startup>(
      `${API_BASE_URL}/startups`,
      startupData,
      {
        headers: getHeaders(),
        timeout: 15000,
      }
    );

    console.log('Client: Response received:', response.data);
    return response.data;

  } catch (error) {
    handleAxiosError(error, 'createStartup');
    return null;
  }
}

export async function getStartups(): Promise<Startup[]> {
  try {
    console.log('Client: Fetching startups', {
      url: `${API_BASE_URL}/startups`,
      hasToken: !!GROUP_TOKEN
    });

    const response = await axios.get<Startup[]>(`${API_BASE_URL}/startups`, {
      headers: getHeaders(),
      timeout: 10000,
    });
    
    console.log('Client: Startups fetched successfully', response.data.length, 'items');
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'getStartups');
    return []; // Retourner un tableau vide uniquement après avoir loggé l'erreur
  }
}

export async function getStartup(startupId: string): Promise<Startup | null> {
  try {
    console.log('Client: Fetching startup', { startupId });

    const response = await axios.get<Startup>(
      `${API_BASE_URL}/startups/${startupId}`,
      {
        headers: getHeaders(),
        timeout: 10000,
      }
    );
    
    console.log('Client: Startup fetched successfully');
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'getStartup');
    return null;
  }
}

export async function getFounderImage(startupId: string, founderId: string): Promise<string | null> {
  try {
    console.log('Client: Fetching founder image', { startupId, founderId });

    const response = await axios.get<ArrayBuffer>(
      `${API_BASE_URL}/startups/${startupId}/founders/${founderId}/image`,
      {
        headers: {
          "X-Group-Authorization": GROUP_TOKEN || "",
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
        timeout: 10000,
      }
    );

    if (response.status !== 200) {
      console.warn('Founder image not found or error', response.status);
      return null;
    }

    const contentType = response.headers["content-type"] || "image/png";
    const base64 = Buffer.from(response.data).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    handleAxiosError(error, 'getFounderImage');
    return null;
  }
}

// Fonction utilitaire pour tester la connexion API
export async function testApiConnection(): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}