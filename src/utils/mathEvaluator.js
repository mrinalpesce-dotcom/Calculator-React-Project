// Math Evaluator with scientific operations, deg/rad support, and precision handling

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // JS numbers overflow beyond 170!
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Format float to avoid precision artifacts (e.g. 0.1 + 0.2 = 0.3)
 */
export function formatResult(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // Round small precision errors
  const str = Number(num.toPrecision(12)).toString();
  
  // Format with commas if possible
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Converts human readable expression into safe evaluatable JS
 */
export function evaluateExpression(expr, angleMode = 'deg') {
  if (!expr || expr.trim() === '') return { result: 0, formatted: '0', error: null };

  try {
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e/g, `(${Math.E})`);

    // Handle factorial: replace number! with factorial(number)
    sanitized = sanitized.replace(/(\d+(?:\.\d+)?|\([^\(\)]+\))!/g, (match, p1) => {
      return `__fact(${p1})`;
    });

    // Handle square root: √(x) or √x
    sanitized = sanitized.replace(/√\s*(\d+(?:\.\d+)?|\([^\(\)]+\))/g, 'Math.sqrt($1)');

    // Handle powers: x^y -> Math.pow(x, y)
    sanitized = sanitized.replace(/(\d+(?:\.\d+)?|\([^\(\)]+\))\^(\d+(?:\.\d+)?|\([^\(\)]+\))/g, 'Math.pow($1,$2)');

    // Handle trigonometric functions (deg or rad)
    if (angleMode === 'deg') {
      const toRad = `*(Math.PI/180)`;
      sanitized = sanitized.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${toRad})`);
      sanitized = sanitized.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${toRad})`);
      sanitized = sanitized.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${toRad})`);
    } else {
      sanitized = sanitized.replace(/sin\(([^)]+)\)/g, `Math.sin($1)`);
      sanitized = sanitized.replace(/cos\(([^)]+)\)/g, `Math.cos($1)`);
      sanitized = sanitized.replace(/tan\(([^)]+)\)/g, `Math.tan($1)`);
    }

    // Handle logarithms
    sanitized = sanitized.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
    sanitized = sanitized.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');

    // Handle percentage: e.g. 50% => (50/100)
    sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

    // Auto-balance unclosed parentheses
    const openParens = (sanitized.match(/\(/g) || []).length;
    const closeParens = (sanitized.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      sanitized += ')'.repeat(openParens - closeParens);
    }

    // Security check: only allow digits, Math functions, operators, dots, parens, whitespace
    const allowed = /^[0-9+\-*/().,MathsincotanlgqrwEPIe_\s]+$/;
    if (!allowed.test(sanitized)) {
      throw new Error('Invalid characters');
    }

    // Evaluate in safe isolated scope
    const evalFn = new Function('__fact', `"use strict"; return (${sanitized});`);
    const rawVal = evalFn(factorial);

    if (rawVal === undefined || rawVal === null || isNaN(rawVal)) {
      return { result: null, formatted: 'Error', error: 'Invalid calculation' };
    }

    // Round subtle trig errors (e.g. sin(180) = 0 instead of 1.22e-16)
    let cleanedVal = rawVal;
    if (Math.abs(cleanedVal) < 1e-12) cleanedVal = 0;

    return {
      result: cleanedVal,
      formatted: formatResult(cleanedVal),
      error: null
    };
  } catch (err) {
    return {
      result: null,
      formatted: null,
      error: err.message || 'Error'
    };
  }
}
