import type {
  MatchesErrObject,
  ToNormalizedError,
  // MatchesNormalizedErr,
} from '../../types';


export const matchesErrorObject: MatchesErrObject = () => true;

export const violatedConstraint = 'well-known-schemas/general';
export const defaultUiMessage = 'Error';
export const toNormalizedError: ToNormalizedError = e => ( {
  violatedConstraint,
  originalError: e,
  // so this most likely will never fall back to defaultUiMessage
  // but whatever
  uiMessage: e.message || defaultUiMessage,
} );
