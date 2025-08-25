import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.ip;

    let country_code = "IN";
    if (clientIP) {
      const { data } = await axios.get(
        `https://auth.jagran.com/ip-to-location`,
        { params: { client_ip: clientIP } }
      );
      country_code = data?.data?.countryData?.country_code;
    }

    return NextResponse.json(
      {
        message: "success",
        ip: request.nextUrl.searchParams.get("ip"),
        clientIP,
        country_code,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching IP:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 404 }
    );
  }
}

export async function POST(request) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.ip;

    let country_code = "IN";
    if (clientIP) {
      const { data } = await axios.get(
        `https://auth.jagran.com/ip-to-location`,
        { params: { client_ip: clientIP } }
      );
      country_code = data?.data?.countryData?.country_code;
    }

    return NextResponse.json(
      {
        message: "success",
        ip: request.nextUrl.searchParams.get("ip"),
        clientIP,
        country_code,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching IP:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 404 }
    );
  }
}