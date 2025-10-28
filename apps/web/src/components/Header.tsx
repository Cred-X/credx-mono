import { Wallet, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="border-b border-border/50 sticky top-0 z-50 glass shadow-subtle">
			<div className="container mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm transition-smooth hover:scale-110">
						<Shield className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-display font-semibold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
						Credora
					</span>
				</div>

				<nav className="hidden md:flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground transition-smooth"
					>
						Docs
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground transition-smooth"
					>
						About
					</Button>
					<div className="w-px h-5 bg-border/50 mx-2" />
					<Button
						variant="outline"
						size="sm"
						className="gap-2 font-medium border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-smooth shadow-subtle"
					>
						<Wallet className="w-4 h-4" />
						Connect Wallet
					</Button>
				</nav>

				<Button
					variant="outline"
					size="sm"
					className="md:hidden border-border/50 hover:border-primary/30 transition-smooth"
				>
					<Wallet className="w-4 h-4" />
				</Button>
			</div>
		</header>
	);
}
