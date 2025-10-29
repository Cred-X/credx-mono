import Image from "next/image";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="border-b border-border/50 sticky top-0 z-50 glass shadow-subtle">
			<div className="container mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Image
						src="/credx_logo.png"
						alt="CredX Logo"
						width={36}
						height={36}
					/>
					<span className="text-xl font-display font-semibold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
						CredX
					</span>
				</div>

				<nav className="hidden md:flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground transition-smooth"
					>
						About
					</Button>
					<div className="w-px h-5 bg-border/50 mx-2" />
				</nav>
			</div>
		</header>
	);
}
