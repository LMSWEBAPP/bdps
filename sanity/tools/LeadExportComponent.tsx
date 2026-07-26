import React from 'react';
import { Card, Heading, Text, Button, Stack, Container, Flex } from '@sanity/ui';
import { DownloadIcon } from '@sanity/icons';

export default function LeadExportComponent() {
  const handleDownload = (type: 'leads' | 'stipends') => {
    window.open(`/api/export-leads?type=${type}`, '_blank');
  };

  return (
    <Card padding={5} height="fill" tone="inherit">
      <Container width={2}>
        <Card padding={4} radius={3} shadow={2} border>
          <Stack space={4}>
            <Heading size={3}>📥 BDPS Leads & Applications Exporter</Heading>
            <Text size={2} muted>
              Export student inquiries, corporate collaboration leads, and stipend registration applications directly into Excel-compatible CSV files.
            </Text>

            <Stack space={3} style={{ marginTop: '20px' }}>
              <Card padding={4} radius={2} tone="primary" border>
                <Flex align="center" justify="space-between">
                  <Stack space={2}>
                    <Text weight="bold" size={3}>Visitor Lead Inquiries</Text>
                    <Text size={1} muted>General inquiries, course interests & corporate contact submissions.</Text>
                  </Stack>
                  <Button
                    icon={DownloadIcon}
                    text="Download Visitor Leads (.CSV)"
                    tone="primary"
                    padding={3}
                    onClick={() => handleDownload('leads')}
                  />
                </Flex>
              </Card>

              <Card padding={4} radius={2} tone="positive" border>
                <Flex align="center" justify="space-between">
                  <Stack space={2}>
                    <Text weight="bold" size={3}>Stipend & Scholarship Registrations</Text>
                    <Text size={1} muted>Student applications for stipend programs and EHF skill training intake.</Text>
                  </Stack>
                  <Button
                    icon={DownloadIcon}
                    text="Download Stipend Applications (.CSV)"
                    tone="positive"
                    padding={3}
                    onClick={() => handleDownload('stipends')}
                  />
                </Flex>
              </Card>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Card>
  );
}
