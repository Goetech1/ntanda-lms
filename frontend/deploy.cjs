const Client = require('ssh2-sftp-client');
const path = require('path');

const sftp = new Client();

const config = {
  host: '69.72.149.237',
  port: 22, // Default SFTP port. Update if cPanel uses a custom port.
  username: 'wwwlearn',
  password: 'Zamnig@22'
};

const localDir = path.resolve(__dirname, 'dist');
const remoteDir = '/home/wwwlearn/public_html';

async function deploy() {
  console.log(`Starting deployment of frontend to ${config.host}...`);
  console.log(`Local path: ${localDir}`);
  console.log(`Remote path: ${remoteDir}`);

  try {
    await sftp.connect(config);
    console.log('✓ SFTP Connection established.');

    // Ensure remote directory exists
    const exists = await sftp.exists(remoteDir);
    if (!exists) {
      console.log(`Remote directory ${remoteDir} does not exist. Creating it...`);
      await sftp.mkdir(remoteDir, true);
    }

    console.log('Uploading files recursively (this may take a minute)...');

    // Upload directory contents recursively
    await sftp.uploadDir(localDir, remoteDir);

    console.log('✓ Upload completed successfully!');
  } catch (err) {
    console.error('❌ Deployment failed:', err.message);
    console.error('Please verify that SFTP is enabled on port 22 and that your host allows SSH/SFTP access for this user.');
    process.exit(1);
  } finally {
    await sftp.end();
    console.log('SFTP Connection closed.');
  }
}

deploy();
