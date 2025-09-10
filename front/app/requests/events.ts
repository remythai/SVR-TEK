import axios, { AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";

export interface Event {
  id: number;
  name: string;
  dates: string;
  location?: string;
  event_type: string;
}

export interface CreateEventPayload {
  name: string;
  dates: string;
  location?: string;
  event_type: string;
}

const API_BASE_URL = 'http://localhost:8000';
const GROUP_TOKEN = process.env.GROUP_TOKEN;

export async function getEvents(): Promise<Event[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8000/events',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<Event[]>(config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('error:', error.message);
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

// ----------
// -- Create --
// ----------
export async function createEvent(eventData: CreateEventPayload): Promise<Event | null> {
  try {
    const response = await axios.post<Event>(
      `${API_BASE_URL}/events`,
      eventData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Group-Authorization": GROUP_TOKEN || "",
        },
        timeout: 15000,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("createEvent Axios error:", error.message, error.response?.data);
    } else if (error instanceof Error) {
      console.error("createEvent error:", error.message);
    } else {
      console.error("createEvent unexpected error:", error);
    }
    return null;
  }
}

// ----------
// -- Update --
// ----------
export async function updateEvent(eventData: Partial<Event>, eventId: number): Promise<Event | null> {
  try {
    // On supprime l'id pour éviter de le mettre à jour
    const { id, ...payload } = eventData;

    const response = await axios.put<Event>(
      `${API_BASE_URL}/events/${eventId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Group-Authorization": GROUP_TOKEN || "",
        },
        timeout: 15000,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("updateEvent Axios error:", error.message, error.response?.data);
    } else if (error instanceof Error) {
      console.error("updateEvent error:", error.message);
    } else {
      console.error("updateEvent unexpected error:", error);
    }
    return null;
  }
}

// ----------
// -- Delete --
// ----------
export async function deleteEvent(eventId: number): Promise<boolean> {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/events/${eventId}`,
      {
        headers: {
          "X-Group-Authorization": GROUP_TOKEN || "",
        },
        timeout: 10000,
      }
    );

    return response.status === 200 || response.status === 204;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("deleteEvent Axios error:", error.message, error.response?.data);
    } else if (error instanceof Error) {
      console.error("deleteEvent error:", error.message);
    } else {
      console.error("deleteEvent unexpected error:", error);
    }
    return false;
  }
}