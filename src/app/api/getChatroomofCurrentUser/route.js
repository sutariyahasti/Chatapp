import clientPromise from "@/app/config/db";

export async function GET(req) {
    try {
        // Extract the chatroom ID from the request URL
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Chatroom ID is required' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('chatrooms');

        // Find the chatroom by Userid
        const chatRooms = await collection.find({
          $or: [{ user1: id }, { user2: id }],
        }).toArray();
    
        if (!chatRooms || chatRooms.length === 0) {
          return res.status(404).json({ error: 'No chatrooms found for the user' });
        }

        return new Response(JSON.stringify(chatRooms), { status: 200 });
    } catch (error) {
        console.error('Error fetching chatroom:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
