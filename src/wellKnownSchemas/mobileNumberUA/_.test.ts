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
  tags: [ 'wellKnownErrors', 'mobileNumberUA' ],
  children: [
    { tags: [ 'schema', 'EyoMWs5AmI' ] },
    { tags: [ 'matchesErrObject', 'EyoMWs5AmI' ] },
    { tags: [ 'toNormalizedError', 'EyoMWs5AmI' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );

interface WithMobileNumberUA {
  mobileNumberUA: string
}

const schemaForWithString: JSONSchemaType< WithMobileNumberUA > = {
  type: 'object',
  properties: { mobileNumberUA: schema },
  required: [ 'mobileNumberUA' ],
  additionalProperties: false,
};

const validate = ajv.compile( schemaForWithString );
const incorrectValue: WithMobileNumberUA = { mobileNumberUA: '' };

describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    test( 'rejects incorrect values', () => {
      const incorrectValues: WithMobileNumberUA[] = [
        { mobileNumberUA: '' },
        { mobileNumberUA: ' ' },
        { mobileNumberUA: '       ' },
        { mobileNumberUA: '       \t\n     ' },
        { mobileNumberUA: '380qweqwe' },
        { mobileNumberUA: ' 380671234567' },
        { mobileNumberUA: '380671234567 ' },
        { mobileNumberUA: '390671234567' },
      ];

      incorrectValues.forEach( val => {
        expect( validate( val ) ).toBe( false );
      } );
    } );

    test( 'accepts correct values', () => {
      const correctValues: WithMobileNumberUA[] = [
        { mobileNumberUA: '380671234567' },
      ];

      correctValues.forEach( value => {
        expect( validate( value ) ).toBe( true );
      } );
    } );
  } );


  describeWithTags( getJestTags( '0.1' ), getJestTags( '0.1', true ).join( ', ' ), () => {
    test( 'succeeds', () => {
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
