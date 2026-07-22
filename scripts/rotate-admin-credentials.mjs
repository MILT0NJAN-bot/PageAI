import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const root = process.cwd();
const requireFromWeb = createRequire(path.join(root, 'apps', 'web', 'package.json'));
const bcrypt = requireFromWeb('bcryptjs');
const webEnvPath = path.join(root, 'apps', 'web', '.env.local');
const apiEnvPath = path.join(root, 'apps', 'api', '.env');
const credentialPath = path.join(root, '.admin-credentials.local.txt');

function readEnv(file) {
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(line=>line && !line.startsWith('#') && line.includes('=')).map(line=>[line.slice(0,line.indexOf('=')),line.slice(line.indexOf('=')+1)]));
}
function writeValues(file, values) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [name,value] of Object.entries(values)) {
    const pattern = new RegExp(`^${name}=.*$`, 'm');
    content = pattern.test(content) ? content.replace(pattern, () => `${name}=${value}`) : `${content.trimEnd()}\n${name}=${value}\n`;
  }
  fs.writeFileSync(file, content, { encoding:'utf8', mode:0o600 });
}

const web = readEnv(webEnvPath);
if (!web.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL no está configurado en apps/web/.env.local');
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%_-';
const password = Array.from(crypto.randomBytes(28), byte => alphabet[byte % alphabet.length]).join('');
const passwordHash = await bcrypt.hash(password, 12);
const nextAuthSecret = crypto.randomBytes(48).toString('base64url');
const adminApiKey = crypto.randomBytes(48).toString('base64url');

writeValues(webEnvPath, { ADMIN_PASSWORD_HASH:passwordHash, NEXTAUTH_SECRET:nextAuthSecret, ADMIN_API_KEY:adminApiKey });
writeValues(apiEnvPath, { ADMIN_EMAIL:web.ADMIN_EMAIL.trim().toLowerCase(), ADMIN_API_KEY:adminApiKey });
fs.writeFileSync(credentialPath, `PAGE AI - CREDENCIAL ADMINISTRATIVA TEMPORAL\n\nCorreo: ${web.ADMIN_EMAIL.trim().toLowerCase()}\nContraseña: ${password}\n\nGuárdala en un gestor de contraseñas y elimina este archivo.\n`, { encoding:'utf8', mode:0o600 });
try { fs.chmodSync(credentialPath, 0o600); } catch {}
console.log('Credenciales y secretos rotados correctamente.');
console.log('La contraseña temporal se guardó en .admin-credentials.local.txt (ignorado por Git).');
