# 🎯 CredX Wallet Credit Scoring Standard

## Overview

CredX implements a sophisticated **credit scoring system** for Solana wallet addresses, evaluating creditworthiness and reliability on a **0-100 scale**. This document outlines the complete methodology, formulas, and rationale behind our scoring algorithm.

---

## 📊 Scoring Methodology

### Weighting Strategy

Our credit scoring system uses a **weighted approach** that prioritizes proven indicators of wallet reliability:

| Component                | Weight  | Rationale                                            |
| ------------------------ | ------- | ---------------------------------------------------- |
| **Transaction Activity** | **40%** | Primary indicator of active usage and engagement     |
| **Wallet Age/Maturity**  | **40%** | Critical for demonstrating long-term reliability     |
| **Asset Holdings**       | **20%** | Soft factor - bonus but not required for good credit |

**Total**: **100%**

### Design Philosophy

> **Key Insight**: A wallet can achieve an **80/100 credit score** with zero assets if it demonstrates strong transaction history and age. This prevents unfairly penalizing legitimate DeFi users who don't collect NFTs.

---

## 🔢 Component 1: Transaction Score (40% Weight)

### Purpose

Measures wallet **activity and engagement** through transaction history.

### Scoring Scale

**Logarithmic** (normalizes high transaction counts)

### Formula

```
Score = log₁₀(transaction_count) × 23
```

### Tier Breakdown

| Transactions     | Points | Weighted Contribution | Classification |
| ---------------- | ------ | --------------------- | -------------- |
| **0**            | 0      | 0.0                   | No Activity    |
| **1-10**         | 0-23   | 0-9.2                 | New/Inactive   |
| **10-100**       | 23-46  | 9.2-18.4              | Active         |
| **100-1,000**    | 46-69  | 18.4-27.6             | Very Active    |
| **1,000-10,000** | 69-92  | 27.6-36.8             | Highly Active  |
| **10,000+**      | 92-100 | 36.8-40.0             | Expert User    |

### Examples

| Transaction Count | Raw Score | Weighted (40%) | Interpretation |
| ----------------- | --------- | -------------- | -------------- |
| 5                 | 16        | 6.4            | New user       |
| 50                | 39        | 15.6           | Regular user   |
| 500               | 62        | 24.8           | Active trader  |
| 5,000             | 85        | 34.0           | Power user     |
| 50,000            | 108 → 100 | 40.0           | Maximum score  |

### Rationale

- **Logarithmic scaling** prevents whale wallets from dominating
- Encourages consistent activity over time
- 10 transactions is a meaningful threshold for "active" status
- Recognizes power users without over-rewarding them

---

## ⏰ Component 2: Age Score (40% Weight)

### Purpose

Measures wallet **maturity and longevity** through time since first transaction.

### Scoring Scale

**Logarithmic with diminishing returns** after first year

### Formula

**First Year (0-365 days)**:

```
Score = log₁₀(days + 1) × 40
```

**After First Year (365+ days)**:

```
Score = 80 + log₁₀(years + 1) × 20
```

### Tier Breakdown

| Age             | Points | Weighted Contribution | Classification |
| --------------- | ------ | --------------------- | -------------- |
| **0-7 days**    | 0-15   | 0-6.0                 | Brand New      |
| **7-30 days**   | 15-35  | 6.0-14.0              | New            |
| **30-90 days**  | 35-55  | 14.0-22.0             | Established    |
| **90-365 days** | 55-80  | 22.0-32.0             | Mature         |
| **1-2 years**   | 80-90  | 32.0-36.0             | Very Mature    |
| **2+ years**    | 90-100 | 36.0-40.0             | Veteran        |

### Examples

| Age      | Raw Score | Weighted (40%) | Interpretation      |
| -------- | --------- | -------------- | ------------------- |
| 3 days   | 10        | 4.0            | Just created        |
| 1 month  | 35        | 14.0           | Getting started     |
| 3 months | 56        | 22.4           | Established user    |
| 6 months | 71        | 28.4           | Mature wallet       |
| 1 year   | 80        | 32.0           | Proven track record |
| 2 years  | 90        | 36.0           | Long-term holder    |
| 5 years  | 98        | 39.2           | Veteran             |

