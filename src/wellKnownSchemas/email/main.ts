import type { JSONSchemaType } from 'ajv';
import type { MatchesErrObject, MatchesNormalizedError, MetaForWellKnown, ToNormalizedError } from '../../types';
import { toNormalizedError as toNormalizedGeneralError } from '../general';


export const schema = {
  type: 'string',
  format: 'email' as const,
} satisfies JSONSchemaType< string >;


export const matchesErrObject: MatchesErrObject = e => (
  e.keyword === 'format' && e.params.format === schema.format
);

export const violatedConstraint = 'email';
export const toNormalizedError: ToNormalizedError = e => (
  matchesErrObject( e )
    ? { violatedConstraint, originalError: e }
    : toNormalizedGeneralError( e )
);

export const matchesNormalizedError: MatchesNormalizedError = e => (
  e.violatedConstraint === violatedConstraint
);

export const metaForWellKnown: MetaForWellKnown = {
  matchesErrObject,
  toNormalizedError,
};
