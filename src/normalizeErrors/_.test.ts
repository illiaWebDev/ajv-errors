// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { expect, test } from '@jest/globals';
import { JSONSchemaType } from 'ajv';
import { normalizeErrors } from './main';
import { describeWithTags, ajv } from '../___jestSetup';
import * as wellKnownSchemasNS from '../wellKnownSchemas';


const nodes: JestTagsTreeNode = {
  tags: [ 'normalizeErrors' ],
  children: [
    { tags: [ 'no errors to normalize', 'Ny0kI80EUE' ] },
    { tags: [ 'fallback to general', 'Ny0kI80EUE' ] },
    { tags: [ 'correctly normalizes real data', 'Ny0kI80EUE' ] },
    { tags: [ 'uiMessage override', 'Ny0kI80EUE' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    test( 'returns empty object when there are no errors to normalize', () => {
      expect( normalizeErrors( { normalizationMetas: [] } ) ).toStrictEqual( {} );
      expect( normalizeErrors( { normalizationMetas: [], errors: null } ) ).toStrictEqual( {} );
      expect( normalizeErrors( { normalizationMetas: [], errors: [] } ) ).toStrictEqual( {} );
    } );
  } );

  describeWithTags( getJestTags( '0.1' ), getJestTags( '0.1', true ).join( ', ' ), () => {
    test( 'falls back to general error if metas array is empty', () => {
      interface Data {
        name: string;
        email: string;
        password: string;
      }

      const schema: JSONSchemaType< Data > = {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 4 },
          email: { type: 'string', minLength: 4 },
          password: { type: 'string', minLength: 4 },
        },
        additionalProperties: false,
        required: [ 'email', 'name', 'password' ],
      };

      const validate = ajv.compile( schema );
      const data: Data = {
        email: '',
        name: '',
        password: '',
      };

      validate( data );

      const { email, name, password } = normalizeErrors( { errors: validate.errors, normalizationMetas: [] } );

      // ===================================================================================

      expect( email ).toBeTruthy();
      const [ emailErr, ...restEmailErrs ] = email as NonNullable< typeof email >;

      expect( restEmailErrs.length ).toBe( 0 );
      expect( emailErr && emailErr.violatedConstraint ).toBe( wellKnownSchemasNS.general.violatedConstraint );

      // ===================================================================================

      expect( name ).toBeTruthy();
      const [ nameErr, ...restNameErrs ] = name as NonNullable< typeof name >;

      expect( restNameErrs.length ).toBe( 0 );
      expect( nameErr && nameErr.violatedConstraint ).toBe( wellKnownSchemasNS.general.violatedConstraint );

      // ===================================================================================

      expect( password ).toBeTruthy();
      const [ passwordErr, ...restPasswordErrs ] = password as NonNullable< typeof password >;

      expect( restPasswordErrs.length ).toBe( 0 );
      expect( passwordErr && passwordErr.violatedConstraint ).toBe( wellKnownSchemasNS.general.violatedConstraint );
    } );
  } );


  describeWithTags( getJestTags( '0.2' ), getJestTags( '0.2', true ).join( ', ' ), () => {
    test( getJestTags( '0.2', true )[ 0 ] || '', () => {
      interface Data {
        name: string;
        email: string;
      }

      const schema: JSONSchemaType< Data > = {
        type: 'object',
        properties: {
          name: wellKnownSchemasNS.nonEmptyString.schema,
          email: wellKnownSchemasNS.email.regex.schema,
        },
        additionalProperties: false,
        required: [ 'email', 'name' ],
      };

      const validate = ajv.compile( schema );
      const data: Data = {
        email: '',
        name: '',
      };

      validate( data );

      const { email, name } = normalizeErrors( {
        errors: validate.errors,
        normalizationMetas: [
          wellKnownSchemasNS.email.regex.normalizationMeta,
          wellKnownSchemasNS.nonEmptyString.normalizationMeta,
        ],
      } );

      // ===================================================================================

      expect( email ).toBeTruthy();
      const [ emailErr, ...restEmailErrs ] = email as NonNullable< typeof email >;

      expect( restEmailErrs.length ).toBe( 0 );
      expect( emailErr && emailErr.violatedConstraint ).toBe( wellKnownSchemasNS.email.regex.violatedConstraint );

      // ===================================================================================

      expect( name ).toBeTruthy();
      const [ nameErr, ...restNameErrs ] = name as NonNullable< typeof name >;

      expect( restNameErrs.length ).toBe( 0 );
      expect( nameErr && nameErr.violatedConstraint ).toBe( wellKnownSchemasNS.nonEmptyString.violatedConstraint );
    } );
  } );

  describeWithTags( getJestTags( '0.3' ), getJestTags( '0.3', true ).join( ', ' ), () => {
    test( 'successfully overrides ui messages', () => {
      interface Data {
        name: string;
        email: string;
      }

      const schema: JSONSchemaType< Data > = {
        type: 'object',
        properties: {
          name: wellKnownSchemasNS.nonEmptyString.schema,
          email: wellKnownSchemasNS.email.regex.schema,
        },
        additionalProperties: false,
        required: [ 'email', 'name' ],
      };

      const validate = ajv.compile( schema );
      const data: Data = {
        email: '',
        name: '',
      };

      validate( data );

      const emailErrMessage = 'ERROR! EMAIL FORMAT IS INVALID';
      const nameErrMessage = 'ERROR! NAME IS REQUIRED';

      const { email, name } = normalizeErrors( {
        errors: validate.errors,
        normalizationMetas: [
          {
            ...wellKnownSchemasNS.email.regex.normalizationMeta,
            toNormalizedError: e => ( {
              ...wellKnownSchemasNS.email.regex.toNormalizedError( e ),
              uiMessage: emailErrMessage,
            } ),
          },
          {
            ...wellKnownSchemasNS.nonEmptyString.normalizationMeta,
            toNormalizedError: e => ( {
              ...wellKnownSchemasNS.nonEmptyString.toNormalizedError( e ),
              uiMessage: nameErrMessage,
            } ),
          },
        ],
      } );

      // ===================================================================================

      expect( email ).toBeTruthy();
      const [ emailErr, ...restEmailErrs ] = email as NonNullable< typeof email >;

      expect( restEmailErrs.length ).toBe( 0 );
      expect( emailErr && emailErr.uiMessage ).toBe( emailErrMessage );

      // ===================================================================================

      expect( name ).toBeTruthy();
      const [ nameErr, ...restNameErrs ] = name as NonNullable< typeof name >;

      expect( restNameErrs.length ).toBe( 0 );
      expect( nameErr && nameErr.uiMessage ).toBe( nameErrMessage );
    } );
  } );
} );
