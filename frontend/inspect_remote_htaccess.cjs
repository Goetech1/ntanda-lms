const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
  host: '69.72.149.237',
  port: 22,
  username: 'wwwlearn',
  password: 'Zamnig@22'
};

const remotePath = '/home/wwwlearn/public_html/.htaccess';

async function main() {
  try {
    await sftp.connect(config);
    console.log('Connected!');

    const buffer = await sftp.get(remotePath);
    console.log('--- remote .htaccess ---');
    console.log(buffer.toString('utf8'));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sftp.end();
  }
}

main();
