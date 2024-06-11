import clientPromise from "@/app/config/db";


export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('users');

        // Fetch all users
        const users = await collection.find({}).toArray();

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}