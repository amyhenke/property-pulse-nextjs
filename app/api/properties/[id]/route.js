// NOT ACTUALLY USING THESE ROUTES IN THIS PROJECT - BUT GOOD EXAMPLES OF HOW TO CREATE THEM

import connectDB from "@/config/database";
import Property from "@/app/models/Property";

// GET Single Property
export const GET = async (request, { params }) => {
    try {
        await connectDB();

        // not an error in course
        // Route "/properties/[id]" used `params.id`. `params` should be awaited before using its properties.
        const URLparams = await params;

        const property = await Property.findById(URLparams.id);

        if (!property)
            return new Response("Property not found", { status: 404 });

        return new Response(property, {
            status: 200,
        });
    } catch (error) {
        return new Response("Something went wrong", { status: 500 });
    }
};

// http://localhost:3000/api/properties/673cd1a86fac6ec6c180f805
// returns: 1 property with matching ID
// {
//     location: {
//       street: '45 Main Street',
//       city: 'New York',
//       state: 'NY',
//       zipcode: '10001'
//     },
//     rates: { weekly: 1000, monthly: 4000 },
//     seller_info: {
//       name: 'Jane Smith',
//       email: 'jane@gmail.com',
//       phone: '212-555-5555'
//     },
//     _id: new ObjectId('673cd1a86fac6ec6c180f805'),
//     name: 'Cozy Downtown Loft',
//     type: 'Apartment',
//     description: 'A cozy downtown loft with great city views.',
//     beds: 1,
//     baths: 1,
//     square_feet: 1800,
//     amenities: [
//       'Wifi',
//       'Full kitchen',
//       'Washer & Dryer',
//       'Free Parking',
//       'Hot Tub',
//       '24/7 Security',
//       'Wheelchair Accessible',
//       'Elevator Access',
//       'Dishwasher',
//       'High-Speed Internet',
//       'Air Conditioning',
//       'Smart TV',
//       'Outdoor Grill/BBQ'
//     ],
//     images: [ 'b1.jpg', 'b2.jpg', 'b3.jpg' ],
//     is_featured: false,
//     createdAt: 2024-01-02T00:00:00.000Z,
//     updatedAt: 2024-01-02T00:00:00.000Z
// }
