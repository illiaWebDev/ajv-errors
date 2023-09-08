import type { JSONSchemaType } from 'ajv';
import type { MatchesErrObject, NormalizationMeta, ToNormalizedError } from '../../../types';
import { toNormalizedError as toNormalizedGeneralError } from '../../general';


export const schema = {
  type: 'string',
  format: 'email' as const,
} satisfies JSONSchemaType< string >;


export const matchesErrObject: MatchesErrObject = e => (
  e.keyword === 'format' && e.params.format === schema.format
);

export const violatedConstraint = 'well-known-schemas/email/ajvFormat';
export const defaultUiMessage = 'Invalid email';
export const toNormalizedError: ToNormalizedError = e => (
  matchesErrObject( e )
    ? { violatedConstraint, originalError: e, uiMessage: defaultUiMessage }
    : toNormalizedGeneralError( e )
);

export const normalizationMeta: NormalizationMeta = {
  matchesErrObject,
  toNormalizedError,
};
