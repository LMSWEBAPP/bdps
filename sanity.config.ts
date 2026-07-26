import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './lib/sanity.client';

export default defineConfig({
  name: 'default',
  title: 'BDPS Computers CMS & Lead Dashboard',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
