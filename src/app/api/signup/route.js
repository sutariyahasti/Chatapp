import clientPromise from '@/app/config/db';
import {generateToken} from '@/app/config/jwtConfig';


export async function POST(req) {
    try {
        const { name, email, password, url } = await req.json();

        if (!name || !email || !password || !url) {
            return new Response(JSON.stringify({ error: 'Name, email, and password are required' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('users');

        // Ensure email uniqueness
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email is already in use' }), { status: 409 });
        }

        const result = await collection.insertOne({ name, email, password,url });

        if (result.acknowledged) {
            // Insertion was successful
            const insertedId = result.insertedId;

            // Generate JWT token
            const token = generateToken({ userId: insertedId });
            const newUser = {name , email, password, url}

            return new Response(JSON.stringify({ success: true, token, result,newUser }), { status: 201 });
        } else {
            // Insertion failed
            console.error('Failed to insert user:', result);
            return new Response(JSON.stringify({ error: 'Failed to insert user' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
