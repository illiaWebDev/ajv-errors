/* eslint-disable import/no-extraneous-dependencies */
import { initJestTags } from '@illia-web-dev/jest-tags';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';


export const { describeWithTags, testWithTags } = initJestTags( process.env );
export const ajv = new Ajv( { allErrors: true } );
addFormats( ajv );
