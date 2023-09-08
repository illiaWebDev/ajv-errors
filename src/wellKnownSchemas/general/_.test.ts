// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import { expect, test } from '@jest/globals';
import { JSONSchemaType } from 'ajv';
import {
  toNormalizedError,
  violatedConstraint,
} from './main';
import { describeWithTags, ajv } from '../../___jestSetup';


const nodes: JestTagsTreeNode = {
  tags: [ 'wellKnownErrors', 'general' ],
  children: [
    { tags: [ 'toNormalizedError', 'jdv9QXsVNj' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );

interface WithString {
  foo: string
}

const schemaForWithString: JSONSchemaType< WithString > = {
  type: 'object',
  properties: { foo: { type: 'string', minLength: 4 } },
  required: [ 'foo' ],
  additionalProperties: false,
};

const validate = ajv.compile( schemaForWithString );
const incorrectValue: WithString = { foo: '' };

describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  describeWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
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
    } );
  } );
} );
