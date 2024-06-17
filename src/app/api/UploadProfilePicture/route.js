import clientPromise from "@/app/config/db"; // Make sure this path is correct

export async function POST(req) {
  try {
    const { url, userId } = await req.json();

    if (!url || !userId) {
      return new Response(
        JSON.stringify({
          error: "userId, imageUrl are required",
        }),
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("Profiles");

    const existingUser = await collection.findOne({ userId });
    if (existingUser) {
        return new Response(JSON.stringify({ error: 'user is already uploaded image' }), { status: 409 });
    }

    // Create a new message
    const Profile = {
      userId,
      url,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(Profile);

    if (result.acknowledged) {
      return new Response(
        JSON.stringify({ message: "Profile created successfully", Profile }),
        { status: 201 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Failed to Upload image" }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error Uploading image:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
