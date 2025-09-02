import axios from "axios";

export async function getNews() {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/news',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('error:', error.message);
    return [];
  }
}

export async function getNew(newId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/news/${newId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error(`error:`, error.message);
    return null;
  }
}
