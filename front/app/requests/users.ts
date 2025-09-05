import axios, { AxiosRequestConfig } from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string,
  founder_id: number,
  investor_id: number
}

export async function getUsers(): Promise<User[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/users',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<User[]>(config);
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

export async function getUser(userId: string): Promise<User | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/users/${userId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<User>(config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/users/email/${email}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<User>(config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

export async function getUserImage(userId: string): Promise<string | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/users/${userId}/image`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<{ imageUrl: string }>(config);
    return response.data.imageUrl;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}
