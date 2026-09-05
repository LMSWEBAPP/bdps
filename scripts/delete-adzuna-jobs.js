const { createClient } = require('@sanity/client');
require('dotenv').config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h7fnmdxo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function deleteAdzunaJobs() {
  console.log('Searching for all Adzuna job postings in Sanity CMS...');

  // Fetch IDs of all job postings that contain adzuna in redirectUrl, adzunaId, or _id
  const query = `*[_type == "jobPosting" && (defined(adzunaId) || _id match "job_adzuna_*" || (defined(redirectUrl) && redirectUrl match "*adzuna*"))]._id`;
  
  try {
    const docsToDelete = await client.fetch(query);
    console.log(`Found ${docsToDelete.length} Adzuna job postings to delete.`);

    if (docsToDelete.length === 0) {
      console.log('No Adzuna jobs found in Sanity CMS. Everything is clean!');
      return;
    }

    const tx = client.transaction();
    for (const id of docsToDelete) {
      console.log(`Marking for deletion: ${id}`);
      tx.delete(id);
    }

    const res = await tx.commit();
    console.log(`✅ Successfully deleted ${docsToDelete.length} Adzuna jobs from Sanity CMS!`, res);
  } catch (err) {
    console.error('❌ Error deleting Adzuna jobs from Sanity:', err);
  }
}

deleteAdzunaJobs();
