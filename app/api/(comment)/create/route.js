import prisma from "@/DB/db.config";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { content, userId, postId } = await req.json();
    
    // Basic validation
    if (!content || !userId || !postId) {
      return NextResponse.json({
        message: "Please provide content, user ID, and post ID.",
        status: 400,
      });
    }

    // Create a new comment
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Comment created successfully.",
      data: comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error); // Log the error for debugging
    return NextResponse.json({
      status: 500,
      message: "An error occurred while creating the comment. Please try again later.",
    });
  }
};
