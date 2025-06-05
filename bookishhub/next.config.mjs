/** @type {import('next').NextConfig} */

const nextConfig = {images: {domains: ['lh3.googleusercontent.com', 's3.us-west-2.amazonaws.com', 'www.google.com']},
  eslint: {ignoreDuringBuilds: true},
  typescript: { ignoreBuildErrors: true }
};
  
export default nextConfig;
  