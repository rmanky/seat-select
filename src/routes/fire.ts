import dotenv from 'dotenv';
dotenv.config();

export async function get(req) {
    console.log(req.query.get("id"));
    return {
        status: 200,
        body: {
            key: process.env.FIRE_KEY
        }
    }
}