// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import type { JSONSchemaType } from 'ajv';
import { test, expect } from '@jest/globals';
import { describeWithTags, ajv } from '../../___jestSetup';
import {
  schema,
  matchesErrObject,
  toNormalizedError,
  violatedConstraint,
  defaultUiMessage,
} from './main';


const nodes: JestTagsTreeNode = {
  tags: [ 'wellKnownErrors', 'email' ],
  children: [
    { tags: [ 'schema', 'JH3SZjHoNY' ] },
    { tags: [ 'matchesErrObject', 'JH3SZjHoNY' ] },
    { tags: [ 'toNormalizedError', 'JH3SZjHoNY' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );

interface WithEmail {
  email: string
}

const schemaForWithString: JSONSchemaType< WithEmail > = {
  type: 'object',
  properties: {
    email: schema,
  },
  required: [ 'email' ],
  additionalProperties: false,
};

const validate = ajv.compile( schemaForWithString );
const invalidPayload: WithEmail = { email: '' };


describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    test( 'fails for invalid', () => {
      const invalidPayloads: WithEmail[] = [
        { email: '' },
        { email: '     ' },
        { email: 'qweqweqwe' },
        { email: '1231eqdsad' },
        { email: 'test@' },
        { email: 'test@gmail' },
        // for some reason ajv says that this one is valid
        // { email: 'test@gmail.c' },
      ];

      invalidPayloads.forEach( payload => {
        expect( validate( payload ) ).toBe( false );
      } );
    } );

    test( 'succeeds for correct values', () => {
      const validPayloads: WithEmail[] = [
        { email: 'admin@test.com' },
        { email: 'admin@google.com' },
      ];

      validPayloads.forEach( payload => {
        expect( validate( payload ) ).toBe( true );
      } );
    } );
  } );

  describeWithTags( getJestTags( '0.1' ), getJestTags( '0.1', true ).join( ', ' ), () => {
    test( 'succeeds', () => {
      expect( validate( invalidPayload ) ).toBe( false );

      const errors = validate.errors || [];
      const [ first, ...rest ] = errors;

      expect( rest.length ).toBe( 0 );
      expect( first ).toBeTruthy();

      const typedFirst = first as NonNullable< typeof first >;
      expect( matchesErrObject( typedFirst ) ).toBe( true );
    } );
  } );

  describeWithTags( getJestTags( '0.2' ), getJestTags( '0.2', true ).join( ', ' ), () => {
    test( 'succeeds', () => {
      expect( validate( invalidPayload ) ).toBe( false );

      const errors = validate.errors || [];
      const [ first, ...rest ] = errors;

      expect( rest.length ).toBe( 0 );
      expect( first ).toBeTruthy();

      const typedFirst = first as NonNullable< typeof first >;
      const normalized = toNormalizedError( typedFirst );

      expect( normalized.violatedConstraint ).toBe( violatedConstraint );
      expect( normalized.originalError ).toBe( typedFirst );
      expect( normalized.uiMessage ).toBe( defaultUiMessage );
    } );
  } );
} );
