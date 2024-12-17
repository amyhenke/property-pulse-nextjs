// Did this to deal with error: Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.

export function convertToSerializeableObject(leanDocument) {
    for (const key of Object.keys(leanDocument)) {
        if (leanDocument[key].toJSON && leanDocument[key].toString) {
            leanDocument[key] = leanDocument[key].toString();
        }
    }

    return leanDocument;
}

// serializable means that an object or data structure can be converted into a format suitable for storage or transmission, such as a JSON string, binary format, or XML, and then reconstructed (deserialized) back into the original object later.

// For Next.js specifically, serializable means that the data passed from the server to the client must conform to formats that can be safely converted to and from JSON. JSON is a widely used serialization format in web applications, and Next.js uses it to hydrate the Client Component tree.

// Next.js serializes server-side props and data before sending them to the browser. This is done because:
// Data is sent as JSON: Props passed from the server to client need to be JSON-compatible so they can be included in the HTML or sent over the network.
// Client hydration: During hydration, the browser rebuilds the React tree using the data it receives, and it can only work with serializable (JSON-compatible) data.

// you might encounter issues with:

// 1. MongoDB ObjectId: Must be converted to a string.
//      doc._id.toString();

// 2. Dates: Use .toISOString() to convert them to strings.
//      new Date().toISOString();

// 3. Functions or Methods: These cannot be serialized.

// // Don't pass functions in props:
//      { action: () => {} }

// 4. Class Instances: Convert these into plain objects or serialize them manually.

// // Convert class instance
//      const plainObject = { ...instance };

// 5. Circular References: Break circular references before serialization.
