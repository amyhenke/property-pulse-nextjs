export { default } from "next-auth/middleware";

// add all routes that must be logged in to view
export const config = {
    matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};
