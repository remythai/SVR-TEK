import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("API Route: Receiving request with body:", body);

    const response = await axios.post(
      "http://localhost:8000/news",
      body,
      {
        headers: {
          "X-Group-Authorization": process.env.GROUP_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("API Route: Backend response:", response.data);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API Route Error:", error.message);
      console.error("API Route Error Response:", error.response?.data);

      if (error.code === "ECONNREFUSED") {
        return NextResponse.json(
          {
            error:
              "Impossible de contacter le serveur backend. Vérifiez qu'il est démarré.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "Erreur serveur",
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "Erreur inattendue" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await axios.get("http://localhost:8000/news", {
      headers: {
        "X-Group-Authorization": process.env.GROUP_TOKEN,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GET News Error:", error.message);
    } else {
      console.error("Unexpected GET Error:", error);
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération des news" },
      { status: 500 }
    );
  }
}
