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
    console.error('error:', error.message);
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
    console.error(`error:`, error.message);
    return null;
  }
}

export async function getFounderImage(startupId: string, founderId: string) {
  try {
    const res = await axios.get(
      `https://api.jeb-incubator.com/startups/${startupId}/founders/${founderId}/image`,
      {
        headers: {
          "X-Group-Authorization": process.env.GROUP_TOKEN,
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    if (res.status !== 200) return null;

    const contentType = res.headers["content-type"] || "image/png";
    const base64 = Buffer.from(res.data).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error: any) {
    console.error("getFounderImage error:", error.message);
    return null;
  }
}