### Rationale

- **First year accelerated growth**: Rewards new users for reaching milestones
- **Diminishing returns after 1 year**: 2-year wallet not drastically better than 1-year
- Balances **new user fairness** with **veteran recognition**
- Time-tested reliability is highly valued in credit assessment

---

## 💎 Component 3: Assets Score (20% Weight - SOFT FACTOR)

### Purpose

Measures **portfolio diversity** through asset holdings (NFTs, tokens, etc.)

### Scoring Scale

**Square root-based** (gentle, forgiving for low counts)

### Formula

**Special Cases**:

- `0 assets` → **0 points**
- `1 asset` → **40 points** (minimum bonus)

**General Formula**:

- `2-5 assets`: `40 + √(asset_count) × 12`
- `6+ assets`: `√(asset_count) × 20`

### Tier Breakdown

| Assets    | Points | Weighted Contribution | Classification |
| --------- | ------ | --------------------- | -------------- |
| **0**     | 0      | 0.0                   | No Holdings    |
| **1-2**   | 40-57  | 8.0-11.4              | Minimal        |
| **3-5**   | 50-65  | 10.0-13.0             | Basic          |
| **6-10**  | 65-78  | 13.0-15.6             | Moderate       |
| **11-25** | 78-90  | 15.6-18.0             | Good           |
| **25+**   | 90-100 | 18.0-20.0             | Excellent      |

### Examples

| Asset Count | Raw Score | Weighted (20%) | Interpretation   |
| ----------- | --------- | -------------- | ---------------- |
| 0           | 0         | 0.0            | DeFi trader only |
| 1           | 40        | 8.0            | Has something    |
| 3           | 61        | 12.2           | Small collection |
| 10          | 78        | 15.6           | Diversified      |
| 25          | 90        | 18.0           | Collector        |
| 100         | 100       | 20.0           | Maximum score    |

### Rationale

- **20% weight** ensures this is a bonus, not a requirement
- **Square root scaling** is much gentler than logarithmic
- **40-point minimum** for having even 1 asset shows engagement
- Many legitimate wallets have **0 NFTs** but excellent credit
- Prevents discrimination against **DeFi-only users**

---

## 🎯 Final Score Calculation

### Formula

```
Final Score = (Transaction Score × 0.40) + (Age Score × 0.40) + (Assets Score × 0.20)
```

### Rounding

Result is **rounded to nearest integer** (0-100)

### Example Calculations

#### Example 1: DeFi Trader (No NFTs)

```
Transactions: 500 (Score: 62)
Age: 6 months (Score: 71)
Assets: 0 (Score: 0)

Final = (62 × 0.40) + (71 × 0.40) + (0 × 0.20)
Final = 24.8 + 28.4 + 0 = 53.2 → 53
Rating: Good Credit ✅
```

#### Example 2: HODLer (Few Transactions)

```
Transactions: 20 (Score: 30)
Age: 2 years (Score: 90)
Assets: 50 (Score: 98)

Final = (30 × 0.40) + (90 × 0.40) + (98 × 0.20)
Final = 12.0 + 36.0 + 19.6 = 67.6 → 68
Rating: Very Good Credit ✅
```

#### Example 3: Power User

```
Transactions: 2,000 (Score: 76)
Age: 1 year (Score: 80)
Assets: 10 (Score: 78)

Final = (76 × 0.40) + (80 × 0.40) + (78 × 0.20)
Final = 30.4 + 32.0 + 15.6 = 78.0 → 78
Rating: Very Good Credit ✅
```

#### Example 4: Perfect Score

