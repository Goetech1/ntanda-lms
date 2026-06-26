const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
  host: '69.72.149.237',
  port: 22,
  username: 'wwwlearn',
  password: 'Zamnig@22'
};

async function checkFile(filePath) {
  try {
    const exists = await sftp.exists(filePath);
    if (exists) {
      const buffer = await sftp.get(filePath);
      console.log(`FOUND ${filePath} (${buffer.length} bytes)`);
      console.log(buffer.toString('utf8').substring(0, 300));
      console.log('--------------------------------------------');
    } else {
      console.log(`Not found: ${filePath}`);
    }
  } catch (err) {
    console.log(`Error reading ${filePath}:`, err.message);
  }
}

async function main() {
  try {
    await sftp.connect(config);
    console.log('Connected!');

    await checkFile('/home/wwwlearn/public_html/index.php');
    await checkFile('/home/wwwlearn/api.learningzm.com/public/index.php');
    await checkFile('/home/wwwlearn/api/public/index.php');
    await checkFile('/home/wwwlearn/public_html/api/index.php');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sftp.end();
  }
}

main();
