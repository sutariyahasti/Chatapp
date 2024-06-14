import clientPromise from "@/app/config/db";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'Chat room ID is required' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('messages');

        const userChats = await collection.find({ chatRoom: id }).toArray();

        return new Response(JSON.stringify({ userChats }), { status: 200 });
    } catch (error) {
        console.error('Error fetching chats:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
