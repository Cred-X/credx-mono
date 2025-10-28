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

	constructor(private config: { api_key: string, rpc_url?: string }) {
		this._id = "1";
		this._jsonrpc = "2.0";
		this._rpc = config.rpc_url || "https://mainnet.helius-rpc.com";
	}

	public static get_instance({ api_key, rpc_url }: { api_key: string, rpc_url?: string }): SolanaApi {
		if (!SolanaApi.instance) {
			SolanaApi.instance = new SolanaApi({ api_key, rpc_url });
		}
		return SolanaApi.instance;
	}

	private async request_rpc<R, T = any>(
		rpc_payload: IRpcPayload<T>
	): Promise<R> {
		try {
			const response = await fetch(this._rpc, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.config.api_key}`,
				},
				body: JSON.stringify(rpc_payload),
			});

			if (!response.ok) {
				if (response.status === 401 || response.status === 403) {
					throw new Error("Authentication failed. Please check your API key.");
				}
				if (response.status === 429) {
					throw new Error("Rate limit exceeded. Please try again later.");
				}
				if (response.status >= 500) {
					throw new Error(
						"Solana network is currently unavailable. Please try again later."
					);
				}
				throw new Error(
					"Unable to connect to Solana network. Please try again."
				);
			}

			const json = (await response.json()) as any;

			// Check for RPC-level errors in the response
			if (json.error) {
				const errorMessage = json.error.message || "Unknown error occurred";
				throw new Error(errorMessage);
			}

			return json as R;
		} catch (error) {
			if (error instanceof Error) {
				// Re-throw our custom errors as-is
				throw error;
			}
			throw new Error("Unable to process your request. Please try again.");
		}
	}

	public async get_first_transaction_signature(
		address: string
	): Promise<SolanaRpcResponse<SolanaSignatureResponse>> {
		if (!address || typeof address !== "string" || address.trim() === "") {
			throw new Error("Please provide a valid wallet address.");
		}

		const payload: IRpcPayload<ISignatureParams> = {
			id: this._id,
			jsonrpc: this._jsonrpc,
			method: methodEnum.getSignaturesForAddress,
			params: [address, { limit: 1, before: null }],
		};

		try {
			const data = await this.request_rpc<
				SolanaRpcResponse<SolanaSignatureResponse>,
				ISignatureParams
			>(payload);
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
