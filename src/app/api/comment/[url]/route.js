import { NextResponse } from "next/server";
import axios from "axios";

// Handle POST requests
export async function POST(req, { params }) {
  try {
    const { url } = await params;
    const body = await req.json();

    let apiUrl = "https://comments-api.jagran.com/";
    const auth = {
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_COMMENT_TOKEN,
      },
    };
    switch (url) {
      case "bookmark-add":
        apiUrl += "bookmarks/user/add";
        break;
      case "bookmark-by-id":
        apiUrl += "bookmarks/user/articleids";
        break;
      case "bookmark-delete":
        apiUrl += "bookmarks/user/delete";
        break;
      case "bookmark-all":
        apiUrl += "bookmarks/user/list";
        break;
      case "bookmark-like":
      case "like-unlike":
        apiUrl += "bookmarks/user/boomarkandlikes";
        break;
      case "like":
        apiUrl += "likesunlikes/user/add";
        break;
      case "unlike":
        apiUrl += "likesunlikes/user/delete";
        break;
      case "comment-submit":
        apiUrl += "comments/submit";
        break;
      case "comment-list":
        apiUrl += "comments/byarticle";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid POST url param" },
          { status: 400 }
        );
    }

    const response = await axios.post(apiUrl, body, auth);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "POST request failed", details: error.message },
      { status: 400 }
    );
  }
}

export async function GET(req, { params }) {
  const { url } = params;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let apiUrl = "https://comments-api.jagran.com/";
  const auth = {
    headers: {
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_COMMENT_TOKEN,
    },
  };

  try {
    if (url === "test") {
      return NextResponse.json({ msg: "success" });
    } else if (url === "commentReply" && id) {
      apiUrl += `articles/commentreply/${id}`;
    } else {
      return NextResponse.json(
        { error: "Invalid GET url param" },
        { status: 400 }
      );
    }

    const response = await axios.get(apiUrl, auth);
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json(
      { error: "GET request failed", details: err.message },
      { status: 400 }
    );
  }
}
