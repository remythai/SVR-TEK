import { auth } from "@/lib/auth";

// POST
export async function POST(req: Request) {
  return auth.handler(req);
}

// GET
export async function GET(req: Request) {
  return auth.handler(req);
}
