const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
  host: '69.72.149.237',
  port: 22,
  username: 'wwwlearn',
  password: 'Zamnig@22'
};

const remotePath = '/home/wwwlearn/public_html/index.php';

async function main() {
  try {
    await sftp.connect(config);
    console.log('Connected!');

    // Read index.php
    const buffer = await sftp.get(remotePath);
    const originalContent = buffer.toString('utf8');

    // Inject debug statement
    const debugContent = '<?php echo "DEBUG: HITTING PUBLIC_HTML INDEX.PHP"; exit; ?>\n' + originalContent;
    console.log('Injecting debug statement...');
    await sftp.put(Buffer.from(debugContent, 'utf8'), remotePath);
    console.log('✓ Debug statement injected.');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sftp.end();
  }
}

main();
