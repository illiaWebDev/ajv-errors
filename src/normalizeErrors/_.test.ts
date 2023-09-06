// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { expect, test } from '@jest/globals';
import { JSONSchemaType } from 'ajv';
import { normalizeErrors } from './main';
import { describeWithTags, ajv } from '../___jestSetup';
import * as wellKnownSchemasNS from '../wellKnownSchemas';


const nodes: JestTagsTreeNode = {
  tags: [ 'normalizeErrors' ],
};
const getJestTags = deriveGetJestTags( nodes );


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  test( 'WithSingleField', () => {
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

    // eslint-disable-next-line no-console
    console.log( normalizeErrors( {
      errors,
      metasForWellKnown: [
        wellKnownSchemasNS.nonEmptyString.metaForWellKnown,
      ],
    } ) );

    expect( 2 ).toBe( 2 );
  } );

  test( 'WithTwoFields', () => {
    interface WithTwoFields {
      email: string;
      password: string;
    }

    const schemaForWithString: JSONSchemaType< WithTwoFields > = {
      type: 'object',
      properties: {
        email: wellKnownSchemasNS.email.schema,
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
      metasForWellKnown: [
        wellKnownSchemasNS.nonEmptyString.metaForWellKnown,
        wellKnownSchemasNS.email.metaForWellKnown,
      ],
    } ) );

    expect( 2 ).toBe( 2 );
  } );
} );
