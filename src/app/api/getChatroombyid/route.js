import clientPromise from "@/app/config/db";
import { ObjectId } from "mongodb";

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

        // Find the chatroom by ID
        const chatroom = await collection.findOne({ _id: new ObjectId(id) });

        if (!chatroom) {
            return new Response(JSON.stringify({ error: 'Chatroom not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(chatroom), { status: 200 });
    } catch (error) {
        console.error('Error fetching chatroom:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
