import type {Contact,Recruiter} from '../contracts/index.ts';
import type {Actor} from './access.ts';
import {ownerCatalog,effectiveCatalogOffer} from '../content/carrier-catalog/ownerCatalog.ts';
import {removedCatalogCompany} from '../domain/catalog-removals.ts';
import {PRIVATE_ACCOUNT_SEED} from './private-account-seed.ts';

const fixtureReady=new WeakMap<D1Database,Map<string,Promise<void>>>();

export async function privateReviewActor(db:D1Database,user:{userId:string;email:string}):Promise<Actor>{
 const row=await db.prepare('SELECT id,user_id,email,role,data_json FROM recruiters WHERE user_id=? AND lower(email)=? AND active=1').bind(user.userId,user.email.toLowerCase()).first<{id:string;user_id:string;email:string;role:Actor['role'];data_json:string}>();
 if(!row)throw Error('This private test account is not approved.');
 const profile=JSON.parse(row.data_json) as Recruiter;
 profile.accountRole=row.role;
 const seed=PRIVATE_ACCOUNT_SEED.find(item=>item.email===row.email.toLowerCase());
 let byAccount=fixtureReady.get(db);if(!byAccount){byAccount=new Map();fixtureReady.set(db,byAccount);}
 let initialized=byAccount.get(row.id);
 if(!initialized){initialized=(async()=>{
  const writes:D1PreparedStatement[]=[db.prepare('INSERT INTO store_revision(id,value) VALUES(1,0) ON CONFLICT(id) DO NOTHING')];
  if(seed?.seedContacts){
   const count=await db.prepare('SELECT COUNT(*) AS n FROM drivers WHERE owner_id=?').bind(row.id).first<{n:number}>();
   if((count?.n??0)===0){
    const contacts:Contact[]=Array.from({length:500},(_,i)=>({id:`TEST-${String(i+1).padStart(4,'0')}`,firstName:'Test',lastName:`Driver ${i+1}`,nameEvidence:'explicit_source',phoneRaw:`+1999555${String(1000+i)}`,phoneNormalized:`+1999555${String(1000+i)}`,email:null,city:'Synthetic City',state:'IL',sourceLabel:'PRIVATE TEST ONLY — synthetic driver',sourceRecordId:null,status:'available',ownerRecruiterId:row.id,reservedBy:null,activeConversationId:null,callbackAt:null,rawFields:{note:'Synthetic performance fixture. Never place a real call.',legacy_record_json:JSON.stringify({synthetic:true,padding:'x'.repeat(4096)}),...(i>=490?{myContactRecruiterId:row.id}:{})},isDemo:true}));
    const chunks=Array.from({length:Math.ceil(contacts.length/50)},(_,i)=>contacts.slice(i*50,(i+1)*50));
    writes.push(...chunks.map(chunk=>db.prepare("INSERT OR IGNORE INTO drivers(id,owner_id,phone,next_action,data_json) SELECT json_extract(value,'$.id'),?,json_extract(value,'$.phoneNormalized'),'PRIVATE TEST — never place a real call',value FROM json_each(?)").bind(row.id,JSON.stringify(chunk))));
   }
  }
  const hasCatalog=await db.prepare('SELECT id FROM companies LIMIT 1').first();
  if(!hasCatalog){
   const offers=ownerCatalog.filter(c=>!removedCatalogCompany(c.id,c.companyName)).flatMap(c=>c.drafts).map(o=>({...effectiveCatalogOffer(o),active:true,recruitingApproved:true,approvalStatus:'approved' as const,isDemo:false}));
   writes.push(db.prepare("INSERT OR IGNORE INTO companies(id,name,status,version,data_json) SELECT 'private-'||json_extract(value,'$.id'),json_extract(value,'$.companyName'),'active',1,json_object('privateTest',json('true')) FROM json_each(?)").bind(JSON.stringify(offers)));
   writes.push(db.prepare("INSERT OR IGNORE INTO offers(id,company_id,version,data_json) SELECT json_extract(value,'$.id'),'private-'||json_extract(value,'$.id'),json_extract(value,'$.snapshotVersion'),value FROM json_each(?)").bind(JSON.stringify(offers)));
  }
  await db.batch(writes);
 })();byAccount.set(row.id,initialized);}
 try{await initialized;}catch(error){byAccount.delete(row.id);throw error;}
 return {id:row.id,userId:row.user_id,email:row.email,role:row.role,profile};
}
