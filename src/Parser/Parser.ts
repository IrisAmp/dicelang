import { IExpression } from '../Common/IExpression';

/**
 * Takes a raw string expression and translates all its parentheses into arrays.
 * @param {string} input
 * @returns {IExpression}
 */
export function parenthesize(input: string, openParenChar = '(', closeParenChar = ')'): IExpression {
  const result: IExpression = [];

  const firstOpenParen = input.indexOf(openParenChar);
  const firstCloseParen = input.indexOf(closeParenChar);

  if (firstOpenParen < 0 && firstCloseParen < 0) {
    // There are no paren
    return [input];
  } else if (firstOpenParen < 0 || firstCloseParen < 0 || firstCloseParen < firstOpenParen) {
    // The paren are unmatched.
    throw new Error(`UNMATCHED PARENTHESIS`);
  }

  // Add the content before the paren
  if (firstOpenParen > 0) {
    result.push(input.slice(0, firstOpenParen));
  }

  // Find the paren that matches the first open paren.
  const parenStack: number[] = [firstOpenParen];
  let matchingParen = firstOpenParen;
  while (parenStack.length > 0 && matchingParen < input.length) {
    ++matchingParen;
    if (input.charAt(matchingParen) === openParenChar) {
      parenStack.push(matchingParen);
    } else if (input.charAt(matchingParen) === closeParenChar) {
      parenStack.pop();
    }
  }

  if (parenStack.length > 0) {
    throw new Error(`UNMATCHED PARENTHESIS`);
  }

  // Recurse into the matched parens.
  result.push(parenthesize(input.slice(firstOpenParen + 1, matchingParen)));

  // Process the remaining part of the input
  if (matchingParen < input.length - 1) {
    result.push(...parenthesize(input.slice(matchingParen + 1)));
  }

  return result;
}

/**
 * Given a string input
 * @param input
 */
export function splitOperators(input: string, operatorMatcher = /[+-*/]/g): IExpression {
  const result: IExpression = [];

  return result;
}
