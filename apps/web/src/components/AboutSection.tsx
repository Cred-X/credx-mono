import { CheckCircle2, Layers, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<Card className="gradient-card border-glow shadow-card transition-smooth hover:shadow-glow-sm group">
			<CardHeader className="pb-6">
				<div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-bounce shadow-subtle">
					{icon}
				</div>
				<CardTitle className="text-lg font-display font-semibold">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}

export function AboutSection() {
	return (
		<section className="container mx-auto px-6 lg:px-8 py-20 md:py-32 border-t border-border/30 relative">
			<div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
			<div className="max-w-6xl mx-auto space-y-16 relative">
				<div className="max-w-3xl space-y-6 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 shadow-subtle">
						<span className="text-xs uppercase tracking-wider text-primary font-semibold">
							About
						</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
						Decentralized credit scoring for the{" "}
						<span className="gradient-text">next generation</span> of DeFi
					</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Credora is an on-chain reputation oracle that analyzes wallet
						behavior to compute a decentralized credit score. Protocols can
						integrate it to power trust-based DeFi.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					<FeatureCard
						icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
						title="Transparent & Verifiable"
						description="All reputation metrics are derived from on-chain data, ensuring complete transparency and auditability."
					/>
					<FeatureCard
						icon={<Layers className="w-5 h-5 text-primary" />}
						title="Modular Infrastructure"
						description="Built with composability in mind, allowing seamless integration into any DeFi protocol or application."
					/>
					<FeatureCard
						icon={<Zap className="w-5 h-5 text-primary" />}
						title="Built for Solana DeFi"
						description="Optimized for Solana's high-performance blockchain, delivering fast and cost-effective credit scoring."
					/>
				</div>
			</div>
		</section>
	);
}
