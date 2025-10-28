export type WalletScore = {
  final_score: number;
  tnx_score: number;
  age_score: number;
  assets_score: number;
};

export type WalletScoreError = {
  error: string;
  final_score: number;
  tnx_score?: number;
  age_score?: number;
  assets_score?: number;
};