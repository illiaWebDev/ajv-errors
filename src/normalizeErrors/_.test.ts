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
    { tags: [ 'WithSingleField' ] },
    { tags: [ 'WithTwoFields' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    interface WithSingleField {
      foo: string
    }

    const schemaForWithString: JSONSchemaType< WithSingleField > = {
      type: 'object',
      properties: {
        foo: wellKnownSchemasNS.nonEmptyString.schema,
      },
      required: [ 'foo' ],
      additionalProperties: false,
    };

    const validate = ajv.compile( schemaForWithString );

    const invalidData: WithSingleField = { foo: '' };

    validate( invalidData );
    const { errors } = validate;


    test( 'default error message', () => {
      const normalized = normalizeErrors( {
        errors,
        normalizetionMetas: [
          wellKnownSchemasNS.nonEmptyString.normalizationMeta,
        ],
      } );
      expect( Object.keys( normalized ).length ).toBe( 1 );

      const { foo } = normalized;

      expect( Array.isArray( foo ) ).toBe( true );

      const [ first, ...rest ] = foo as NonNullable< typeof foo >;
      expect( rest.length ).toBe( 0 );

      expect( first && first.violatedConstraint ).toBe( wellKnownSchemasNS.nonEmptyString.violatedConstraint );
      expect( first && first.uiMessage ).toBe( wellKnownSchemasNS.nonEmptyString.defaultUiMessage );
    } );

    test( 'augmented error message', () => {
      const augmentedErrMessage = 'This field cannot be empty';

      const normalized = normalizeErrors( {
        errors,
        normalizetionMetas: [
          {
            ...wellKnownSchemasNS.nonEmptyString.normalizationMeta,
            toNormalizedError: e => (
              wellKnownSchemasNS.nonEmptyString.matchesErrObject( e )
                ? {
                  ...wellKnownSchemasNS.nonEmptyString.toNormalizedError( e ),
                  uiMessage: augmentedErrMessage,
                }
                : wellKnownSchemasNS.nonEmptyString.toNormalizedError( e )
            ),
          },
        ],
      } );
      expect( Object.keys( normalized ).length ).toBe( 1 );

      const { foo } = normalized;

      expect( Array.isArray( foo ) ).toBe( true );

      const [ first, ...rest ] = foo as NonNullable< typeof foo >;
      expect( rest.length ).toBe( 0 );

      expect( first && first.violatedConstraint ).toBe( wellKnownSchemasNS.nonEmptyString.violatedConstraint );
      expect( first && first.uiMessage ).toBe( augmentedErrMessage );
    } );
  } );

  describeWithTags( getJestTags( '0.1' ), getJestTags( '0.1', true ).join( ', ' ), () => {
    test( 'WithTwoFields', () => {
      interface WithTwoFields {
        email: string;
        password: string;
      }

      const schemaForWithString: JSONSchemaType< WithTwoFields > = {
        type: 'object',
        properties: {
          email: wellKnownSchemasNS.email.ajvFormat.schema,
          password: wellKnownSchemasNS.nonEmptyString.schema,
        },
        required: [ 'email', 'password' ],
        additionalProperties: false,
      };

      const validate = ajv.compile( schemaForWithString );

      const invalidData: WithTwoFields = { email: '', password: '' };

      validate( invalidData );
      const { errors } = validate;

      // eslint-disable-next-line no-console
      console.log( normalizeErrors( {
        errors,
        normalizetionMetas: [
          wellKnownSchemasNS.nonEmptyString.normalizationMeta,
          wellKnownSchemasNS.email.ajvFormat.normalizationMeta,
        ],
      } ) );

      expect( 2 ).toBe( 2 );
    } );
  } );
} );
