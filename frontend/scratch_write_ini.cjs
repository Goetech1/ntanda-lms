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
  
  const iniContent = `
extension=mbstring.so
extension=dom.so
extension=pdo.so
extension=pdo_mysql.so
`;

  // We write it to api.learningzm.com/public/.user.ini and php.ini
  const command = `echo "${iniContent}" > /home/wwwlearn/api.learningzm.com/public/.user.ini && echo "${iniContent}" > /home/wwwlearn/api.learningzm.com/public/php.ini && echo "${iniContent}" > /home/wwwlearn/api.learningzm.com/php.ini`;
  
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
