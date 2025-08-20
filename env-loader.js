const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

function loadEnv(appEnv){
  const envPath = path.resolve(process.cwd(), `env/.env.${appEnv}`);
  if (!fs.existsSync(envPath)){console.warn(`Environment file not found: ${envPath}`); return;}
  const envConfig = dotenv.parse(fs.readFileSync(envPath));  
  for(const k in envConfig){process.env[k] = envConfig[k];}
  console.log(`Loaded environment from: ${envPath}`);
}
module.exports = loadEnv;