import type { ErrorObject } from 'ajv';


export type NormalizedError = {
  violatedConstraint: string;
  originalError: ErrorObject
};
export type NormalizedErrors = {
  [ dottedPath: string ]: NormalizedError[];
};


export type MatchesErrObject = ( e: ErrorObject ) => boolean;
export type ToNormalizedError = ( e: ErrorObject ) => NormalizedError;
export type MatchesNormalizedError = ( e: NormalizedError ) => boolean;

export type MetaForWellKnown = {
  matchesErrObject: MatchesErrObject;
  toNormalizedError: ToNormalizedError;
};
