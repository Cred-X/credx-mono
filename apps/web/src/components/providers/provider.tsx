import { ReactNode } from "react";
import TanStackProvider from "./tanstack-provider";

export default function Provider({ children }: { children: ReactNode }) {
	return <TanStackProvider>{children}</TanStackProvider>;
}
