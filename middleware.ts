import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token)
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
