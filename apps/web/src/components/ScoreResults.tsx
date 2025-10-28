import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";
import { ScoreCard } from "@/components/ScoreCard";
import type { WalletScore } from "@/types/wallet";

interface ScoreResultsProps {
	score: WalletScore;
}

const getScoreLabel = (score: number) => {
	if (score >= 75) return "Excellent";
	if (score >= 50) return "Good";
	return "Fair";
};

export function ScoreResults({ score }: ScoreResultsProps) {
	return (
		<section className="container mx-auto px-6 lg:px-8 py-16 md:py-24 relative">
			<div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
			<div className="max-w-6xl mx-auto space-y-8 animate-scale-in">
				<Card className="gradient-card border-glow shadow-xl overflow-hidden relative">
					<div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none" />
					<CardHeader className="text-center pb-6 pt-10 relative">
						<CardDescription className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-2">
							Final Score
						</CardDescription>
						<CardTitle className="text-lg text-muted-foreground font-normal">
							{getScoreLabel(score.final_score)}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex justify-center pb-12 relative">
						<CircularProgress
							score={score.final_score}
							maxScore={100}
							size={220}
						/>
					</CardContent>
				</Card>

				<div className="grid md:grid-cols-3 gap-5">
					<ScoreCard
						title="Transaction Score"
						score={score.tnx_score}
						label="Quality"
					/>
					<ScoreCard
						title="Age Score"
						score={score.age_score}
						label="Maturity"
					/>
					<ScoreCard
						title="Assets Score"
						score={score.assets_score}
						label="Holdings"
					/>
				</div>
			</div>
		</section>
	);
}
