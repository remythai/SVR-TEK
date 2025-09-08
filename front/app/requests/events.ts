import axios from "axios";
import { Buffer } from "buffer";

export interface Event {
  id: number;
  name: string;
  dates: string;
  location?: string;
  event_type: string;
}

export async function getEvents(): Promise<Event[]> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8000/events',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string
    }
  };

  try {
    const response = await axios.request<Event[]>(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return [];
  }
}

export async function getEvent(eventId: string): Promise<Event | null> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:8000/events/${eventId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string
    }
  };

  try {
    const response = await axios.request<Event>(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

export async function getEventImage(eventId: string | number): Promise<string | null> {
  try {
    const res = await axios.get<ArrayBuffer>(
      `http://localhost:8000/events/${eventId}/image`,
      {
        headers: {
          "X-Group-Authorization": process.env.GROUP_TOKEN as string,
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    if (res.status !== 200) return null;

    const contentType = res.headers["content-type"] || "image/png";
    const base64 = Buffer.from(res.data).toString("base64");

    return `data:${contentType};base64,${base64}`;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}
