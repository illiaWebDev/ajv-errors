import type { JSONSchemaType } from 'ajv';
import type { MatchesErrObject, NormalizationMeta, ToNormalizedError } from '../../../types';
import { toNormalizedError as toNormalizedGeneralError } from '../../general';


export const schema = {
  type: 'string',
  // eslint-disable-next-line max-len
  pattern: "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
} satisfies JSONSchemaType< string >;


export const matchesErrObject: MatchesErrObject = e => (
  e.keyword === 'pattern' && e.params.pattern === schema.pattern
);

export const violatedConstraint = 'well-known-schemas/email/regex';
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
