import React, { useState, useEffect } from 'react';
import { 
  Card, Heading, Text, Button, Stack, Container, Flex, Badge, Dialog, Box, Spinner 
} from '@sanity/ui';
import { DownloadIcon, TrashIcon, RefreshIcon, WarningOutlineIcon } from '@sanity/icons';

interface LeadCounts {
  leads: number;
  stipends: number;
  internships: number;
  jobs: number;
}

interface CategoryConfig {
  id: keyof LeadCounts;
  title: string;
  desc: string;
  filename: string;
  tone: 'primary' | 'positive' | 'caution' | 'default';
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'leads',
    title: 'Visitor Lead Inquiries',
    desc: 'General inquiries, course interests & corporate contact form submissions.',
    filename: 'visitor_leads.csv',
    tone: 'primary',
  },
  {
    id: 'stipends',
    title: 'Stipend & Scholarship Registrations',
    desc: 'Student applications for stipend programs and EHF skill training intake.',
    filename: 'stipend_applications.csv',
    tone: 'positive',
  },
  {
    id: 'internships',
    title: 'Internship Applications',
    desc: 'Direct student applications for BDPS practical software internship batches.',
    filename: 'internship_applications.csv',
    tone: 'caution',
  },
  {
    id: 'jobs',
    title: 'Job Portal Leads / Applicants',
    desc: 'Student verification submissions captured from the Indian job portal apply flow.',
    filename: 'job_portal_applications.csv',
    tone: 'default',
  },
];

export default function LeadExportComponent() {
  const [counts, setCounts] = useState<LeadCounts>({ leads: 0, stipends: 0, internships: 0, jobs: 0 });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<CategoryConfig | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCounts = async () => {
    setLoadingCounts(true);
    try {
      const res = await fetch('/api/export-leads?action=counts');
      const data = await res.json();
      if (data.success && data.counts) {
        setCounts(data.counts);
      }
    } catch (e) {
      console.error('Failed to load lead counts:', e);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleDownload = (type: string) => {
    window.open(`/api/export-leads?type=${type}`, '_blank');
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/export-leads?type=${confirmTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({
          type: 'success',
          text: `Successfully deleted all submissions for "${confirmTarget.title}".`,
        });
        await fetchCounts();
      } else {
        setFeedbackMsg({
          type: 'error',
          text: data.error || data.message || 'Failed to delete submissions.',
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Network error while deleting submissions.',
      });
    } finally {
      setDeleting(false);
      setConfirmTarget(null);
    }
  };

  return (
    <Card padding={5} height="fill" tone="inherit">
      <Container width={2}>
        <Card padding={4} radius={3} shadow={2} border>
          <Stack space={4}>
            {/* Tool Header */}
            <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
              <Stack space={2}>
                <Heading size={3}>📥 BDPS Leads & Applications Exporter</Heading>
                <Text size={2} muted>
                  Export student inquiries, corporate leads, stipends, internships, and job applications into CSV or purge old records.
                </Text>
              </Stack>
              <Button
                icon={RefreshIcon}
                text={loadingCounts ? 'Refreshing...' : 'Refresh Counts'}
                mode="ghost"
                tone="default"
                padding={2}
                disabled={loadingCounts}
                onClick={fetchCounts}
              />
            </Flex>

            {/* Notification Banner */}
            {feedbackMsg && (
              <Card
                padding={3}
                radius={2}
                tone={feedbackMsg.type === 'success' ? 'positive' : 'critical'}
                border
              >
                <Text size={1} weight="semibold">
                  {feedbackMsg.type === 'success' ? '✅ ' : '⚠️ '}
                  {feedbackMsg.text}
                </Text>
              </Card>
            )}

            {/* Export Cards List */}
            <Stack space={3} style={{ marginTop: '10px' }}>
              {CATEGORIES.map((cat) => {
                const count = counts[cat.id] ?? 0;
                return (
                  <Card key={cat.id} padding={4} radius={2} tone={cat.tone} border>
                    <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                      {/* Left: Info & Count */}
                      <Stack space={2} style={{ maxWidth: '440px' }}>
                        <Flex align="center" gap={2}>
                          <Text weight="bold" size={3}>
                            {cat.title}
                          </Text>
                          <Badge tone={count > 0 ? 'primary' : 'default'} fontSize={1}>
                            {count} {count === 1 ? 'Record' : 'Records'}
                          </Badge>
                        </Flex>
                        <Text size={1} muted>
                          {cat.desc}
                        </Text>
                      </Stack>

                      {/* Right: Actions */}
                      <Flex align="center" gap={2} wrap="wrap">
                        <Button
                          icon={DownloadIcon}
                          text="Download (.CSV)"
                          tone={cat.tone === 'default' ? 'primary' : cat.tone}
                          padding={3}
                          disabled={count === 0}
                          onClick={() => handleDownload(cat.id)}
                          title={`Export ${count} records to ${cat.filename}`}
                        />
                        <Button
                          icon={TrashIcon}
                          text="Delete All"
                          tone="critical"
                          mode="ghost"
                          padding={3}
                          disabled={count === 0}
                          onClick={() => setConfirmTarget(cat)}
                          title={`Permanently delete all ${count} submissions`}
                        />
                      </Flex>
                    </Flex>
                  </Card>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </Container>

      {/* Safety Confirmation Dialog */}
      {confirmTarget && (
        <Dialog
          header={`⚠️ Confirm Permanent Deletion`}
          id="confirm-delete-leads-dialog"
          onClose={() => !deleting && setConfirmTarget(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Card padding={3} radius={2} tone="critical" border>
                <Flex align="flex-start" gap={3}>
                  <Box style={{ paddingTop: '2px' }}>
                    <WarningOutlineIcon style={{ fontSize: '20px' }} />
                  </Box>
                  <Stack space={2}>
                    <Text weight="bold" size={2}>
                      Permanently delete {counts[confirmTarget.id]} record(s) for "{confirmTarget.title}"?
                    </Text>
                    <Text size={1} muted>
                      This action <strong>cannot be undone</strong>. All documents will be permanently erased from Sanity Studio.
                    </Text>
                    <Text size={1} style={{ color: '#BD601C' }}>
                      💡 Tip: Please make sure you have downloaded the <strong>.CSV backup</strong> before proceeding.
                    </Text>
                  </Stack>
                </Flex>
              </Card>

              <Flex justify="flex-end" gap={2}>
                <Button
                  mode="ghost"
                  text="Cancel"
                  padding={3}
                  disabled={deleting}
                  onClick={() => setConfirmTarget(null)}
                />
                <Button
                  tone="critical"
                  icon={TrashIcon}
                  loading={deleting}
                  text={deleting ? 'Deleting Records...' : `Yes, Delete All (${counts[confirmTarget.id]})`}
                  padding={3}
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Card>
  );
}
