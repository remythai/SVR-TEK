import axios from "axios";

export async function getStartups() {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/startups',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des startups:', error.message);
    return [];
  }
}

export async function getStartup(startupId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/startups/${startupId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error(`Erreur lors de la récupération de la startup ${startupId}:`, error.message);
    return null;
  }
}

export async function getFounderImage(startupId: string, founderId: string) {
  try {
    const response = await axios.get(
      `https://api.jeb-incubator.com/startups/${startupId}/founders/${founderId}/image`,
      {
        headers: {
          'X-Group-Authorization': process.env.GROUP_TOKEN
        },
        responseType: 'text'
      }
    );

    const data = response.data;

    if (typeof data === 'object' && data.detail) {
      console.error(`Erreur API:`, data.detail);
      return null;
    }

    return data;

  } catch (error: any) {
    console.error(`Erreur lors de la récupération de l'image du fondateur ${founderId}:`, error.message);
    return null;
  }
}