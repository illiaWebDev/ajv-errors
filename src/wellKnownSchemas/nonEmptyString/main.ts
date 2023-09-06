import type { JSONSchemaType } from 'ajv';
import type { MatchesErrObject, MatchesNormalizedError, MetaForWellKnown, ToNormalizedError } from '../../types';
import { toNormalizedError as toNormalizedGeneralError } from '../general';


export const schema = {
  type: 'string',
  pattern: '\\S' as const,
} satisfies JSONSchemaType< string >;


export const matchesErrObject: MatchesErrObject = e => (
  e.keyword === 'pattern' && e.params.pattern === schema.pattern
);

export const violatedConstraint = 'nonEmptyString';
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
