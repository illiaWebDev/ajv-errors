import type { ValidateFunction, ErrorObject } from 'ajv';


export type NormlizedAjvErrors = {
  [ dottedPathToProperty: string ]: Array<(
    | {
      type: 'general',
      original: ErrorObject;
    }
  )>;
};
export const normalizeErrors = ( errors?: ValidateFunction< unknown >[ 'errors' ] ): NormlizedAjvErrors => (
  ( errors || [] ).reduce< NormlizedAjvErrors >(
    ( a, e ) => {
      const { instancePath } = e;
      const dottedPath = instancePath.split( '/' ).filter( Boolean ).join( '.' );
      const prevValue = a[ dottedPath ] || [];

      const nextA: typeof a = {
        ...a,
        [ dottedPath ]: prevValue.concat( {
          type: 'general',
          original: e,
        } ),
      };

      return nextA;
    },
    {},
  )
);
