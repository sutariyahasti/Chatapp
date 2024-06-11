import clientPromise from "@/app/config/db"; // Make sure this path is correct

export async function POST(req) {
    try {
        const { chatRoom, content, sender } = await req.json();

        if (!chatRoom || !content || !sender) {
            return new Response(JSON.stringify({ error: 'Chat room, content, and sender are required' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('messages');

        // Create a new message
        const message = {
            chatRoom,
            sender,
            content,
            chat: chatRoom,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(message);

        if (result.acknowledged) {
            return new Response(JSON.stringify({ message: "Chat sent successfully" }), { status: 201 });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to send chat' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error sending chat:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
