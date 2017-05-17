export declare type ComparePoint = '<' | '=' | '>';

export interface ISuccessesProps {
  cp: ComparePoint;
  n: number;
}

export interface IFailuresProps {
  cp: ComparePoint;
  n: number;
}

export interface ISuccessFailProps extends ISuccessesProps {
  f?: IFailuresProps;
}

export interface IExplodingProps {
  cp: ComparePoint;
  n: number;
}

export interface ICompoundingProps {
  cp: ComparePoint;
  n: number;
}

export interface IPenetratingProps {
  cp: ComparePoint;
  n: number;
}

export interface IKeepDropProps {
  kd: 'k' | 'd';
  lh: 'l' | 'h';
  n: number;
}

export interface IRerollProps {
  cp: ComparePoint;
  o: boolean;
  n: number;
};

export interface ISortProps {
  ad: 'a' | 'd';
};
