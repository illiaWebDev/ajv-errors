import type { ValidateFunction } from 'ajv';
import type { NormalizedErrors, MetaForWellKnown } from '../types';
import * as wellKnownGeneral from '../wellKnownSchemas/general/main';


export type NormalizeErrorsArg = {
  errors?: ValidateFunction[ 'errors' ];
  metasForWellKnown: MetaForWellKnown[];
};


export const normalizeErrors = ( arg: NormalizeErrorsArg ): NormalizedErrors => {
  const { errors, metasForWellKnown } = arg;

  if ( errors === null || errors === undefined || errors.length === 0 ) return {};

  return errors.reduce< NormalizedErrors >(
    ( a, e ) => {
      const key = e.instancePath.split( '/' ).filter( Boolean ).join( '.' );

      const matchedMeta = metasForWellKnown.find( it => it.matchesErrObject( e ) );
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
