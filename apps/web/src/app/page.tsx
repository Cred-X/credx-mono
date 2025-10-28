"use client";

import { Header } from "@/components/Header";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { ScoreCompute } from "@/components/ScoreCompute";

export default function Home() {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />
			<ScoreCompute />
			<AboutSection />
			<Footer />
		</div>
	);
}
