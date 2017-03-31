
/**
 * Simple composite pattern interface.
 */
// tslint:disable-next-line:no-empty-interface
export interface IExpression extends Array<IExpression | string> {
}
