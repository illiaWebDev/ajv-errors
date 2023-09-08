import type { ErrorObject } from 'ajv';


export type NormalizedError = {
  violatedConstraint: string;
  uiMessage: string;
  originalError: ErrorObject;
};
export type NormalizedErrors = {
  [ dottedPath: string ]: NormalizedError[];
};

// ===================================================================================


export type MatchesErrObject = ( e: ErrorObject ) => boolean;
export type ToNormalizedError = ( e: ErrorObject ) => NormalizedError;

export type NormalizationMeta = {
  matchesErrObject: MatchesErrObject;
  toNormalizedError: ToNormalizedError;
};

// do we even need this? and for what use cases?
// export type MatchesNormalizedErr = ( e: NormalizedError ) => boolean;
