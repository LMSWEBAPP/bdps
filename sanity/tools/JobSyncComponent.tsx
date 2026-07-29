import React, { useState } from 'react';
import { Card, Heading, Text, Button, Stack, Container, Flex, Spinner, Badge } from '@sanity/ui';
import { RefreshIcon } from '@sanity/icons';

export default function JobSyncComponent() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/jobs/sync', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setStatusMsg(`Successfully synced ${data.syncedCount || 50} fresh Indian job vacancies into Sanity CMS!`);
      } else {
        setErrorMsg(data.error || 'Failed to sync jobs from Adzuna API.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error while triggering job sync.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding={5} height="fill" tone="inherit">
      <Container width={2}>
        <Card padding={4} radius={3} shadow={2} border>
          <Stack space={4}>
            <Heading size={3}>💼 Adzuna Indian Jobs One-Click Sync</Heading>
            <Text size={2} muted>
              Fetch the latest IT, Software, Tally Accounting, and Computer Operations job vacancies from India via Adzuna API and update the BDPS job portal database in Sanity CMS.
            </Text>

            <Stack space={3} style={{ marginTop: '20px' }}>
              <Card padding={4} radius={2} tone="primary" border>
                <Stack space={4}>
                  <Flex align="center" justify="space-between">
                    <Stack space={2}>
                      <Text weight="bold" size={3}>Fetch & Update Latest Jobs (India)</Text>
                      <Text size={1} muted>Fetches top 50 active job postings sorted by newest date.</Text>
                    </Stack>
                    <Button
                      icon={RefreshIcon}
                      text={loading ? 'Syncing...' : 'Sync Indian Jobs Now'}
                      tone="primary"
                      padding={3}
                      disabled={loading}
                      onClick={handleSync}
                    />
                  </Flex>

                  {loading && (
                    <Flex align="center" gap={2}>
                      <Spinner />
                      <Text size={2}>Connecting to Adzuna API & updating Sanity documents...</Text>
                    </Flex>
                  )}

                  {statusMsg && (
                    <Card padding={3} radius={2} tone="positive">
                      <Text weight="bold" size={2}>✅ {statusMsg}</Text>
                    </Card>
                  )}

                  {errorMsg && (
                    <Card padding={3} radius={2} tone="critical">
                      <Text weight="bold" size={2}>❌ {errorMsg}</Text>
                    </Card>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Card>
  );
}
