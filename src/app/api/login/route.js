import clientPromise from "@/app/config/db";
import { generateToken } from "@/app/config/jwtConfig";

export const maxDuration = 5;

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }

        // Verify database connection
        let client;
        try {
            client = await clientPromise;
            console.log('MongoDB connection successful');
        } catch (error) {
            console.error('MongoDB connection failed:', error);
            return new Response(JSON.stringify({ error: 'Database connection error' }), { status: 500 });
        }
        const db = client.db();
        const collection = db.collection('users');

        // Find user by email
        const user = await collection.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        // Check if password matches
        if (user.password !== password) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id });

        // Authentication successful, return JWT token
        return new Response(JSON.stringify({ success: true, token, user }), { status: 200 });
    } catch (error) {
        console.error('Error processing login request:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
