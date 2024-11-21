/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return process.env.NODE_ENV !== "production"
            ? [
                  {
                      source: "/backend/:path*",
                      destination: process.env.BACKEND_URL + "/:path*",
                  },
              ]
            : [];
    },
};

export default nextConfig;
