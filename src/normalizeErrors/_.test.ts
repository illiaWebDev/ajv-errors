// eslint-disable-next-line import/no-extraneous-dependencies
import { JestTagsTreeNode, deriveGetJestTags } from '@illia-web-dev/jest-tags';
import Ajv, { JSONSchemaType } from 'ajv';
import { normalizeErrors } from './main';
import { describeWithTags, testWithTags } from '../___jestTagsSetup';


const ajv = new Ajv( { allErrors: true } ); // options can be passed, e.g. {allErrors: true}

interface MyData {
  bar: string
}

const schema: JSONSchemaType< MyData > = {
  type: 'object',
  properties: {
    bar: { type: 'string', minLength: 2 },
  },
  required: [ 'bar' ],
  additionalProperties: false,
};

const validate = ajv.compile( schema );

const nodes: JestTagsTreeNode = {
  tags: [ 'normalizeErrors' ],
  children: [
    { tags: [ 'normalizeErrorsWorks' ] },
  ],
};
const getJestTags = deriveGetJestTags( nodes );

describeWithTags( getJestTags( '0' ), getJestTags( '0', true ).join( ', ' ), () => {
  testWithTags( getJestTags( '0.0' ), getJestTags( '0.0', true ).join( ', ' ), () => {
    const data: MyData = { bar: '' };

    validate( data );
    const normalizedErrors = normalizeErrors( validate.errors );

    // eslint-disable-next-line no-void, no-console
    console.info( JSON.stringify( normalizedErrors, null, 2 ) );
    // if ( normalizedErrors.length ) console.log( normalizedErrors );
  } );
} );
