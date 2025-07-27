import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the route requires authentication
        if (req.nextUrl.pathname.startsWith("/admin")) {
          // Admin routes require authentication and proper role
          return !!(token?.role && ["SUPER_ADMIN", "EDITOR", "AUTHOR"].includes(token.role as string))
        }
        
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          // Dashboard requires any authenticated user
          return !!token
        }
        
        if (req.nextUrl.pathname.startsWith("/profile")) {
          // Profile routes require authentication
          return !!token
        }
        
        // All other routes are public
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ]
}