import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript:{
        ignoreBuildErrors:true
    },
    eslint:{
        ignoreDuringBuilds:true
    },

    images:{
        remotePatterns:[
            {
                protocol: "https",
                hostname: "img.clerk.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**', // adjust if you want to constrain path
            },
        ]
    }
  /* config options here */
};

export default nextConfig;
