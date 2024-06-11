import clientPromise from "@/app/config/db"; // Make sure this path is correct
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try {
        const { chatName, user1, user2, user1Name, user2Name } = await req.json();

        if (!user1 || !user2 || !user1Name || !user2Name) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('chatrooms');

        // Check if the chat room already exists
        const existingChat = await collection.findOne({
            $or: [
                { user1: user1, user2: user2 },
                { user1: user2, user2: user1 },
            ],
        });

        if (existingChat) {
            return new Response(JSON.stringify({ error: 'Chat room already exists' }), { status: 400 });
        }

        const chatRoom = {
            chatName,
            user1,
            user2,
            user1Name,
            user2Name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(chatRoom);

        if (result.acknowledged) {
            return new Response(JSON.stringify(chatRoom), { status: 201 });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to create chat room' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error creating chat room:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
