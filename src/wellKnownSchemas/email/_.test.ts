// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { test } from '@jest/globals';
// import { JSONSchemaType } from 'ajv';
// import { schema, matchesErrObject, toNormalizedError, violatedConstraint } from './main';
import { describeWithTags } from '../../___jestSetup';


const nodes: JestTagsTreeNode = {
  tags: [ 'wellKnownErrors' ],
  children: [
    { tags: [ 'nonEmptyString' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    test.todo( 'todo' );
    // interface WithString {
    //   foo: string
    // }

    // const schemaForWithString: JSONSchemaType< WithString > = {
    //   type: 'object',
    //   properties: {
    //     foo: schema,
    //   },
    //   required: [ 'foo' ],
    //   additionalProperties: false,
    // };

    // const validate = ajv.compile( schemaForWithString );


    // test( 'rejects incorrect values', () => {
    //   const incorrectValues: WithString[] = [
    //     { foo: '' },
    //     { foo: ' ' },
    //     { foo: '       ' },
    //     { foo: '       \t\n     ' },
    //   ];

    //   incorrectValues.forEach( incorrectValue => {
    //     expect( validate( incorrectValue ) ).toBe( false );
    //   } );
    // } );

    // test( 'accepts correct values', () => {
    //   const correctValues: WithString[] = [
    //     { foo: 'a' },
    //     { foo: ' a' },
    //     { foo: '   d    ' },
    //     { foo: '    k\t \n  ' },
    //   ];

    //   correctValues.forEach( value => {
    //     expect( validate( value ) ).toBe( true );
    //   } );
    // } );

    // test( 'matchesErrObject function succeeds', () => {
    //   const incorrectValue: WithString = { foo: '    ' };
    //   expect( validate( incorrectValue ) ).toBe( false );

    //   const { errors } = validate;
    //   expect( errors ).toBeTruthy();

    //   const [ first, ...rest ] = errors as NonNullable< typeof errors >;
    //   expect( rest.length ).toBe( 0 );

    //   expect( first ).toBeTruthy();
    //   const typedFirst = first as NonNullable< typeof first >;

    //   expect( matchesErrObject( typedFirst ) ).toBe( true );
    // } );

    // test( 'toNormalizedError transforms correctly', () => {
    //   const incorrectValue: WithString = { foo: '    ' };
    //   expect( validate( incorrectValue ) ).toBe( false );

    //   const { errors } = validate;
    //   expect( errors ).toBeTruthy();

    //   const [ first, ...rest ] = errors as NonNullable< typeof errors >;
    //   expect( rest.length ).toBe( 0 );

    //   expect( first ).toBeTruthy();
    //   const typedFirst = first as NonNullable< typeof first >;

    //   const normalized = toNormalizedError( typedFirst );

    //   expect( normalized.violatedConstraint ).toBe( violatedConstraint );
    //   expect( normalized.originalError ).toBe( first );
    // } );
  } );
} );
