import { describe, it, expect } from 'vitest';
import { rupeesToPaise, paiseToRupees, formatINR, parseRupeesInput } from '../currency';

describe('Currency & Minor Units Handling (INR)', () => {
  it('correctly converts rupees to integer paise', () => {
    expect(rupeesToPaise(100)).toBe(10000);
    expect(rupeesToPaise(49.99)).toBe(4999);
    expect(rupeesToPaise(0)).toBe(0);
    expect(rupeesToPaise(150000)).toBe(15000000);
  });

  it('correctly converts paise back to rupees', () => {
    expect(paiseToRupees(10000)).toBe(100);
    expect(paiseToRupees(4999)).toBe(49.99);
    expect(paiseToRupees(0)).toBe(0);
  });

  it('formats INR strings accurately with Indian numbering format', () => {
    // 1 Lakh rupees = 10,000,000 paise
    const formattedLakh = formatINR(10000000);
    expect(formattedLakh).toContain('1,00,000');

    // Zero
    expect(formatINR(0)).toContain('0');

    // Negative overrun
    const formattedNegative = formatINR(-50000);
    expect(formattedNegative).toContain('-');
    expect(formattedNegative).toContain('500');
  });

  it('safely parses user input strings into paise', () => {
    expect(parseRupeesInput('₹50,000')).toBe(5000000);
    expect(parseRupeesInput(' 1,200.50 ')).toBe(120050);
    expect(parseRupeesInput('invalid')).toBe(0);
    expect(parseRupeesInput('')).toBe(0);
    expect(parseRupeesInput(-100)).toBe(0);
  });

  it('handles edge case numbers and invalid values safely', () => {
    expect(() => rupeesToPaise(NaN)).toThrow('Invalid rupee amount');
    expect(() => rupeesToPaise(Infinity)).toThrow('Invalid rupee amount');
    expect(() => paiseToRupees(NaN)).toThrow('Invalid paise amount');
    expect(() => paiseToRupees(Infinity)).toThrow('Invalid paise amount');
    expect(formatINR(NaN)).toBe('₹0');
    expect(formatINR(Infinity)).toBe('₹0');
  });
});
