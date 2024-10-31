import { v2 as cloudinary } from "cloudinary";

// POST endpoint to generate a Cloudinary signature
export async function POST(request) {
  try {
    const body = await request.json(); // Parse incoming JSON
    const { paramsToSign } = body; // Extract paramsToSign from the body

    // Check for required parameters
    if (!paramsToSign || !process.env.CLOUDINARY_API_SECRET) {
      return new Response(
        JSON.stringify({ error: "paramsToSign or CLOUDINARY_API_SECRET is missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log the extracted parameters for debugging
    console.log("paramsToSign:", paramsToSign);
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

    // Generate the signature using the provided parameters
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    // Return the generated signature in the response
    return new Response(
      JSON.stringify({ signature }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating signature:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
