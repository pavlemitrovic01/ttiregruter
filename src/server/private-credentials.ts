import {ServiceError} from './access.ts';

const encoder=new TextEncoder();
const iterations=100_000;
function encode(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
function randomBytes(size:number){return crypto.getRandomValues(new Uint8Array(size));}
async function passwordHash(password:string,salt:Uint8Array){
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 return encode(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new Uint8Array(salt).buffer as ArrayBuffer,iterations},key,256)));
}
export function initialPasswordForName(name:string){
 const parts=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/[a-z0-9]+/g)??[];
 if(parts.length<2)throw new ServiceError('Enter first and last name to create a login account.');
 return `${parts[0]}.${parts[parts.length-1]}2026`;
}
export async function privateCredentialStatements(db:D1Database,emailInput:string,userId:string,password:string){
 const email=emailInput.trim().toLowerCase();
 if(password.length<8||password.length>128)throw new ServiceError('Use a password between 8 and 128 characters.');
 const salt=randomBytes(16),now=Date.now();
 return [
  db.prepare('INSERT INTO private_login_accounts(email,user_id,password_salt,password_hash,created_at) VALUES(?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET user_id=excluded.user_id,password_salt=excluded.password_salt,password_hash=excluded.password_hash').bind(email,userId,encode(salt),await passwordHash(password,salt),now),
  db.prepare('INSERT INTO private_login_state(email,must_change,initial_email_sent,updated_at) VALUES(?,1,0,?) ON CONFLICT(email) DO UPDATE SET must_change=1,initial_email_sent=0,temp_cipher=NULL,temp_iv=NULL,temp_key=NULL,updated_at=excluded.updated_at').bind(email,now),
  db.prepare('DELETE FROM private_login_sessions WHERE email=?').bind(email),
  db.prepare('DELETE FROM private_password_resets WHERE email=?').bind(email),
 ];
}
