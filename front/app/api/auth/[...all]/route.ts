import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    return await auth.handler(req);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    return await auth.handler(req);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
