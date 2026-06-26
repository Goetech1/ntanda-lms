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
  
  const tinkerCmd = `
use App\\Models\\Tenant;
use App\\Models\\User;
$t = Tenant::where('subdomain', 'ntanda-demo')->first();
echo "TENANT_ID: " . ($t ? $t->id : 'NULL') . "\\n";
$users = User::all();
foreach($users as $u) {
  echo "USER: {$u->email} | TENANT: {$u->tenant_id}\\n";
}
`;

  const command = `/opt/alt/php82/usr/bin/php -d extension=pdo.so -d extension=pdo_mysql.so -d extension=mbstring.so -d extension=dom.so /home/wwwlearn/api.learningzm.com/artisan tinker --execute="${tinkerCmd.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/\n/g, ' ')}"`;
  
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
