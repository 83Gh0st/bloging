import prisma from "@/DB/db.config";
import { NextResponse } from "next/server";

// Fetch a single post
export const GET = async (_, { params }) => {
  console.log("Fetching post with ID:", params.id); // Debug log
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id, // Ensure params.id is correct
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error); // Log the error
    return NextResponse.json({
      status: 500,
      message: "An error occurred while fetching the post",
    });
  }
};

// Delete a single post
export const DELETE = async (_, { params }) => {
  console.log("Deleting post with ID:", params.id); // Debug log
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return NextResponse.json({
        status: 404,
        message: "Post not found",
      });
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error); // Log the error
    return NextResponse.json({
      status: 500,
      message: "An error occurred while deleting the post",
    });
  }
};
