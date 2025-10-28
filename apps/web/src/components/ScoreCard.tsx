import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";

interface ScoreCardProps {
	title: string;
	score: number;
	label: string;
}

export function ScoreCard({ title, score, label }: ScoreCardProps) {
	return (
		<Card className="gradient-card border-glow shadow-card transition-smooth hover:shadow-glow-sm group animate-fade-in">
			<CardHeader className="pb-4">
				<CardDescription className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
					{title}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-4xl font-display font-bold text-foreground group-hover:text-primary transition-smooth">
					{score}
				</p>
				<div className="space-y-2">
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>{label}</span>
						<span>{score}%</span>
					</div>
					<div className="h-1.5 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
						<div
							className="h-full bg-linear-to-r from-primary to-accent transition-all duration-1000 ease-out shadow-glow-sm"
							style={{ width: `${score}%` }}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
