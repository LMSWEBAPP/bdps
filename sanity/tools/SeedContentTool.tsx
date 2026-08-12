import React, { useState } from 'react';
import { Card, Heading, Text, Button, Stack, Container, Flex, Spinner } from '@sanity/ui';
import { SparklesIcon, CheckmarkIcon, RefreshIcon } from '@sanity/icons';

export default function SeedContentTool() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/seed-content', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setStatusMsg('Successfully populated Global Site Settings, Home Page, About Us Page, Contact Us Page, and Testimonials into Sanity Studio!');
      } else {
        setErrorMsg(data.error || 'Failed to populate content.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding={5} height="fill" tone="inherit">
      <Container width={2}>
        <Card padding={4} radius={3} shadow={2} border>
          <Stack space={4}>
            <Heading size={3}>✨ Initialize & Pre-Fill Website Page Content</Heading>
            <Text size={2} muted>
              One-click population tool to populate all existing website content (Global Site Settings, Header & Navbar, Footer, Home Page sections, About Us narrative, 4 stats counters, 3 core beliefs, Contact branches, map embed, and Testimonials) into your Sanity CMS documents so they are ready for instant editing.
            </Text>

            <Stack space={3} style={{ marginTop: '20px' }}>
              <Card padding={4} radius={2} tone="primary" border>
                <Stack space={4}>
                  <Flex align="center" justify="space-between">
                    <Stack space={2}>
                      <Text weight="bold" size={3}>Pre-Fill All Global & Page Documents</Text>
                      <Text size={1} muted>
                        Seeds <strong>Global Site Settings</strong>, <strong>Home Page</strong>, <strong>About Us Page</strong>, <strong>Contact Us Page</strong>, and <strong>Testimonials</strong>.
                      </Text>
                    </Stack>
                    <Button
                      icon={SparklesIcon}
                      text={loading ? 'Populating...' : 'Populate Content Now'}
                      tone="primary"
                      padding={3}
                      disabled={loading}
                      onClick={handleSeed}
                    />
                  </Flex>

                  {loading && (
                    <Flex align="center" gap={2}>
                      <Spinner />
                      <Text size={2}>Writing initial content into Sanity dataset...</Text>
                    </Flex>
                  )}

                  {statusMsg && (
                    <Card padding={4} radius={2} tone="positive">
                      <Stack space={3}>
                        <Flex align="center" gap={2}>
                          <CheckmarkIcon />
                          <Text weight="bold" size={2}>✅ {statusMsg}</Text>
                        </Flex>
                        <Text size={1} muted>
                          Click the button below to reload the Studio and inspect the freshly populated documents in the left sidebar.
                        </Text>
                        <Button
                          icon={RefreshIcon}
                          text="Reload Studio Tab"
                          tone="positive"
                          padding={2}
                          onClick={() => window.location.reload()}
                        />
                      </Stack>
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
