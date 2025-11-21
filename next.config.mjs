/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Adjust these to your final domains:
    const FRAME_ANCESTORS = [
      "'self'",
      "https://preview.webflow.com",           // Webflow Designer preview
      "https://*.webflow.io",                  // published on webflow.io
      "https://elevatedmovements.webflow.io",  // your specific webflow io site (optional if covered above)
      "https://elevatedmovements.com",         // custom domain (root)
      "https://*.elevatedmovements.com",       // any subdomains
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
