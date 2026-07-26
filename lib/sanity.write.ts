import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from './sanity.client';

const token = process.env.SANITY_WRITE_TOKEN;

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
