import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000/startups";
const TOKEN = process.env.GROUP_TOKEN;

export async function GET() {
  try {
    const response = await axios.get(BACKEND_URL, {
      headers: { "X-Group-Authorization": TOKEN },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    console.error("GET Startups Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des startups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await axios.post(BACKEND_URL, body, {
      headers: {
        "X-Group-Authorization": TOKEN,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Startups Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la startup" },
      { status: 500 }
    );
  }
}
