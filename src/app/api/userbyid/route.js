import clientPromise from "@/app/config/db";
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
        }

        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: 'Invalid User ID format' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('users');

        // Fetch user by ID
        const user = await collection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
