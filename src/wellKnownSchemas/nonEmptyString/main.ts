import type { JSONSchemaType } from 'ajv';
import type { MatchesErrObject, ToNormalizedError, NormalizationMeta } from '../../types';
import { toNormalizedError as toNormalizedGeneralError } from '../general';


export const schema = {
  type: 'string',
  pattern: '\\S' as const,
} satisfies JSONSchemaType< string >;


export const matchesErrObject: MatchesErrObject = e => (
  e.keyword === 'pattern' && e.params.pattern === schema.pattern
);

export const violatedConstraint = 'well-known-schemas/nonEmptyString';
export const defaultUiMessage = 'Required';
export const toNormalizedError: ToNormalizedError = e => (
  matchesErrObject( e )
    ? { violatedConstraint, originalError: e, uiMessage: 'Required' }
    : toNormalizedGeneralError( e )
);

export const normalizationMeta: NormalizationMeta = {
  matchesErrObject,
  toNormalizedError,
};
