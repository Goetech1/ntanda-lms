const { Client } = require('ssh2');
const conn = new Client();

const config = {
  host: '69.72.149.237',
  port: 22,
  username: 'wwwlearn',
  password: 'Zamnig@22'
};

conn.on('ready', () => {
  console.log('SSH Connection ready.');
  
  const phpContent = `<?php phpinfo(); ?>`;

  const command = `echo '${phpContent}' > /home/wwwlearn/api.learningzm.com/public/info_123.php`;
  
  console.log(`Executing: ${command}`);
  
  conn.exec(command, (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code, signal) => {
      console.log(`Command closed with code ${code}`);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect(config);
