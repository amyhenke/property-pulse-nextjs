import connectDB from "@/config/database";
import Property from "@/app/models/Property";

// setting up api routes - similar to Express
// from client component can use useEffect() to request this data
// export const GET = () => {
//     return new Response(JSON.stringify({ message: "Hello World" }), {
//         status: 200,
//     });

//     // http://localhost:3000/api/properties
//     // returns:
//     // {"message":"Hello World"}
// };

// GET All Properties
export const GET = async () => {
    try {
        await connectDB();

        const properties = await Property.find({});

        return new Response(properties, {
            status: 200,
        });
    } catch (error) {
        return new Response("Something went wrong", { status: 500 });
    }
};

// POST request goes here
// To make a GET Single Property route, need to create a new file for that route
