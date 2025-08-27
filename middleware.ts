import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
        console.log("raw token in middleware", req.nextauth.token);
    console.log("cookies", req.cookies.getAll());
  },
  {
    pages:{
      signIn: "/auth", // redirect here instead of /api/auth/signin
    },
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
)

// Apply middleware to all routes *except* "/", "/auth", and static files
export const config = {
  matcher: [
    "/((?!auth|$|_next|favicon.ico).*)",
  ],
}
