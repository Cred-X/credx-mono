export type WalletScoreResponse = {
	success: boolean;
	message: string;
	data: WalletInfo;
};

interface WalletInfo {
	wallet_address: string;
	score: WalletScore;
}

export interface WalletScore {
	final_score: number;
	tnx_score: number;
	age_score: number;
	assets_score: number;
}

export type WalletScoreError = {
	message: string;
};
