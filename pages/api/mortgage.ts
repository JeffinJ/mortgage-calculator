import type { NextApiRequest, NextApiResponse } from 'next';
import {
    calculateAffordabilityCheck,
    calculateMonthlyPayment,
    calculateTotalRepayment,
    calculateYearlyBreakdown,
    validateMortgageInputs
} from '@/utils/MortgageCalculator/calculateRepayment';
import { FullMortgageResults } from '@/types/mortgage';

type MortgageInputs = {
    propertyPrice: number;
    deposit: number;
    annualInterestRate: number;
    termInYears: number;
};

type ErrorResponse = {
    error: string;
    validationErrors?: Record<string, string>;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FullMortgageResults | ErrorResponse>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const inputs = req.body as MortgageInputs;

        // Validate inputs exist
        if (!inputs || typeof inputs !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Convert string inputs to numbers if necessary
        const parsedInputs = {
            propertyPrice: Number(inputs.propertyPrice),
            deposit: Number(inputs.deposit),
            annualInterestRate: Number(inputs.annualInterestRate),
            termInYears: Number(inputs.termInYears),
        };

        // Validate mortgage inputs
        const validation = validateMortgageInputs(
            parsedInputs.propertyPrice,
            parsedInputs.deposit,
            parsedInputs.annualInterestRate,
            parsedInputs.termInYears
        );

        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Validation failed',
                validationErrors: validation.errors
            });
        }

        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(
            parsedInputs.propertyPrice,
            parsedInputs.deposit,
            parsedInputs.annualInterestRate,
            parsedInputs.termInYears
        );

        // Calculate total repayment
        const totalRepayment = calculateTotalRepayment(
            monthlyPayment,
            parsedInputs.termInYears
        );

        // Calculate capital and interest
        const capital = parsedInputs.propertyPrice - parsedInputs.deposit;
        const interest = totalRepayment - capital;

        // Calculate affordability check
        const affordabilityCheck = calculateAffordabilityCheck(
            parsedInputs.propertyPrice,
            parsedInputs.deposit,
            parsedInputs.annualInterestRate,
            parsedInputs.termInYears
        );

        // Calculate yearly breakdown
        const yearlyBreakdown = calculateYearlyBreakdown(
            parsedInputs.propertyPrice,
            parsedInputs.deposit,
            parsedInputs.annualInterestRate,
            parsedInputs.termInYears,
            monthlyPayment
        );

        // Return the results
        return res.status(200).json({
            monthlyPayment,
            totalRepayment,
            capital,
            interest,
            affordabilityCheck,
            yearlyBreakdown
        });
    } catch (error) {
        console.error('Mortgage calculation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}