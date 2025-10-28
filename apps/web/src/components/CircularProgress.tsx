interface CircularProgressProps {
	score: number;
	maxScore?: number;
	size?: number;
}

export const CircularProgress = ({
	score,
	maxScore = 1000,
	size = 200,
}: CircularProgressProps) => {
	const percentage = (score / maxScore) * 100;
	const circumference = 2 * Math.PI * 80;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	const getScoreColor = (score: number) => {
		if (score >= 750) return "hsl(186 100% 69%)";
		if (score >= 500) return "hsl(267 84% 65%)";
		return "hsl(var(--muted-foreground))";
	};

	return (
		<div className="relative inline-flex items-center justify-center animate-scale-in">
			<svg
				width={size}
				height={size}
				viewBox="0 0 200 200"
				className="transform -rotate-90"
			>
				<circle
					cx="100"
					cy="100"
					r="80"
					stroke="hsl(var(--muted))"
					strokeWidth="12"
					fill="none"
					opacity="0.3"
				/>
				<defs>
					<linearGradient
						id="progressGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="hsl(267 84% 65%)" />
						<stop offset="100%" stopColor="hsl(186 100% 69%)" />
					</linearGradient>
				</defs>
				<circle
					cx="100"
					cy="100"
					r="80"
					stroke="url(#progressGradient)"
					strokeWidth="12"
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					className="transition-all duration-1000 ease-out animate-pulse-glow"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className="text-5xl font-bold transition-smooth"
					style={{ color: getScoreColor(score) }}
				>
					{score}
				</span>
				<span className="text-xs text-muted-foreground mt-1">/ {maxScore}</span>
			</div>
		</div>
	);
};
