import axios from "axios";

export async function getEvents() {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/events',
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

export async function getEvent(eventId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/events/${eventId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('error:', error.message);
    return null;
  }
}

export async function getEventImage(eventId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/events/${eventId}/image`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('error:', error.message);
    return null;
  }
}