import { YearlyBreakdown } from "@/types/mortgage";

/**
 * Calculates the monthly mortgage payment.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The monthly mortgage payment.
 */
export function calculateMonthlyPayment(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  const adjustedLoanAmount = propertyPrice - deposit;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = mortgageTermInYears * 12;

  if (monthlyInterestRate === 0) {
    return adjustedLoanAmount / numberOfPayments;
  }

  const monthlyPayment =
    (adjustedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
}

/**
 * Calculates total repayment over the full mortgage term.
 *
 * @param monthlyPayment - The monthly payment amount.
 * @param termInYears - The mortgage term in years.
 * @returns The total amount repaid over the term.
 */
export function calculateTotalRepayment(
  monthlyPayment: number,
  termInYears: number
): number {
  return monthlyPayment * termInYears * 12;
}

/**
 * Calculates the remaining mortgage balance at the end of each year.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param termInYears - The mortgage term in years.
 * @param monthlyPayment - The monthly payment amount.
 * @returns Array of yearly remaining balances.
 */
export function calculateYearlyBreakdown(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  termInYears: number,
  monthlyPayment: number
): YearlyBreakdown[] {
  const initialLoanAmount = propertyPrice - deposit;
  const monthlyRate = annualInterestRate / 100 / 12;
  let balance = initialLoanAmount;
  const breakdown: YearlyBreakdown[] = [
    { year: 0, remainingDebt: initialLoanAmount }
  ];

  for (let year = 1; year <= termInYears; year++) {
    for (let month = 1; month <= 12; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);
    }
    breakdown.push({
      year,
      remainingDebt: Number(balance.toFixed(2))
    });
  }

  return breakdown;
}

/**
 * Calculates the monthly payment with an increased interest rate for affordability check.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param termInYears - The mortgage term in years.
 * @returns The monthly payment at increased interest rate.
 */
export function calculateAffordabilityCheck(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  termInYears: number
): number {
  const increasedRate = annualInterestRate + 3;
  return calculateMonthlyPayment(
    propertyPrice,
    deposit,
    increasedRate,
    termInYears
  );
}

/**
 * Validates mortgage calculator inputs.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param termInYears - The mortgage term in years.
 * @returns Object containing validation results.
 */
export function validateMortgageInputs(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  termInYears: number
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (propertyPrice <= 0) {
    errors.propertyPrice = 'Property price must be greater than 0';
  }

  if (deposit < 0) {
    errors.deposit = 'Deposit cannot be negative';
  } else if (deposit >= propertyPrice) {
    errors.deposit = 'Deposit must be less than property price';
  }

  if (annualInterestRate < 0 || annualInterestRate > 100) {
    errors.annualInterestRate = 'Interest rate must be between 0 and 100';
  }

  if (termInYears <= 0 || termInYears > 40) {
    errors.termInYears = 'Term must be between 1 and 40 years';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
