import { IExpression } from '../Common/IExpression';

/**
 * Takes a raw string expression and translates all its parentheses into arrays.
 * @param {string} input
 * @returns {IExpression}
 */
export function tokenize(input: string): IExpression {
  const result: IExpression = [];

  const firstOpenParen = input.indexOf('(');
  const firstCloseParen = input.indexOf(')');

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
    if (input.charAt(matchingParen) === '(') {
      parenStack.push(matchingParen);
    } else if (input.charAt(matchingParen) === ')') {
      parenStack.pop();
    }
  }

  if (parenStack.length > 0) {
    throw new Error(`UNMATCHED PARENTHESIS`);
  }

  // Recurse into the matched parens.
  result.push(tokenize(input.slice(firstOpenParen + 1, matchingParen)));

  // Process the remaining part of the input
  if (matchingParen < input.length - 1) {
    result.push(...tokenize(input.slice(matchingParen + 1)));
  }

  return result;
}
