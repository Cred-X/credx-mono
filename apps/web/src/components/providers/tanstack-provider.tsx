"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function TanStackProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: 3,
				staleTime: 1000 * 60 * 5,
			},
		},
	});
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