```
Transactions: 10,000+ (Score: 100)
Age: 2+ years (Score: 100)
Assets: 100+ (Score: 100)

Final = (100 × 0.40) + (100 × 0.40) + (100 × 0.20)
Final = 40.0 + 40.0 + 20.0 = 100
Rating: Excellent Credit ✅✅✅
```

---

## 🏆 Credit Rating Levels

### Score Ranges & Risk Assessment

| Score Range | Rating           | Risk Level            | Loan Eligibility | Description                      |
| ----------- | ---------------- | --------------------- | ---------------- | -------------------------------- |
| **0-20**    | Poor Credit      | 🔴 High Risk          | Not Recommended  | New wallet, minimal activity     |
| **21-40**   | Fair Credit      | 🟠 Moderate-High Risk | Conditional      | Some activity, needs improvement |
| **41-60**   | Good Credit      | 🟡 Moderate Risk      | Standard Terms   | Decent history, reliable         |
| **61-80**   | Very Good Credit | 🔵 Low Risk           | Favorable Terms  | Strong track record              |
| **81-100**  | Excellent Credit | 🟢 Very Low Risk      | Best Terms       | Exceptional wallet profile       |

### Visual Rating Scale

```
0        20       40       60       80       100
|---------|---------|---------|---------|---------|
   Poor     Fair     Good   V.Good  Excellent
    🔴       🟠       🟡       🔵       🟢
```

---

## 📈 Real-World Use Cases

### Use Case 1: New User (30 Days Old)

```
Profile:
- Transactions: 15
- Age: 30 days
- Assets: 0

Scores:
- Transaction: 27 → 10.8
- Age: 35 → 14.0
- Assets: 0 → 0.0

Final Score: 25/100 (Fair Credit)
Recommendation: Encourage more activity
```

### Use Case 2: Active Trader (No NFTs)

```
Profile:
- Transactions: 800
- Age: 9 months
- Assets: 0

Scores:
- Transaction: 67 → 26.8
- Age: 75 → 30.0
- Assets: 0 → 0.0

Final Score: 57/100 (Good Credit)
Recommendation: Strong profile despite no assets ✅
```

### Use Case 3: NFT Collector (Light Trader)

```
Profile:
- Transactions: 40
- Age: 1.5 years
- Assets: 30

Scores:
- Transaction: 37 → 14.8
- Age: 84 → 33.6
- Assets: 92 → 18.4

Final Score: 67/100 (Very Good Credit)
Recommendation: Assets complement solid age ✅
```

### Use Case 4: DeFi Power User

```
Profile:
- Transactions: 5,000
- Age: 2 years
- Assets: 5

Scores:
- Transaction: 85 → 34.0
- Age: 90 → 36.0
- Assets: 65 → 13.0

Final Score: 83/100 (Excellent Credit)
Recommendation: Best terms available ✅✅
```

---

## 🔬 Mathematical Properties

### Logarithmic Scaling Benefits

1. **Normalizes Outliers**: Prevents extreme values from dominating
2. **Diminishing Returns**: Each additional unit has less impact
3. **Fairness**: Whale wallets don't get unfair advantages
4. **Realistic Growth Curves**: Matches real-world credit behavior

### Why Square Root for Assets?

| Count | Logarithmic | Square Root | Chosen         |
| ----- | ----------- | ----------- | -------------- |
| 1     | 0           | 40          | ✅ Square Root |
| 5     | 16          | 65          | ✅ Square Root |
| 10    | 23          | 78          | ✅ Square Root |
| 100   | 46          | 100         | ✅ Square Root |

Square root provides a **gentler, more forgiving curve** for low asset counts.

---

## 🛡️ Edge Cases & Error Handling

### Zero Values

