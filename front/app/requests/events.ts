import axios from "axios";
import { Buffer } from "buffer";

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

  console.log("event", config.headers)

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('error:', error.message);
    return null;
  }
}

// export async function getEventImage(eventId: string) {
//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `https://api.jeb-incubator.com/events/${eventId}/image`,
//     headers: {
//       'X-Group-Authorization': process.env.GROUP_TOKEN
//     }
//   };

//   console.log("image",config.headers)

//   try {
//     const response = await axios.request(config);
//     return response.data;
//   } catch (error: any) {
//     console.error('error:', error.message);
//     return null;
//   }
// }


export async function getEventImage(eventId: string | number) {
  try {
    const res = await axios.get(
      `https://api.jeb-incubator.com/events/${eventId}/image`,
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
    // Retourne une data URL exploitable par <Image />
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.error("getEventImage error:", e);
    return null;
  }
}
