import { defineConfig, Tool } from 'sanity';
import { structureTool } from 'sanity/structure';
import { DownloadIcon } from '@sanity/icons';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './lib/sanity.client';
import LeadExportComponent from './sanity/tools/LeadExportComponent';

const leadExportTool: Tool = {
  name: 'lead-export',
  title: 'Export Leads (CSV)',
  icon: DownloadIcon,
  component: LeadExportComponent,
};

export default defineConfig({
  name: 'default',
  title: 'BDPS Computers CMS & Lead Dashboard',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool()],

  tools: (prev) => [...prev, leadExportTool],

  schema: {
    types: schemaTypes,
  },
});