- **0 transactions** → Score: 0
- **0 days old** → Score: 0 (shouldn't happen)
- **0 assets** → Score: 0 (common, acceptable)

### Invalid Data

- **Null/undefined results** → Score: 0 (safe default)
- **Non-finite numbers** → Score: 0
- **API failures** → Component score: 0, logged for monitoring

### Negative Values

- Age calculation can't be negative (protected by validation)
- Transaction/asset counts can't be negative

### Maximum Values

- All component scores **capped at 100**
- Final score **capped at 100**

---

## 🔍 Comparison with Traditional Credit Scores

| Aspect             | Traditional FICO    | CredX Wallet Score             |
| ------------------ | ------------------- | ------------------------------ |
| **Scale**          | 300-850             | 0-100                          |
| **History Length** | 15%                 | 40% (more important)           |
| **Activity**       | Payment History 35% | Transactions 40%               |
| **Utilization**    | 30%                 | Assets 20% (softer)            |
| **Inquiries**      | 10%                 | Not applicable                 |
| **Mix**            | 10%                 | Incorporated into transactions |
| **Philosophy**     | Debt repayment      | On-chain activity              |

---

## 📊 Score Distribution (Expected)

Based on typical Solana wallet profiles:

```
Score Range  | % of Wallets | Bar Chart
-------------|--------------|---------------------------
0-20         | 25%          | █████
21-40        | 20%          | ████
41-60        | 25%          | █████
61-80        | 20%          | ████
81-100       | 10%          | ██
```

---

## 🚀 Implementation Details

### Technology Stack

- **Runtime**: Cloudflare Workers (Edge)
- **Language**: TypeScript
- **Execution**: Parallel async operations
- **Performance**: <15ms CPU time
- **Reliability**: Graceful degradation on errors

### API Integration

```typescript
// All component scores calculated in parallel
const [txScore, ageScore, assetsScore] = await Promise.all([
	get_score_by_tnx(solana, walletAddress),
	get_score_by_age(solana, walletAddress),
	get_score_by_assets(solana, walletAddress),
]);
```

### Constants

```typescript
const SCORE_WEIGHTS = {
	TRANSACTION: 0.4,
	AGE: 0.4,
	ASSETS: 0.2,
} as const;

const TRANSACTION_MULTIPLIER = 23;
const AGE_FIRST_YEAR_MULTIPLIER = 40;
const ASSET_MULTIPLIER = 20;
```

---

## 🎓 Scoring Philosophy Summary

### Core Principles

1. **Activity > Holdings**: What you do matters more than what you have
2. **Time Builds Trust**: Long-term presence demonstrates reliability
3. **Assets Are Optional**: NFT-free wallets can still have excellent credit
4. **Fair to All**: DeFi users, traders, collectors, and HODLers all evaluated fairly
5. **Transparent & Deterministic**: Same inputs always produce same output

### What This System Rewards

✅ Consistent transaction activity  
✅ Long wallet history (1+ years)  
✅ Diverse asset holdings (bonus)  
✅ Regular engagement with Solana ecosystem

### What This System Doesn't Penalize

✅ Having zero NFTs/assets (common for DeFi users)  
✅ Being a new wallet (can quickly build credit)  
✅ Low transaction counts if old wallet (HODLers)  
✅ High transaction counts without age (power users welcomed)

---

## 📞 For Developers

### Quick Reference

```typescript
import { compute_score } from "@/lib/utils/score.util";
import { SolanaApi } from "@/lib/solana-rpc";

const solana = SolanaApi.get_instance({ api_key: env.SOLANA_API_KEY });
const score = await compute_score(solana, walletAddress);

// Returns: 0-100 (integer)
```

### Score Interpretation Function

```typescript
function getCreditRating(score: number): string {
	if (score >= 81) return "Excellent Credit (Very Low Risk)";
	if (score >= 61) return "Very Good Credit (Low Risk)";
	if (score >= 41) return "Good Credit (Moderate Risk)";
	if (score >= 21) return "Fair Credit (Moderate-High Risk)";
	return "Poor Credit (High Risk)";
}
```


## 🔄 Changelog

### v1.0 (October 2025)

- Initial release
- Implemented 40/40/20 weighting strategy
- Logarithmic scaling for transactions and age
- Square root scaling for assets
- Cloudflare Workers optimization
- Comprehensive error handling

---

