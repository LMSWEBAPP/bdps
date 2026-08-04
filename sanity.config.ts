import { defineConfig, Tool } from 'sanity';
import { structureTool } from 'sanity/structure';
import { DownloadIcon, RefreshIcon, PublishIcon } from '@sanity/icons';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './lib/sanity.client';
import LeadExportComponent from './sanity/tools/LeadExportComponent';
import JobSyncComponent from './sanity/tools/JobSyncComponent';
import CertificateImportTool from './sanity/tools/CertificateImportTool';

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

const certificateImportTool: Tool = {
  name: 'certificate-import',
  title: 'Import Certificates (CSV)',
  icon: PublishIcon,
  component: CertificateImportTool,
};

export default defineConfig({
  name: 'default',
  title: 'BDPS Computers CMS & Lead Dashboard',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool()],

  tools: (prev) => [...prev, leadExportTool, jobSyncTool, certificateImportTool],

  schema: {
    types: schemaTypes,
  },
});
