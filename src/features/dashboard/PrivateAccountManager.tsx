'use client';

import {useState} from 'react';

type AccountRow={id:string;user_id:string|null;email:string;role:string;active:number;data_json:string;has_login?:number;must_change_password?:number};

export function PrivateAccountManager({accounts,currentId,role,onChanged}:{accounts:AccountRow[];currentId:string;role:string;onChanged:()=>Promise<void>|void}){
 const [name,setName]=useState(''),[alias,setAlias]=useState(''),[email,setEmail]=useState(''),[newRole,setNewRole]=useState('recruiter'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[created,setCreated]=useState<{email:string;password:string}|null>(null),[copyStatus,setCopyStatus]=useState('');
 const owner=role==='owner';
 const post=async(action:string,input:unknown)=>{
  setBusy(true);setError('');setCopyStatus('');
  try{
   const response=await fetch('/api/operations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,input})});
   const result=await response.json() as {ok:boolean;message?:string;value?:{email?:string;temporaryPassword?:string}};
   if(!result.ok)throw new Error(result.message||'Request failed.');
   if(action==='create_private_account'&&result.value?.temporaryPassword)setCreated({email:result.value.email||email,password:result.value.temporaryPassword});
   if(action==='delete_private_account')setCreated(null);
   await onChanged();
  }catch(e){setError(e instanceof Error?e.message:'Could not update this account.');}
  finally{setBusy(false);}
 };
 const create=async()=>{
  await post('create_private_account',{email,name,alias,role:newRole});
 };
 const copy=async()=>{
  if(!created)return;
  try{await navigator.clipboard.writeText(created.password);setCopyStatus('Password copied.');}
  catch{setCopyStatus('Copy failed. Select and copy the password manually.');}
 };
 return <section aria-label="Private recruiter accounts" style={{margin:'16px 0',padding:16,border:'1px solid #c7d2df',borderRadius:10}}>
  <h3>Login accounts</h3>
  <p>New accounts receive a one-time password in the format <code>first.last2026</code> and must change it at first login. Deleting an account removes login access while keeping its contact and call history.</p>
  {created&&<div role="status" style={{padding:12,margin:'12px 0',border:'1px solid #83b99b',borderRadius:8}}>
   <strong>Temporary login created</strong><p>{created.email}</p><label>Temporary password<input readOnly value={created.password}/></label><button type="button" onClick={()=>void copy()}>Copy password</button><p>{copyStatus||'Copy the password now; it is shown only until this view is closed or refreshed.'}</p>
  </div>}
  <div style={{overflowX:'auto'}}><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Login</th><th>Action</th></tr></thead><tbody>
   {accounts.map(account=>{const profile=JSON.parse(account.data_json) as {fullName?:string;alias?:string};const canDelete=account.active===1&&account.id!==currentId&&(owner||account.role==='recruiter');return <tr key={account.id}>
    <td>{profile.fullName||profile.alias||'Name not recorded'}</td><td>{account.email}</td><td>{account.role}</td>
    <td>{!account.active?'Deleted':account.has_login?'Ready':'No password login'}{account.active&&account.must_change_password?' · change password at first login':''}</td>
    <td>{canDelete?<button type="button" disabled={busy} onClick={()=>{if(window.confirm(`Delete login access for ${account.email}? Their contacts and call history will stay in the private test database.`))void post('delete_private_account',{accountId:account.id});}}>Delete account</button>:account.id===currentId?'Current account':''}</td>
   </tr>;})}
  </tbody></table></div>
  <h4>Create account</h4>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10}}>
   <label>Full name<input value={name} onChange={event=>setName(event.target.value)} placeholder="First Last"/></label>
   <label>Recruiter alias<input value={alias} onChange={event=>setAlias(event.target.value)}/></label>
   <label>Email<input type="email" value={email} onChange={event=>setEmail(event.target.value)}/></label>
   <label>Role<select value={newRole} onChange={event=>setNewRole(event.target.value)}>{(owner?['recruiter','admin','owner']:['recruiter']).map(value=><option key={value} value={value}>{value}</option>)}</select></label>
  </div>
  <button type="button" disabled={busy||!name.trim()||!alias.trim()||!email.trim()} onClick={()=>void create()}>{busy?'Saving…':'Create account'}</button>
  {error&&<p role="alert">{error}</p>}
 </section>;
}
