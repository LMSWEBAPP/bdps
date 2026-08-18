import React, { useState, useEffect } from 'react';
import { 
  Card, Heading, Text, Button, Stack, Container, Flex, Badge, Dialog, Box, Spinner, TextInput, Select 
} from '@sanity/ui';
import { 
  DownloadIcon, TrashIcon, RefreshIcon, SearchIcon, CopyIcon, CheckmarkIcon, WarningOutlineIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@sanity/icons';

type TabKey = 'leads' | 'stipends' | 'internships' | 'jobs';

export default function LeadsSpreadsheetComponent() {
  const [activeTab, setActiveTab] = useState<TabKey>('leads');
  const [data, setData] = useState<{ leads: any[]; stipends: any[]; internships: any[]; jobs: any[] }>({
    leads: [],
    stipends: [],
    internships: [],
    jobs: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteAllTarget, setDeleteAllTarget] = useState<TabKey | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/leads-data');
      const resData = await res.json();
      if (resData.success) {
        setData({
          leads: resData.leads || [],
          stipends: resData.stipends || [],
          internships: resData.internships || [],
          jobs: resData.jobs || [],
        });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', text: 'Failed to fetch leads data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSingleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads-data?id=${deleteTarget.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: 'success', text: `Deleted record for "${deleteTarget.name}".` });
        fetchLeads();
      } else {
        setFeedback({ type: 'error', text: resData.error || 'Failed to delete record.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error deleting record.' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!deleteAllTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/export-leads?type=${deleteAllTarget}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: 'success', text: `Successfully deleted all records in this category.` });
        fetchLeads();
      } else {
        setFeedback({ type: 'error', text: resData.error || 'Failed to delete records.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error deleting records.' });
    } finally {
      setDeleting(false);
      setDeleteAllTarget(null);
    }
  };

  const handleDownloadCsv = (type: TabKey) => {
    window.open(`/api/export-leads?type=${type}`, '_blank');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter List
  const currentList = data[activeTab] || [];
  const filteredList = currentList.filter((item: any) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(item).some((val) =>
      typeof val === 'string' && val.toLowerCase().includes(query)
    );
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredList.length);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  const tabConfig: { key: TabKey; label: string; count: number }[] = [
    { key: 'leads', label: '📋 Contact & Course Leads', count: data.leads.length },
    { key: 'stipends', label: '🎓 Stipend Applications', count: data.stipends.length },
    { key: 'internships', label: '💼 Internship Applicants', count: data.internships.length },
    { key: 'jobs', label: '🚀 Job Portal Applicants', count: data.jobs.length },
  ];

  return (
    <Card padding={4} height="fill" tone="inherit" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <Stack space={4}>
        {/* Header Bar */}
        <Card padding={4} radius={3} shadow={1} border>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            <Stack space={2}>
              <Heading size={3}>📊 BDPS Leads Spreadsheet (Excel / Table View)</Heading>
              <Text size={1} muted>
                Live datagrid of all student inquiries, stipend requests, internship applications, and job applicants.
              </Text>
            </Stack>

            <Flex align="center" gap={2}>
              <Button
                icon={DownloadIcon}
                text="Export Current Tab (.CSV)"
                tone="positive"
                padding={3}
                disabled={currentList.length === 0}
                onClick={() => handleDownloadCsv(activeTab)}
              />
              <Button
                icon={TrashIcon}
                text="Clear Current Tab"
                tone="critical"
                mode="ghost"
                padding={3}
                disabled={currentList.length === 0}
                onClick={() => setDeleteAllTarget(activeTab)}
              />
              <Button
                icon={RefreshIcon}
                text={loading ? 'Refreshing...' : 'Refresh'}
                tone="default"
                mode="ghost"
                padding={3}
                disabled={loading}
                onClick={fetchLeads}
              />
            </Flex>
          </Flex>
        </Card>

        {/* Feedback Alert */}
        {feedback && (
          <Card padding={3} radius={2} tone={feedback.type === 'success' ? 'positive' : 'critical'} border>
            <Text size={1} weight="semibold">
              {feedback.type === 'success' ? '✅ ' : '⚠️ '} {feedback.text}
            </Text>
          </Card>
        )}

        {/* Tab Switcher & Search Bar */}
        <Card padding={3} radius={3} border shadow={1}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            {/* Tabs */}
            <Flex gap={2} wrap="wrap">
              {tabConfig.map((tab) => (
                <Button
                  key={tab.key}
                  mode={activeTab === tab.key ? 'default' : 'ghost'}
                  tone={activeTab === tab.key ? 'primary' : 'default'}
                  padding={3}
                  onClick={() => handleTabChange(tab.key)}
                  text={`${tab.label} (${tab.count})`}
                />
              ))}
            </Flex>

            {/* Search Input & Rows Selector */}
            <Flex align="center" gap={2} wrap="wrap">
              <Box style={{ width: '280px' }}>
                <TextInput
                  icon={SearchIcon}
                  placeholder="Search by name, phone, email, course..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.currentTarget.value)}
                  fontSize={1}
                  padding={2}
                />
              </Box>

              <Box style={{ width: '135px' }}>
                <Select
                  fontSize={1}
                  padding={2}
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.currentTarget.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Card>

        {/* Spreadsheet Data Table */}
        <Card radius={3} border shadow={2} style={{ overflow: 'hidden' }}>
          {loading ? (
            <Flex align="center" justify="center" padding={6} gap={3}>
              <Spinner />
              <Text size={2}>Loading live spreadsheet data...</Text>
            </Flex>
          ) : filteredList.length === 0 ? (
            <Box padding={6} style={{ textAlign: 'center' }}>
              <Text size={2} muted>
                {searchQuery ? 'No records match your search filter.' : 'No submission records found in this category.'}
              </Text>
            </Box>
          ) : (
            <>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(189, 96, 28, 0.08)', borderBottom: '2px solid rgba(189, 96, 28, 0.2)' }}>
                      <th style={{ padding: '12px 14px', fontWeight: '800', width: '55px', color: '#BD601C' }}>#</th>
                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Full Name</th>
                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Phone / WhatsApp</th>
                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Email Address</th>
                      {activeTab === 'leads' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Course Interest</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '220px' }}>Message / Details</th>
                        </>
                      )}
                      {activeTab === 'stipends' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Qualification</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '110px' }}>Category</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '110px' }}>City</th>
                        </>
                      )}
                      {activeTab === 'internships' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Applied Domain</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Qualification</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Batch Shift</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Notes</th>
                        </>
                      )}
                      {activeTab === 'jobs' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Target Role</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Company</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '120px' }}>Qualification</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '120px' }}>Experience</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '110px' }}>City</th>
                        </>
                      )}
                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '100px' }}>Status</th>
                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Submitted At</th>
                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '70px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.map((row: any, idx: number) => (
                      <tr
                        key={row._id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        {/* Global Row Index across pages */}
                        <td style={{ padding: '12px 14px', color: '#786C65', fontWeight: '600' }}>
                          {startIndex + idx + 1}
                        </td>

                        {/* Name */}
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>
                          {row.fullName || '—'}
                        </td>

                        {/* Phone with Copy */}
                        <td style={{ padding: '12px 14px' }}>
                          <Flex align="center" gap={2}>
                            <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{row.phone || '—'}</span>
                            {row.phone && (
                              <Button
                                mode="bleed"
                                tone="default"
                                padding={1}
                                icon={copiedId === `p_${row._id}` ? CheckmarkIcon : CopyIcon}
                                title="Copy Phone"
                                onClick={() => handleCopy(row.phone, `p_${row._id}`)}
                              />
                            )}
                          </Flex>
                        </td>

                        {/* Email with Copy */}
                        <td style={{ padding: '12px 14px' }}>
                          <Flex align="center" gap={2}>
                            <span style={{ wordBreak: 'break-all' }}>{row.email || '—'}</span>
                            {row.email && (
                              <Button
                                mode="bleed"
                                tone="default"
                                padding={1}
                                icon={copiedId === `e_${row._id}` ? CheckmarkIcon : CopyIcon}
                                title="Copy Email"
                                onClick={() => handleCopy(row.email, `e_${row._id}`)}
                              />
                            )}
                          </Flex>
                        </td>

                        {/* Tab-specific columns */}
                        {activeTab === 'leads' && (
                          <>
                            <td style={{ padding: '12px 14px', fontWeight: '600' }}>{row.course || '—'}</td>
                            <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: '300px' }}>{row.message || '—'}</td>
                          </>
                        )}

                        {activeTab === 'stipends' && (
                          <>
                            <td style={{ padding: '12px 14px' }}>{row.qualification || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <Badge tone="primary">{row.category || 'General'}</Badge>
                            </td>
                            <td style={{ padding: '12px 14px' }}>{row.city || '—'}</td>
                          </>
                        )}

                        {activeTab === 'internships' && (
                          <>
                            <td style={{ padding: '12px 14px', fontWeight: '600' }}>{row.course || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>{row.qualification || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>{row.preferredBatch || '—'}</td>
                            <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: '240px' }}>{row.notes || '—'}</td>
                          </>
                        )}

                        {activeTab === 'jobs' && (
                          <>
                            <td style={{ padding: '12px 14px', fontWeight: '700', color: '#38bdf8' }}>{row.jobTitle || '—'}</td>
                            <td style={{ padding: '12px 14px', fontWeight: '600' }}>{row.company || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>{row.qualification || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>{row.experience || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>{row.city || '—'}</td>
                          </>
                        )}

                        {/* Status Badge */}
                        <td style={{ padding: '12px 14px' }}>
                          <Badge tone={row.status === 'Enrolled' || row.status === 'Placed' || row.status === 'Shortlisted' ? 'positive' : 'default'} fontSize={1}>
                            {row.status || 'New'}
                          </Badge>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {formatDate(row.submittedAt)}
                        </td>

                        {/* Single Row Delete Action */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <Button
                            mode="bleed"
                            tone="critical"
                            padding={2}
                            icon={TrashIcon}
                            title="Delete this row"
                            onClick={() => setDeleteTarget({ id: row._id, name: row.fullName || 'Record' })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <Card padding={3} borderTop style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                  <Text size={1} muted>
                    Showing <strong>{startIndex + 1}</strong> – <strong>{endIndex}</strong> of <strong>{filteredList.length}</strong> records (Page {safePage} of {totalPages})
                  </Text>

                  {totalPages > 1 && (
                    <Flex align="center" gap={1}>
                      <Button
                        mode="ghost"
                        icon={ChevronLeftIcon}
                        text="Prev"
                        fontSize={1}
                        padding={2}
                        disabled={safePage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      />

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && safePage > 3) {
                          pageNum = safePage - 2 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        return (
                          <Button
                            key={pageNum}
                            mode={safePage === pageNum ? 'default' : 'bleed'}
                            tone={safePage === pageNum ? 'primary' : 'default'}
                            text={String(pageNum)}
                            fontSize={1}
                            padding={2}
                            onClick={() => setCurrentPage(pageNum)}
                          />
                        );
                      })}

                      <Button
                        mode="ghost"
                        icon={ChevronRightIcon}
                        text="Next"
                        fontSize={1}
                        padding={2}
                        disabled={safePage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      />
                    </Flex>
                  )}
                </Flex>
              </Card>
            </>
          )}
        </Card>
      </Stack>

      {/* Confirmation Dialog for Single Row Deletion */}
      {deleteTarget && (
        <Dialog
          header="⚠️ Delete Record"
          id="confirm-single-delete-dialog"
          onClose={() => !deleting && setDeleteTarget(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={2}>
                Are you sure you want to delete the submission for <strong>"{deleteTarget.name}"</strong>? This cannot be undone.
              </Text>
              <Flex justify="flex-end" gap={2}>
                <Button mode="ghost" text="Cancel" padding={3} disabled={deleting} onClick={() => setDeleteTarget(null)} />
                <Button tone="critical" icon={TrashIcon} loading={deleting} text={deleting ? 'Deleting...' : 'Delete Row'} padding={3} disabled={deleting} onClick={handleSingleDelete} />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/* Confirmation Dialog for Purging Current Tab */}
      {deleteAllTarget && (
        <Dialog
          header="⚠️ Purge All Tab Records"
          id="confirm-purge-tab-dialog"
          onClose={() => !deleting && setDeleteAllTarget(null)}
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
                      Permanently delete ALL records in this tab?
                    </Text>
                    <Text size={1} muted>
                      This will erase all documents for this category from Sanity CMS. Make sure you downloaded the CSV first.
                    </Text>
                  </Stack>
                </Flex>
              </Card>
              <Flex justify="flex-end" gap={2}>
                <Button mode="ghost" text="Cancel" padding={3} disabled={deleting} onClick={() => setDeleteAllTarget(null)} />
                <Button tone="critical" icon={TrashIcon} loading={deleting} text={deleting ? 'Purging...' : 'Yes, Delete All in Tab'} padding={3} disabled={deleting} onClick={handleDeleteAll} />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Card>
  );
}
