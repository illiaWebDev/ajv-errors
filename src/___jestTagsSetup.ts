/* eslint-disable import/no-extraneous-dependencies */
import { initJestTags } from '@illia-web-dev/jest-tags';

export const { describeWithTags, testWithTags } = initJestTags( process.env );
