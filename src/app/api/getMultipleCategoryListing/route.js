import { NextResponse } from "next/server";
import axios from "axios";

// Handle POST requests
export async function POST(req) {
  const body = await req.json();
  const { categoryId, pageNo = 0, limit = 10 } = body;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}articlesbycategories?categories=${categoryId}&page=${pageNo}&rows=${limit}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYWdyYW5uZXdtZWRpYSIsImlhdCI6MTY2MTIzNjg2Mn0.cngV-wseScZG2S7VQH7DPj7i1LPnA1sxpqGzH2kUAolSJ4hEYeAIlifH8dvoqoQ5P_x-5HhL3-wGTjJauhmwyg",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "POST request failed", details: error.message },
      { status: 400 }
    );
  }
}
