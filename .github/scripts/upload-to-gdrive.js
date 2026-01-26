const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

async function main() {
  const files = process.argv.slice(2).filter(f => f.trim());
  if (files.length === 0) {
    console.log('No files to upload');
    return;
  }

  const credentials = JSON.parse(
    Buffer.from(process.env.GDRIVE_CREDENTIALS, 'base64').toString()
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const folderId = process.env.GDRIVE_FOLDER_ID;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fileName = path.basename(file);
    const baseName = fileName.replace('.md', '');

    // MD形式でアップロード
    await uploadOrUpdate(drive, folderId, fileName, content, 'text/markdown');
    console.log(`✓ MD: ${fileName}`);

    // Google Docs形式でアップロード（NotebookLM用）
    await uploadOrUpdate(drive, folderId, baseName, content,
      'text/markdown', 'application/vnd.google-apps.document');
    console.log(`✓ Docs: ${baseName}`);
  }

  console.log('\n=== Sync completed ===');
}

async function uploadOrUpdate(drive, folderId, name, content, srcMime, dstMime = null) {
  const query = `name='${name}' and '${folderId}' in parents and trashed=false`;
  const existing = await drive.files.list({ q: query, fields: 'files(id)' });

  const metadata = { name, parents: [folderId] };
  if (dstMime) metadata.mimeType = dstMime;

  const media = { mimeType: srcMime, body: Readable.from(content) };

  if (existing.data.files.length > 0) {
    await drive.files.update({
      fileId: existing.data.files[0].id,
      media,
    });
  } else {
    await drive.files.create({
      requestBody: metadata,
      media,
      fields: 'id',
    });
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
