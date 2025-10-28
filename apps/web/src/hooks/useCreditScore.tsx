import { api } from "@/lib/api";
import { ComputeSchema } from "@/lib/validator/compute.validator";
import { PublicKey } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

export const useComputeScore = () => {
	return useMutation({
		mutationKey: ["compute-score"],
		mutationFn: async (data: ComputeSchema) => {
			try {
				const isValid = PublicKey.isOnCurve(
					new PublicKey(data.wallet_address).toBytes()
				);
				if (!isValid) {
					throw new Error(
						"Invalid Solana wallet address. Please check and try again."
					);
				}
				return await api.computeResult(data);
			} catch (error) {
				if (error instanceof Error) {
					throw error;
				}
				throw new Error("Failed to compute credit score. Please try again.");
			}
		},
		onError: (error: Error) => {
			console.error("Error computing credit score:", error.message);
		},
	});
};
