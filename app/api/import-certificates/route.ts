import { NextResponse } from 'next/server';
import { sanityWriteClient } from '../../../lib/sanity.write';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { certificates } = body;

    if (!Array.isArray(certificates) || certificates.length === 0) {
      return NextResponse.json({ success: false, message: 'No certificate records provided.' }, { status: 400 });
    }

    const transaction = sanityWriteClient.transaction();

    let count = 0;
    for (const item of certificates) {
      if (!item.regNumber || !item.fullName || !item.courseName) {
        continue;
      }

      const regNum = String(item.regNumber).trim();
      const docId = `certificate-${regNum.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;

      const doc = {
        _id: docId,
        _type: 'certificate',
        regNumber: regNum,
        fullName: String(item.fullName).trim(),
        courseName: String(item.courseName).trim(),
        issueDate: item.issueDate ? String(item.issueDate).trim() : new Date().toISOString().split('T')[0],
        issuedBy: item.issuedBy ? String(item.issuedBy).trim() : 'BDPS Computer Education',
        grade: item.grade ? String(item.grade).trim() : 'Grade A+',
        duration: item.duration ? String(item.duration).trim() : '6 Months',
        certificateId: item.certificateId ? String(item.certificateId).trim() : `CERT-${regNum}`,
        status: item.status === 'Revoked' ? 'Revoked' : 'Valid',
      };

      transaction.createOrReplace(doc);
      count++;
    }

    if (count === 0) {
      return NextResponse.json({ success: false, message: 'No valid certificate entries found in payload.' }, { status: 400 });
    }

    await transaction.commit();

    return NextResponse.json({
      success: true,
      importedCount: count,
      message: `Successfully imported ${count} student certificates into Sanity!`,
    });
  } catch (error: any) {
    console.error('Import Certificates Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to import certificates into Sanity.' }, { status: 500 });
  }
}
