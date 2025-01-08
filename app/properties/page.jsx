import PropertyCard from "@/components/PropertyCard"
// import properties from '@/properties.json'
import connectDB from "@/config/database"
import Property from "../models/Property"
import Pagination from "@/components/pagination"

// page param had a default of 1 so if its not passed in, still see page 1
// pageSize is number of properties on each page
// { searchParams: { page = 1, pageSize = 2 } }
// searchParams in the route handler is asynchronous, but above is destructuring it as if it were synchronous. should await searchParams or adjust your implementation to ensure that the destructuring happens after it's resolved.
const PropertiesPage = async ({ searchParams }) => {
    // console.log("HELLO")
    // console.log(await searchParams)

    const params = await searchParams
    // const page = parseInt(searchParams.page || "1", 10)
    const page = params.page || "1"

    // const pageSize = parseInt(searchParams.pageSize || "2", 10)
    const pageSize = params.pageSize || "9"

    await connectDB()

    // if we're on page 2 and we have 2 per page, then page 2 should start with 3rd property. Also page 3 should start with 5th property.
    const skip = (page - 1) * pageSize
    const total = await Property.countDocuments({})

    // find method is added by mongoose
    // lean returns plain JS objects, instead of mongoose documents. this optimises query performance. can only do this if readonly - not gunna be using an mongoose methods on the results so its fine here
    const properties = await Property.find({}).skip(skip).limit(pageSize)
    // limit stops it from only collecting the number of properties set to the pageSize
    // skip will start it at the value of the skip variable (e.g. number 3 on page 2)

    const showPagination = total > pageSize
    console.log(showPagination)

    return (
        <section className="px-4 py-6">
            <div className="container-xl lg:container m-auto px-4 py-6">
                {properties.length === 0 ? (
                    <p>No properties found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map(property => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
                {showPagination && <Pagination page={parseInt(page)} pageSize={parseInt(pageSize)} totalItems={total} />}
            </div>
        </section>
    )
}

export default PropertiesPage
