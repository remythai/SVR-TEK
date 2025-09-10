import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000/startups";
const TOKEN = process.env.GROUP_TOKEN;

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  try {
    await axios.delete(`${BACKEND_URL}/${id}`, {
      headers: { "X-Group-Authorization": TOKEN },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE Startup Error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
