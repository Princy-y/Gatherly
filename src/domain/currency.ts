/**
 * Currency conversion utilities for INR minor currency units (paise).
 * 1 INR = 100 paise. All monetary arithmetic in domain is stored as integer paise.
 */

export function rupeesToPaise(rupees: number): number {
  if (isNaN(rupees) || !isFinite(rupees)) {
    throw new Error('Invalid rupee amount: must be a finite number');
  }
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  if (isNaN(paise) || !isFinite(paise)) {
    throw new Error('Invalid paise amount: must be a finite number');
  }
  return paise / 100;
}

export function formatINR(paise: number, includeDecimals = false): string {
  if (isNaN(paise) || !isFinite(paise)) {
    return '₹0';
  }
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(rupees);

  return isNegative ? `-${formatted}` : formatted;
}

export function parseRupeesInput(input: string | number): number {
  if (typeof input === 'number') {
    if (isNaN(input) || input < 0) return 0;
    return rupeesToPaise(input);
  }
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return rupeesToPaise(parsed);
}
