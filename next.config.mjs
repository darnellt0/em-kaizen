/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Adjust these to your final domains:
    const FRAME_ANCESTORS = [
      "'self'",
      "https://*.webflow.io",
      "https://elevatedmovements.webflow.io",
      "https://elevatedmovements.com",
      "https://*.elevatedmovements.com"
    ].join(" ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${FRAME_ANCESTORS};`
          }
          // Do NOT set X-Frame-Options (it conflicts with CSP frame-ancestors)
        ]
      }
    ];
  }
};

export default nextConfig;
