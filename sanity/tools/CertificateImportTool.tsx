import React, { useState } from 'react';
import { Card, Heading, Text, Button, Stack, Container, Flex, Spinner, Badge, Box } from '@sanity/ui';
import { DownloadIcon, UploadIcon, DocumentIcon, CheckmarkCircleIcon, ErrorOutlineIcon } from '@sanity/icons';

interface CertificateRecord {
  regNumber: string;
  fullName: string;
  courseName: string;
  issueDate?: string;
  issuedBy?: string;
  grade?: string;
  duration?: string;
  certificateId?: string;
}

export default function CertificateImportTool() {
  const [records, setRecords] = useState<CertificateRecord[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const downloadSampleCsv = () => {
    const csvRows = [
      'regNumber,fullName,courseName,issueDate,issuedBy,grade,duration,certificateId',
      'BDPS-2024-101,Ramesh Reddy,Post Graduate Diploma in Computer Applications (PGDCA),2024-05-15,BDPS Computer Education Kakinada,Grade A+,1 Year,CERT-BDPS-2024-101',
      'BDPS-2024-102,Priya Sharma,Core Java & Software Programming,2024-06-20,BDPS Computer Education,Grade A,4 Months,CERT-BDPS-2024-102',
      'BDPS-2024-103,Venkatesh K,Tally Prime & Financial Accounting,2024-07-10,BDPS Computer Education,Distinction,3 Months,CERT-BDPS-2024-103',
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'bdps_student_certificates_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^["']|["']$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const parseCSV = (text: string): CertificateRecord[] => {
    const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const rawHeaders = parseCSVLine(lines[0]);
    const headerKeys: string[] = rawHeaders.map((h, i) => {
      const clean = h.trim().replace(/^\uFEFF/, '');
      const norm = clean.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Check course FIRST to avoid 'coursename' matching 'name'
      if (norm.includes('course') || norm.includes('program') || norm.includes('subject')) return 'courseName';
      if (norm.includes('fullname') || norm.includes('student') || norm === 'name' || norm === 'studentname') return 'fullName';
      if (norm.includes('reg') || norm.includes('roll')) return 'regNumber';
      if (norm.includes('issuedate') || norm === 'date' || norm.includes('dateofissue')) return 'issueDate';
      if (norm.includes('issuedby') || norm.includes('institute') || norm.includes('campus') || norm.includes('by')) return 'issuedBy';
      if (norm.includes('grade') || norm.includes('result') || norm.includes('score') || norm.includes('marks')) return 'grade';
      if (norm.includes('duration')) return 'duration';
      if (norm.includes('cert') || norm.includes('serial')) return 'certificateId';

      // Positional defaults
      if (i === 0) return 'regNumber';
      if (i === 1) return 'fullName';
      if (i === 2) return 'courseName';
      return clean;
    });

    const parsed: CertificateRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cleanVals = parseCSVLine(lines[i]);
      // Skip empty rows or trailing commas (e.g. ,,,,,,,)
      if (cleanVals.length < 2 || cleanVals.every(v => v === '')) continue;

      const obj: any = {};
      headerKeys.forEach((key, idx) => {
        if (cleanVals[idx] !== undefined && cleanVals[idx] !== '') {
          obj[key] = cleanVals[idx];
        }
      });

      const reg = obj.regNumber || cleanVals[0];
      const name = obj.fullName || cleanVals[1];
      const course = obj.courseName || cleanVals[2];

      if (reg && name && course) {
        parsed.push({
          regNumber: String(reg).trim(),
          fullName: String(name).trim(),
          courseName: String(course).trim(),
          issueDate: obj.issueDate ? String(obj.issueDate).trim() : new Date().toISOString().split('T')[0],
          issuedBy: obj.issuedBy ? String(obj.issuedBy).trim() : 'BDPS Computer Education',
          grade: obj.grade ? String(obj.grade).trim() : 'Grade A+',
          duration: obj.duration ? String(obj.duration).trim() : '6 Months',
          certificateId: obj.certificateId ? String(obj.certificateId).trim() : `CERT-${String(reg).trim()}`,
        });
      }
    }

    return parsed;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMsg('');
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setErrorMsg('No valid certificate rows found in CSV. Please check columns: regNumber, fullName, courseName');
          setRecords([]);
        } else {
          setRecords(parsed);
          setStatusMsg(`Loaded ${parsed.length} certificate records from "${file.name}". Ready to import into Sanity CMS.`);
        }
      } catch (err: any) {
        setErrorMsg('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleImportToSanity = async () => {
    if (records.length === 0) return;
    setLoading(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/import-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates: records }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg(`🎉 ${data.message || `Successfully imported ${records.length} certificates into Sanity!`}`);
        setRecords([]);
        setFileName('');
      } else {
        throw new Error(data.message || 'Failed to import certificates into Sanity.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during Sanity CMS batch upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding={5} height="fill" tone="inherit">
      <Container width={2}>
        <Card padding={4} radius={3} shadow={2} border style={{ backgroundColor: '#ffffff' }}>
          <Stack space={4}>
            <Flex align="center" justify="space-between">
              <Heading size={3}>🎓 Student Certificate Batch CSV Importer</Heading>
              <Button
                icon={DownloadIcon}
                text="Download CSV Template"
                mode="ghost"
                tone="primary"
                onClick={downloadSampleCsv}
              />
            </Flex>

            <Text size={2} muted>
              Upload CSV file containing student certificate records. Required columns: <code>regNumber</code>, <code>fullName</code>, <code>courseName</code>, <code>issueDate</code>, <code>issuedBy</code>, <code>grade</code>, <code>duration</code>.
            </Text>

            {/* File Upload Box */}
            <Card padding={4} radius={2} border style={{ backgroundColor: '#F9FAFB', borderStyle: 'dashed' }}>
              <Stack space={3} align="center">
                <DocumentIcon style={{ fontSize: 32, color: '#3B82F6' }} />
                <Text weight="bold" size={2}>Select CSV File from Computer</Text>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ cursor: 'pointer', fontSize: '13px' }}
                />
                {fileName && (
                  <Badge tone="primary" size={2}>Selected: {fileName} ({records.length} rows)</Badge>
                )}
              </Stack>
            </Card>

            {/* Status & Error Alerts */}
            {statusMsg && (
              <Card padding={3} radius={2} tone="positive" border>
                <Flex align="center" gap={2}>
                  <CheckmarkCircleIcon />
                  <Text size={2} weight="bold">{statusMsg}</Text>
                </Flex>
              </Card>
            )}

            {errorMsg && (
              <Card padding={3} radius={2} tone="critical" border>
                <Flex align="center" gap={2}>
                  <ErrorOutlineIcon />
                  <Text size={2} weight="bold">{errorMsg}</Text>
                </Flex>
              </Card>
            )}

            {/* Preview & Import Action Button */}
            {records.length > 0 && (
              <Stack space={3} style={{ marginTop: '10px' }}>
                <Heading size={2}>Preview ({records.length} Records)</Heading>
                <Card padding={3} radius={2} border style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
                  <Stack space={2}>
                    {records.slice(0, 5).map((r, idx) => (
                      <Text key={idx} size={1}>
                        <strong>#{idx + 1} REG: {r.regNumber}</strong> | Name: {r.fullName} | Course: {r.courseName} | Issued: {r.issueDate}
                      </Text>
                    ))}
                    {records.length > 5 && (
                      <Text size={1} muted>... and {records.length - 5} more records</Text>
                    )}
                  </Stack>
                </Card>

                <Button
                  icon={UploadIcon}
                  text={loading ? 'Importing into Sanity CMS...' : `Batch Import ${records.length} Certificates to Sanity`}
                  tone="positive"
                  padding={3}
                  disabled={loading}
                  onClick={handleImportToSanity}
                />
              </Stack>
            )}

            {loading && (
              <Flex justify="center" align="center" gap={2} padding={3}>
                <Spinner />
                <Text size={2}>Processing batch transactions & writing to Sanity database...</Text>
              </Flex>
            )}
          </Stack>
        </Card>
      </Container>
    </Card>
  );
}
