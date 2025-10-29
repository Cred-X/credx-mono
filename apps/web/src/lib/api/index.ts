import axios, { AxiosError, AxiosInstance } from "axios";
import { ComputeSchema } from "../validator/compute.validator";
import { WalletScoreResponse } from "@/types/wallet";

class ApiClient {
	private readonly baseUrl: string = process.env.NEXT_PUBLIC_API_URI!;
	private _axios: AxiosInstance;

	constructor() {
		this._axios = axios.create({
			baseURL: "https://credx-api.adityatote.tech",
			headers: {
				"Content-Type": "application/json",
			},
		});

		this._axios.interceptors.response.use(
			(response) => response,
			(error: AxiosError) => {
				const message =
					(error.response?.data as { message?: string })?.message ||
					error.message;
				throw new Error(message);
			}
		);
	}

	public async computeResult(
		input: ComputeSchema
	): Promise<WalletScoreResponse> {
		const { data } = await this._axios.post("/api/v1/compute", input);
		return data;
	}
}

export const api = new ApiClient();
