import {
  calculateMonthlyPayment,
  calculateYearlyBreakdown,
  validateMortgageInputs,
  calculateMortgageResults
} from './calculateRepayment';

describe('Mortgage Calculator Additional Tests', () => {
  describe('calculateMonthlyPayment edge cases', () => {
    test('should handle minimum deposit', () => {
      const result = calculateMonthlyPayment(300000, 0.01, 3.5, 30);
      expect(result).toBeCloseTo(1347.13, 2);
    });

    test('should handle very high interest rate', () => {
      const result = calculateMonthlyPayment(300000, 60000, 99.9, 30);
      // Should be very high due to interest
      expect(result).toBeGreaterThan(19000);
    });

    test('should handle minimum term', () => {
      const result = calculateMonthlyPayment(300000, 60000, 3.5, 1);
      expect(result).toBeCloseTo(20381.19, 2);
    });
  });

  describe('calculateYearlyBreakdown additional scenarios', () => {
    test('should handle early full repayment scenario', () => {
      // Using a very high monthly payment that would clear the debt quickly
      const breakdown = calculateYearlyBreakdown(300000, 60000, 3.5, 30, 240000);
      expect(breakdown[1].remainingDebt).toBe(0);
    });

    test('should maintain non-negative balance throughout term', () => {
      const breakdown = calculateYearlyBreakdown(300000, 60000, 10, 30, 2000);
      const hasNegativeBalance = breakdown.some(year => year.remainingDebt < 0);
      expect(hasNegativeBalance).toBe(false);
    });
  });

  describe('calculateMortgageResults integration tests', () => {
    test('should calculate all values correctly for typical scenario', () => {
      const inputs = {
        price: 300000,
        deposit: 60000,
        interest: 3.5,
        term: 30
      };

      const results = calculateMortgageResults(inputs);
      expect(results).not.toBeNull();
      if (results) {
        expect(results.monthlyPayment).toBeCloseTo(1077.71, 2);
        expect(results.totalRepayment).toBeCloseTo(387974.61, 2);
        expect(results.capital).toBe(240000);
        expect(results.interest).toBeCloseTo(147974.61, 2);
        expect(results.affordabilityCheck).toBeCloseTo(1516.96, 2);
        // Including initial year
        expect(results.yearlyBreakdown.length).toBe(31); 
      }
    });

    test('should return null for invalid inputs', () => {
      const invalidInputs = {
        price: -300000,
        deposit: 60000,
        interest: 3.5,
        term: 30
      };

      const results = calculateMortgageResults(invalidInputs);
      expect(results).toBeNull();
    });

    test('should handle zero interest rate scenario', () => {
      const inputs = {
        price: 300000,
        deposit: 60000,
        interest: 0,
        term: 30
      };

      const results = calculateMortgageResults(inputs);
      expect(results).not.toBeNull();
      if (results) {
        expect(results.monthlyPayment).toBeCloseTo(666.67, 2);
        expect(results.totalRepayment).toBe(240000);
        // No interest in zero interest rate scenario
        expect(results.interest).toBe(0);
      }
    });
  });

  describe('validateMortgageInputs boundary tests', () => {
    test('should validate maximum allowed term', () => {
      const result = validateMortgageInputs(300000, 60000, 3.5, 40);
      expect(result.isValid).toBe(true);
    });

    test('should validate minimum allowed interest rate', () => {
      const result = validateMortgageInputs(300000, 60000, 0, 30);
      expect(result.isValid).toBe(true);
    });

    test('should validate maximum allowed interest rate', () => {
      const result = validateMortgageInputs(300000, 60000, 100, 30);
      expect(result.isValid).toBe(true);
    });

    test('should validate minimum deposit ratio', () => {
      const result = validateMortgageInputs(300000, 0.01, 3.5, 30);
      expect(result.isValid).toBe(true);
    });
  });
});