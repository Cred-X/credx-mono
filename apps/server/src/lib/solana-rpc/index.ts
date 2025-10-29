import {
	IAddressParams,
	IRpcPayload,
	ISignatureParams,
	methodEnum,
	OwnerAssetsParams,
	OwnerAssetsResponse,
	SolanaRpcResponse,
	SolanaSignatureResponse,
} from "@/types/solana-rpc";

export class SolanaApi {
	private static instance: SolanaApi;
	private readonly _id: string;
	private readonly _jsonrpc: string;
	private readonly _rpc: string;

	constructor(private config: { api_key: string; rpc_url?: string }) {
		this._id = "1";
		this._jsonrpc = "2.0";
		this._rpc = config.rpc_url || "https://mainnet.helius-rpc.com";
	}

	public static get_instance({
		api_key,
		rpc_url,
	}: {
		api_key: string;
		rpc_url?: string;
	}): SolanaApi {
		if (!SolanaApi.instance) {
			SolanaApi.instance = new SolanaApi({ api_key, rpc_url });
		}
		return SolanaApi.instance;
	}

	private async request_rpc<R, T = any>(
		rpc_payload: IRpcPayload<T>
	): Promise<R> {
		const isDASMethod = rpc_payload.method === methodEnum.getAssetsByOwner;

		const buildUrl = () => {
			if (!this.config.api_key) return this._rpc;

			if (
				this._rpc.includes("api-key=") ||
				this._rpc.includes(this.config.api_key)
			) {
				return this._rpc;
			}

			const shouldAppendKey = isDASMethod || this._rpc.includes("helius");

			if (shouldAppendKey) {
				const separator = this._rpc.includes("?") ? "&" : "?";
				return `${this._rpc}${separator}api-key=${encodeURIComponent(this.config.api_key)}`;
			}

			return this._rpc;
		};

		const url = buildUrl();

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};
		if (this.config.api_key) {
			headers["Authorization"] = `Bearer ${this.config.api_key}`;
			headers["x-api-key"] = this.config.api_key;
		}

		const maxAttempts = 3;
		const timeoutMs = 8000;

		const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			const controller = new AbortController();
			const id = setTimeout(() => controller.abort(), timeoutMs);
			try {
				const response = await fetch(url, {
					method: "POST",
					headers,
					body: JSON.stringify(rpc_payload),
					signal: controller.signal,
				});
				clearTimeout(id);

				if (!response.ok) {
					const text = await response.text().catch(() => "");
					if (response.status === 401 || response.status === 403) {
						throw new Error(
							"Authentication failed. Please check your API key."
						);
					}
					if (response.status === 429) {
						if (attempt < maxAttempts) {
							await sleep(500 * attempt);
							continue;
						}
						throw new Error("Rate limit exceeded. Please try again later.");
					}
					if (response.status >= 500) {
						if (attempt < maxAttempts) {
							await sleep(300 * attempt);
							continue;
						}
						throw new Error(
							"Solana network is currently unavailable. Please try again later."
						);
					}
					throw new Error(
						`Unable to connect to Solana network (status ${response.status}): ${text}`
					);
				}

				const json = (await response.json()) as any;
				if (json.error) {
					const errorMessage = json.error.message || JSON.stringify(json.error);
					throw new Error(errorMessage);
				}
				return json as R;
			} catch (err) {
				clearTimeout(id);
				const isAbort = (err as any)?.name === "AbortError";
				if (
					(isAbort ||
						(err instanceof Error &&
							/network|fetch|ECONN|ENOTFOUND|timeout/i.test(err.message))) &&
					attempt < maxAttempts
				) {
					await sleep(200 * attempt);
					continue;
				}
				if (err instanceof Error) throw err;
				throw new Error("Unable to process your request. Please try again.");
			}
		}
		throw new Error(
			"Unable to connect to Solana network after multiple attempts. Please try again later."
		);
	}

	public async get_first_transaction_signature(
		address: string
	): Promise<SolanaRpcResponse<SolanaSignatureResponse>> {
		if (!address || typeof address !== "string" || address.trim() === "") {
			throw new Error("Please provide a valid wallet address.");
		}

		// To get the FIRST (oldest) transaction, we need to:
		// 1. Fetch all signatures (or a large batch)
		// 2. Take the last one (oldest chronologically)
		// Note: Solana returns signatures in descending order (newest first)

		const payload: IRpcPayload<IAddressParams> = {
			id: this._id,
			jsonrpc: this._jsonrpc,
			method: methodEnum.getSignaturesForAddress,
			params: [address],
		};

		try {
			const data = await this.request_rpc<
				SolanaRpcResponse<SolanaSignatureResponse>,
				IAddressParams
			>(payload);

			// Return the last signature (oldest transaction) in a result array
			if (data.result && data.result.length > 0) {
				const oldestTransaction = data.result[data.result.length - 1];
				return {
					...data,
					result: [oldestTransaction],
				};
			}

			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Unable to fetch transaction history. Please try again.");
		}
	}

	public async get_transactions_by_address(
		address: string
	): Promise<SolanaRpcResponse<SolanaSignatureResponse>> {
		if (!address || typeof address !== "string" || address.trim() === "") {
			throw new Error("Please provide a valid wallet address.");
		}

		const payload: IRpcPayload<IAddressParams> = {
			id: this._id,
			jsonrpc: this._jsonrpc,
			method: methodEnum.getSignaturesForAddress,
			params: [address],
		};

		try {
			const data = await this.request_rpc<
				SolanaRpcResponse<SolanaSignatureResponse>,
				IAddressParams
			>(payload);
			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Unable to fetch transactions. Please try again.");
		}
	}

	public async get_assets(address: string): Promise<OwnerAssetsResponse> {
		if (!address || typeof address !== "string" || address.trim() === "") {
			throw new Error("Please provide a valid wallet address.");
		}

		const payload: IRpcPayload<OwnerAssetsParams> = {
			id: this._id,
			jsonrpc: this._jsonrpc,
			method: methodEnum.getAssetsByOwner,
			params: {
				ownerAddress: address,
				page: 1,
				limit: 1,
				sortBy: {
					sortBy: "created",
					sortDirection: "desc",
				},
				options: {
					showUnverifiedCollections: true,
					showCollectionMetadata: true,
					showGrandTotal: true,
					showFungible: true,
					showNativeBalance: true,
					showInscription: true,
					showZeroBalance: true,
				},
			},
		};

		try {
			const data = await this.request_rpc<
				OwnerAssetsResponse,
				OwnerAssetsParams
			>(payload);
			console.log("Fetched assets data:", data);
			return data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Unable to fetch wallet assets. Please try again.");
		}
	}
}
