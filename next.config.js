/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			"localhost",
			"https://api.pnp.cv",
			"https://pnp.cv",
			"https://placehold.co",
			"http://localhost:1337/",
		],
		// unoptimized: true,
	},
	// webpack(config) {
	// 	config.module.rules.push({
	// 		test: /\.svg$/,
	// 		use: ["@svgr/webpack"],
	// 	});

	// 	return config;
	// },
};

module.exports = nextConfig;
// trailingSlash: false,
// async headers() {
// 	return [
// 		{
// 			// matching all API routes
// 			source: "/:path*",
// 			headers: [
// 				{ key: "Access-Control-Allow-Credentials", value: "true" },
// 				{
// 					key: "Access-Control-Allow-Origin",
// 					value: "*",
// 				},
// 				{
// 					key: "Access-Control-Allow-Methods",
// 					value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
// 				},
// 				{
// 					key: "Access-Control-Allow-Headers",
// 					value:
// 						"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
// 				},
// 			],
// 		},
// 	];
// },
