import type { JSONSchemaType } from 'ajv';
import type { MatchesErrObject, ToNormalizedError, NormalizationMeta } from '../../types';
import { toNormalizedError as toNormalizedGeneralError } from '../general';


export const schema = {
  type: 'string',
  pattern: '^380\\d{9}$' as const,
} satisfies JSONSchemaType< string >;


export const matchesErrObject: MatchesErrObject = e => (
  e.keyword === 'pattern' && e.params.pattern === schema.pattern
);

export const violatedConstraint = 'well-known-schemas/mobileNumberUA';
export const defaultUiMessage = 'Mobile number must be like 380XXXXXXXXX';
export const toNormalizedError: ToNormalizedError = e => (
  matchesErrObject( e )
    ? { violatedConstraint, originalError: e, uiMessage: defaultUiMessage }
    : toNormalizedGeneralError( e )
);

export const normalizationMeta: NormalizationMeta = {
  matchesErrObject,
  toNormalizedError,
};
