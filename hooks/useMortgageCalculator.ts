import { FullMortgageResults } from '@/types/mortgage';
import {
    calculateAffordabilityCheck,
    calculateMonthlyPayment,
    calculateTotalRepayment,
    calculateYearlyBreakdown,
    validateMortgageInputs
} from '@/utils/MortgageCalculator/calculateRepayment';
import { useState, useCallback } from 'react';


interface MortgageInputs {
    propertyPrice: number;
    deposit: number;
    annualInterestRate: number;
    termInYears: number;
}

interface MortgageErrors {
    propertyPrice?: string;
    deposit?: string;
    annualInterestRate?: string;
    termInYears?: string;
}

export function useMortgageCalculator() {
    const [results, setResults] = useState<FullMortgageResults | null>(null);
    const [errors, setErrors] = useState<MortgageErrors>({});

    /**
     * Calculates mortgage details based on input values
     */
    const calculateMortgage = useCallback((inputs: MortgageInputs) => {
        const validation = validateMortgageInputs(
            inputs.propertyPrice,
            inputs.deposit,
            inputs.annualInterestRate,
            inputs.termInYears
        );

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setErrors({});

        const monthlyPayment = calculateMonthlyPayment(
            inputs.propertyPrice,
            inputs.deposit,
            inputs.annualInterestRate,
            inputs.termInYears
        );

        const totalRepayment = calculateTotalRepayment(
            monthlyPayment,
            inputs.termInYears
        );

        const capital = inputs.propertyPrice - inputs.deposit;
        const interest = totalRepayment - capital;

        const affordabilityCheck = calculateAffordabilityCheck(
            inputs.propertyPrice,
            inputs.deposit,
            inputs.annualInterestRate,
            inputs.termInYears
        );

        const yearlyBreakdown = calculateYearlyBreakdown(
            inputs.propertyPrice,
            inputs.deposit,
            inputs.annualInterestRate,
            inputs.termInYears,
            monthlyPayment
        );

        setResults({
            monthlyPayment,
            totalRepayment,
            capital,
            interest,
            affordabilityCheck,
            yearlyBreakdown
        });
    }, []);

    return {
        results,
        errors,
        calculateMortgage,
    };
}