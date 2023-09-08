import type { ValidateFunction } from 'ajv';
import { NormalizeErrorsArg, normalizeErrors } from '../normalizeErrors/main';


export type ToRhfErrShapeArg< T > = {
  validate: ValidateFunction< T >;
  data: T;
  normalizationMetas: NormalizeErrorsArg[ 'normalizationMetas' ];
};

export type RhfErrorsObj = Record< string, { type: 'validation'; message: string; } >;
export type ToRhfErrShapeRtrn = (
  | { valid: true }
  | { valid: false; errors: RhfErrorsObj }
);


export function toRhfErrShape< T >( arg: ToRhfErrShapeArg< T > ): ToRhfErrShapeRtrn {
  const { validate, data, normalizationMetas } = arg;

  const result = validate( data );
  if ( result ) return { valid: true };

  const normalized = normalizeErrors( { errors: validate.errors, normalizationMetas } );
  const rtrn = Object.entries( normalized ).reduce< RhfErrorsObj >(
    ( a, [ path, [ firstErr ] ] ) => ( {
      ...a,
      [ path ]: {
        type: 'validation',
        message: firstErr === undefined ? '' : firstErr.uiMessage,
      },
    } ),
    {},
  );

  return { valid: false, errors: rtrn };
}
