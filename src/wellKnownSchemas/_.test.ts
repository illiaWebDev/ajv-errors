// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { expect } from '@jest/globals';
import Ajv, { JSONSchemaType } from 'ajv';
import { wellKnownSchemas } from './main';
import { describeWithTags, testWithTags } from '../___jestTagsSetup';


const ajv = new Ajv( { allErrors: true } ); // options can be passed, e.g. {allErrors: true}

const nodes: JestTagsTreeNode = {
  tags: [ 'wellKnownErrors' ],
  children: [
    { tags: [ 'nonEmptyString' ] },
    { tags: [ 'smth' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );


describeWithTags( getJestTags( '0' ), 'well known schemas', () => {
  testWithTags( getJestTags( '0.0', true ), 'nonEmptyString works', () => {
    interface WithString {
      foo: string
    }

    const schema: JSONSchemaType< WithString > = {
      type: 'object',
      properties: {
        foo: wellKnownSchemas.nonEmptyString,
      },
      required: [ 'foo' ],
      additionalProperties: false,
    };

    const validate = ajv.compile( schema );

    // ===================================================================================

    const data1: WithString = { foo: '' };
    expect( validate( data1 ) ).toBe( false );

    const { errors } = validate;
    expect( errors ).toBeTruthy();

    const [ first, ...rest ] = errors as NonNullable< typeof errors >;
    expect( rest.length ).toBe( 0 );
    expect( first ).toBeTruthy();

    const typedFirst = first as NonNullable< typeof first >;
    expect( typedFirst.instancePath ).toBe( '/foo' );

    // ===================================================================================

    const data2: WithString = { foo: '2' };
    expect( validate( data2 ) ).toBe( true );
    expect( validate.errors ).toBe( null );
  } );

  testWithTags( getJestTags( '0.1' ), 'smth', () => {
    expect( 2 ).toBe( 2 );
  } );
} );
