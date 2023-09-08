// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { expect, test } from '@jest/globals';
import { JSONSchemaType } from 'ajv';
import { toRhfErrShape } from './main';
import { describeWithTags, ajv } from '../___jestSetup';
import * as wellKnownSchemasNS from '../wellKnownSchemas';


const nodes: JestTagsTreeNode = {
  tags: [ 'toRhfErrShape' ],
  children: [
    { tags: [ 'transforms correctly', 'NYhD0qfwsT' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    test( getJestTags( '0.0', true )[ 0 ] || '', () => {
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


      const rhfShapeResp = toRhfErrShape( {
        validate,
        data,
        normalizationMetas: [
          wellKnownSchemasNS.email.regex.normalizationMeta,
          wellKnownSchemasNS.nonEmptyString.normalizationMeta,
        ],
      } );


      expect( rhfShapeResp.valid ).toBe( false );

      const { errors } = rhfShapeResp as Extract< typeof rhfShapeResp, { valid: false } >;
      expect( Object.keys( errors ).length ).toBe( 2 );


      const { email, name } = errors;

      // ===================================================================================

      expect( email ).toBeTruthy();
      const typedEmail = email as NonNullable< typeof email >;

      expect( typedEmail.type ).toBe( 'validation' );
      expect( typedEmail.message ).toBe( wellKnownSchemasNS.email.regex.defaultUiMessage );

      // ===================================================================================

      expect( name ).toBeTruthy();
      const typedName = name as NonNullable< typeof name >;

      expect( typedName.type ).toBe( 'validation' );
      expect( typedName.message ).toBe( wellKnownSchemasNS.nonEmptyString.defaultUiMessage );
    } );
  } );
} );
