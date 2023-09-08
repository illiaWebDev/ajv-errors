import type { ValidateFunction } from 'ajv';
import type { NormalizedErrors, NormalizationMeta } from '../types';
import * as wellKnownGeneral from '../wellKnownSchemas/general/main';


export type NormalizeErrorsArg = {
  errors?: ValidateFunction[ 'errors' ];
  normalizationMetas: NormalizationMeta[];
};


export const normalizeErrors = ( arg: NormalizeErrorsArg ): NormalizedErrors => {
  const { errors, normalizationMetas } = arg;

  if ( errors === null || errors === undefined || errors.length === 0 ) return {};

  return errors.reduce< NormalizedErrors >(
    ( a, e ) => {
      const key = e.instancePath.split( '/' ).filter( Boolean ).join( '.' );

      const matchedMeta = normalizationMetas.find( it => it.matchesErrObject( e ) );
      const normalized = matchedMeta === undefined
        ? wellKnownGeneral.toNormalizedError( e )
        : matchedMeta.toNormalizedError( e );

      return {
        ...a,
        [ key ]: ( a[ key ] || [] ).concat( normalized ),
      };
    },
    {},
  );
};
