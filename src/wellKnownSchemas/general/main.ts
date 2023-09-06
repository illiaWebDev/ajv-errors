import type { MatchesErrObject, ToNormalizedError, MatchesNormalizedError } from '../../types';


export const matchesErrorObject: MatchesErrObject = () => true;

export const violatedConstraint = 'general';
export const toNormalizedError: ToNormalizedError = e => ( {
  violatedConstraint,
  originalError: e,
} );
export const matchesNormalizedError: MatchesNormalizedError = e => (
  e.violatedConstraint === violatedConstraint
);
