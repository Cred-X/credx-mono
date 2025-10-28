import { Shield } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t border-border/30 mt-auto glass">
			<div className="container mx-auto px-6 lg:px-8 py-10">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm transition-smooth hover:scale-110">
							<Shield className="w-4 h-4 text-white" />
						</div>
						<span className="text-sm text-muted-foreground">
							Powered by{" "}
							<span className="text-foreground font-medium">Solana</span>
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						© 2025{" "}
						<span className="text-foreground font-medium">
							Credora Protocol
						</span>
						. Built on Solana.
					</p>
				</div>
			</div>
		</footer>
	);
}
