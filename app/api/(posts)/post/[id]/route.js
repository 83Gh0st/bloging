import prisma from "@/DB/db.config";
import { NextResponse } from "next/server";

// Timeout function for Prisma queries
const fetchWithTimeout = async (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), ms)
    )
  ]);
};

// Fetch a single post
export const GET = async (req, { params }) => {
  console.log("Fetching post with ID:", params?.id); // Debug log
  if (!params?.id) {
    return NextResponse.json({ status: 400, message: "Invalid post ID" });
  }

  try {
    const post = await fetchWithTimeout(
      prisma.post.findUnique({
        where: { id: params.id },
        include: {
          user: { select: { name: true, email: true } }
        },
      }),
      8000 // Set timeout to 8 seconds
    );

    if (!post) {
      return NextResponse.json({ status: 404, message: "Post not found" });
    }

    return NextResponse.json({
      status: 200,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    return NextResponse.json({
      status: 500,
      message: error.message.includes("Query timeout")
        ? "Database query timed out"
        : "An error occurred while fetching the post",
    });
  }
};

// Delete a single post
export const DELETE = async (req, { params }) => {
  console.log("Deleting post with ID:", params?.id); // Debug log
  if (!params?.id) {
    return NextResponse.json({ status: 400, message: "Invalid post ID" });
  }

  try {
    const post = await fetchWithTimeout(
      prisma.post.findUnique({ where: { id: params.id } }),
      8000
    );

    if (!post) {
      return NextResponse.json({ status: 404, message: "Post not found" });
    }

    const deletedPost = await fetchWithTimeout(
      prisma.post.delete({ where: { id: params.id } }),
      8000
    );

    return NextResponse.json({
      status: 200,
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    return NextResponse.json({
      status: 500,
      message: error.message.includes("Query timeout")
        ? "Database query timed out"
        : "An error occurred while deleting the post",
    });
  }
};
