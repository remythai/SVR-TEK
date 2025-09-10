import axios, { AxiosRequestConfig } from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'investor' | 'founder';
  founder_id?: number | null;
  investor_id?: number | null;
}

// ---------- GET ----------
export async function getUsers(): Promise<User[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8000/users',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<User[]>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('GET Users error:', error);
    return [];
  }
}

export async function getUser(userId: string): Promise<User | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `http://localhost:8000/users/${userId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<User>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('GET User error:', error);
    return null;
  }
}

// ---------- CREATE ----------
export async function createUser(data: Omit<User, 'id'>): Promise<User | null> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'http://localhost:8000/users',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN,
      'Content-Type': 'application/json'
    },
    data
  };

  try {
    const response = await axios.request<User>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('CREATE User error:', error);
    return null;
  }
}

// ---------- UPDATE ----------
export async function updateUser(id: number, data: Partial<Omit<User, 'id'>>): Promise<User | null> {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `http://localhost:8000/users/${id}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN,
      'Content-Type': 'application/json'
    },
    data
  };

  try {
    const response = await axios.request<User>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('UPDATE User error:', error);
    return null;
  }
}

// ---------- DELETE ----------
export async function deleteUser(id: number): Promise<boolean> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `http://localhost:8000/users/${id}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    await axios.request(config);
    return true;
  } catch (error: unknown) {
    console.error('DELETE User error:', error);
    return false;
  }
}

// ---------- GET BY EMAIL ----------
export async function getUserFromEmail(email: string): Promise<User | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `http://localhost:8000/users/email/${email}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<User>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('GET User by email error:', error);
    return null;
  }
}

// ---------- GET IMAGE ----------
export async function getUserImage(userId: string): Promise<string | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `http://localhost:8000/users/${userId}/image`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<{ imageUrl: string }>(config);
    return response.data.imageUrl;
  } catch (error: unknown) {
    console.error('GET User image error:', error);
    return null;
  }
}
