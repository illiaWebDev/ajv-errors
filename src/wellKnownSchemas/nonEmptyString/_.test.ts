// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { expect, test } from '@jest/globals';
import { JSONSchemaType } from 'ajv';
import {
  schema,
  matchesErrObject,
  toNormalizedError,
  violatedConstraint,
  defaultUiMessage,
} from './main';
import { describeWithTags, ajv } from '../../___jestSetup';


const nodes: JestTagsTreeNode = {
  tags: [ 'wellKnownErrors', 'nonEmptyString' ],
  children: [
    { tags: [ 'schema', 'v9GnboCbSe' ] },
    { tags: [ 'matchesErrObject', 'v9GnboCbSe' ] },
    { tags: [ 'toNormalizedError', 'v9GnboCbSe' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );

interface WithString {
  foo: string
}

const schemaForWithString: JSONSchemaType< WithString > = {
  type: 'object',
  properties: { foo: schema },
  required: [ 'foo' ],
  additionalProperties: false,
};

const validate = ajv.compile( schemaForWithString );


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    test( 'rejects incorrect values', () => {
      const incorrectValues: WithString[] = [
        { foo: '' },
        { foo: ' ' },
        { foo: '       ' },
        { foo: '       \t\n     ' },
      ];

      incorrectValues.forEach( incorrectValue => {
        expect( validate( incorrectValue ) ).toBe( false );
      } );
    } );

    test( 'accepts correct values', () => {
      const correctValues: WithString[] = [
        { foo: 'a' },
        { foo: ' a' },
        { foo: '   d    ' },
        { foo: '    k\t \n  ' },
      ];

      correctValues.forEach( value => {
        expect( validate( value ) ).toBe( true );
      } );
    } );
  } );


  describeWithTags( getJestTags( '0.1' ), getJestTags( '0.1', true ).join( ', ' ), () => {
    test( 'succeeds', () => {
      const incorrectValue: WithString = { foo: '    ' };
      expect( validate( incorrectValue ) ).toBe( false );

      const { errors } = validate;
      expect( errors ).toBeTruthy();

      const [ first, ...rest ] = errors as NonNullable< typeof errors >;
      expect( rest.length ).toBe( 0 );

      expect( first ).toBeTruthy();
      const typedFirst = first as NonNullable< typeof first >;

      expect( matchesErrObject( typedFirst ) ).toBe( true );
    } );
  } );

  describeWithTags( getJestTags( '0.2' ), getJestTags( '0.2', true ).join( ', ' ), () => {
    test( 'transforms correctly', () => {
      const incorrectValue: WithString = { foo: '    ' };
      expect( validate( incorrectValue ) ).toBe( false );

      const { errors } = validate;
      expect( errors ).toBeTruthy();

      const [ first, ...rest ] = errors as NonNullable< typeof errors >;
      expect( rest.length ).toBe( 0 );

      expect( first ).toBeTruthy();
      const typedFirst = first as NonNullable< typeof first >;

      const normalized = toNormalizedError( typedFirst );

      expect( normalized.violatedConstraint ).toBe( violatedConstraint );
      expect( normalized.originalError ).toBe( first );
      expect( normalized.uiMessage ).toBe( defaultUiMessage );
    } );
  } );
} );
