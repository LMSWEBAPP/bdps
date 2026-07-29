import { defineConfig, Tool } from 'sanity';
import { structureTool } from 'sanity/structure';
import { DownloadIcon, RefreshIcon } from '@sanity/icons';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './lib/sanity.client';
import LeadExportComponent from './sanity/tools/LeadExportComponent';
import JobSyncComponent from './sanity/tools/JobSyncComponent';

const leadExportTool: Tool = {
  name: 'lead-export',
  title: 'Export Leads (CSV)',
  icon: DownloadIcon,
  component: LeadExportComponent,
};

const jobSyncTool: Tool = {
  name: 'job-sync',
  title: 'Sync Indian Jobs',
  icon: RefreshIcon,
  component: JobSyncComponent,
};

export default defineConfig({
  name: 'default',
  title: 'BDPS Computers CMS & Lead Dashboard',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool()],

  tools: (prev) => [...prev, leadExportTool, jobSyncTool],

  schema: {
    types: schemaTypes,
  },
});
