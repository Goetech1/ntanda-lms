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
    let content = buffer.toString('utf8');

    // Add error_log at the start of execution
    if (!content.includes('HITTING_PUBLIC_HTML')) {
      content = content.replace('<?php', '<?php\nerror_log("HITTING_PUBLIC_HTML_REQUEST_URI: " . $_SERVER["REQUEST_URI"]);\n');
      console.log('Injecting error_log into index.php...');
      await sftp.put(Buffer.from(content, 'utf8'), remotePath);
      console.log('✓ Injected successfully.');
    } else {
      console.log('Already injected.');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sftp.end();
  }
}

main();
