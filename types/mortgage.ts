export interface MortgageInputs {
    price: number;
    deposit: number;
    term: number;
    interest: number;
}

export interface MortgageResults {
    monthlyPayment: number;
    totalRepayment: number;
    capital: number;
    interest: number;
    affordabilityCheck: number;
}

export interface YearlyBreakdown {
    year: number;
    remainingDebt: number;
}

export interface FullMortgageResults extends MortgageResults {
    yearlyBreakdown: YearlyBreakdown[];
}

export interface BankRateResponse {
    date: string;
    rate: number;
}

export interface MortgageErrors {
    price?: string;
    deposit?: string;
    term?: string;
    interest?: string;
}

export interface UseMortgageCalculator {
    results: FullMortgageResults | null;
    errors: MortgageErrors;
    loading: boolean;
    calculateMortgage: (inputs: MortgageInputs) => void;
    fetchCurrentRate: () => Promise<number>;
}

export interface MortgageFormData {
    price: number;
    deposit: number;
    term: number;
    interest: number;
}

export type InterestRateData = {
    date: string
    rate: number
}

