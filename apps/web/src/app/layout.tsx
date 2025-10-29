import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "@/components/providers/provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CredX - On-Chain Reputation Oracle",
	authors: [{ name: "CredX", url: "https://credx.adityatote.tech" }],
	description:
		"Compute your on-chain reputation. Your DeFi creditworthiness, transparently powered by Solana.",
	icons: {
		icon: "/credx_logo.png",
		apple: "/credx_logo.png",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
