/* Tin Cậy Family Notebook — app logic.
   Ported from prototype/tin-cay-notebook.html. Storage: local-first outbox in localStorage,
   synced to Supabase (Postgres + Realtime) when there is signal. AI: Supabase Edge Function `ai`. */
'use strict';

/* ============ EXTRA UI STRINGS (P1 + Supabase) ============ */
Object.assign(UI, {
 predict:['Prediction Cards','Đoán từ'], quiz:['Family Quiz','Đố vui gia đình'], race:['Book Race','Đua tên sách'], memory:['Memory Flip','Lật thẻ'], whoami:['Who Am I?','Tôi là ai?'], tones:['Tone Marks','Dấu thanh'], badges:['Badges','Huy hiệu'],
 joinH:['Enter the family code','Nhập mã gia đình'], joinSub:['Ask the family for the code. You only need to do this once on each phone or iPad.','Hỏi gia đình để biết mã. Mỗi máy chỉ cần nhập một lần.'],
 joinBtn:['Join','Tham gia'], joinPh:['Family code','Mã gia đình'], wrongCode:['That code isn’t right. Try again.','Mã không đúng. Thử lại.'],
 needSignal:['Needs signal the first time. Connect to Wi-Fi and try again.','Lần đầu cần có sóng. Hãy kết nối Wi-Fi rồi thử lại.'],
 iosHint:['On iPhone/iPad: tap Share → Add to Home Screen first, then open the notebook from the new icon and join there. (Safari and the home-screen app keep separate data.)','Trên iPhone/iPad: chạm Chia sẻ → Thêm vào MH chính, rồi mở từ biểu tượng mới và tham gia ở đó.'],
 connecting:['Connecting…','Đang kết nối…'], update:['Update ready · tap to reload','Có bản mới · chạm để tải lại'],
 predictHint:['Before a talk, pick 3 words you think the speaker will say. Tap a word when you hear it (+2 each). Everyone’s cards show after the talk.','Trước bài giảng, chọn 3 từ bạn nghĩ diễn giả sẽ nói. Chạm vào từ khi nghe thấy (+2).'],
 talkPick:['Talk','Bài giảng'], myWords:['My 3 words','3 từ của tôi'], addWord:['Type a word','Nhập một từ'], suggest:['Ideas','Gợi ý'], othersCards:['Everyone’s cards','Thẻ của mọi người'], showNow:['Show now','Xem ngay'], hiddenUntil:['Hidden until the talk ends','Ẩn cho đến khi bài giảng kết thúc'], tapHeard:['Tap a word when you hear it.','Chạm vào từ khi bạn nghe thấy.'],
 quizHint:['Ask the family a quiet question. Others answer on their phones; you tap Reveal. +3 for a right answer.','Đặt câu hỏi cho gia đình. Mọi người trả lời trên máy; bạn chạm Công bố. +3 nếu đúng.'],
 newQ:['New question','Câu hỏi mới'], qPh:['Your question','Câu hỏi của bạn'], optPh:['Answer','Đáp án'], markRight:['Tap ✓ next to the right answer.','Chạm ✓ bên cạnh đáp án đúng.'], post:['Post','Đăng'], cancel:['Cancel','Hủy'],
 reveal:['Reveal','Công bố'], answered:['answered','đã trả lời'], waitReveal:['Waiting for reveal…','Chờ công bố…'], yourQ:['Your question','Câu hỏi của bạn'], noQ:['No questions yet.','Chưa có câu hỏi.'],
 lunchQuiz:['Lunch Quiz (AI)','Đố vui giờ trưa (AI)'], rideQuiz:['Ride-home Quiz (AI)','Đố vui trên đường về (AI)'], aiQuizHint:['Builds 5 questions from the family’s notes. Needs signal. +2 per right answer.','Tạo 5 câu hỏi từ ghi chú của gia đình. Cần có sóng. +2 mỗi câu đúng.'],
 making:['Making questions…','Đang tạo câu hỏi…'], needNotes:['Write some notes for this session first.','Hãy ghi chú cho buổi này trước.'],
 raceHint:['Match each Bible book to its name in the other language. 60 seconds!','Ghép tên sách Kinh Thánh với tên trong ngôn ngữ kia. 60 giây!'], start:['Start','Bắt đầu'], best:['Best','Cao nhất'], again:['Play again','Chơi lại'], timeUp:['Time’s up!','Hết giờ!'],
 memHint:['Find the Vietnamese–English pairs. Best time is saved.','Tìm các cặp Việt–Anh. Thời gian tốt nhất được lưu.'], moves:['moves','lượt'],
 whoHint:['Guess the Bible character. Right on clue 1 = 3 points, clue 2 = 2, clue 3 = 1.','Đoán nhân vật Kinh Thánh. Đúng ở gợi ý 1 = 3 điểm, 2 = 2, 3 = 1.'], clue:['Clue','Gợi ý'], nextClue:['Next clue','Gợi ý tiếp'], nextPerson:['Next person','Người tiếp theo'], itWas:['It was','Đó là'], whoVerified:['Names per the Vietnamese New World Translation on wol.jw.org. Vietnamese clue wording is ours — not verified against JW usage.','Tên theo Bản dịch Thế Giới Mới trên wol.jw.org. Lời gợi ý tiếng Việt chưa được kiểm chứng.'],
 tonesHint:['Vietnamese has six tones. Pick the tone for the word — or the word for the tone.','Tiếng Việt có sáu thanh. Chọn thanh cho từ, hoặc chọn từ cho thanh.'], whichTone:['Which tone?','Thanh nào?'], whichWord:['Which word has this tone?','Từ nào có thanh này?'], next:['Next','Tiếp'],
 recap:['Family recap (AI)','Tóm tắt của gia đình (AI)'], recapHint:['At the end of the day, AI picks the family’s best notes into a short recap.','Cuối ngày, AI tóm tắt những ghi chú hay nhất của gia đình.'], makeRecap:['Make recap','Tạo bản tóm tắt'], shareChat:['Send to family chat','Gửi vào nhóm gia đình'],
 localMode:['Not connected to the family database yet — everything is saved on this device only.','Chưa kết nối với dữ liệu gia đình — mọi thứ chỉ lưu trên máy này.'],
});
const BADGES = [
 {id:'bingo', icon:'🎉', en:'Bingo!', vi:'Bingo!'},
 {id:'hunter', icon:'📖', en:'Scripture Hunter', vi:'Thợ săn Kinh Thánh'},
 {id:'notes5', icon:'✍️', en:'Note Taker ×5', vi:'Ghi chú ×5'},
 {id:'predictor', icon:'🔮', en:'Predictor', vi:'Nhà tiên đoán'},
 {id:'quiz', icon:'💡', en:'Quiz Whiz', vi:'Giỏi đố vui'},
 {id:'racer', icon:'🏁', en:'Book Racer', vi:'Tay đua sách'},
 {id:'memory', icon:'🧠', en:'Memory Master', vi:'Trí nhớ tốt'},
 {id:'who', icon:'🕵️', en:'Bible Detective', vi:'Thám tử Kinh Thánh'},
 {id:'tones', icon:'🎵', en:'Tone Spotter', vi:'Bắt thanh giỏi'},
];

/* ============ STATE ============ */
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S = {
 lang: LS.get('tc_lang','both'), me: LS.get('tc_me',null), tab: LS.get('tc_tab','program'), gtab: LS.get('tc_gtab','bingo'), bsess:'am', wfilter:'all',
 docs: LS.get('tc_docs',{}), pending: LS.get('tc_pending',{}), dbState:'connecting', gate:false, gateErr:'', joining:false,
 chatSeen: LS.get('tc_chatseen',0), open:{}, reveal:{}, trans: LS.get('tc_trans',{}),
 predPart:null, predReveal:{}, quizForm:false, aiQuizBusy:null, recap: LS.get('tc_recap',''), recapBusy:false,
};
const CFG = window.APP_CONFIG || {};
let SB=null, CHANNEL=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const u=k=>UI[k][S.lang==='vi'?1:0];
const $=id=>document.getElementById(id);
const tx=(en,vi)=>S.lang==='vi'?vi:en; /* plain text pick */
const newId=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
const iso=ts=>new Date(ts||Date.now()).toISOString();
const ms=s=>s?+new Date(s):0;
/* Bilingual text helper */
function L(en,vi){ if(S.lang==='en') return esc(en); if(S.lang==='vi') return esc(vi); return `${esc(en)}<span class="vi-sub" lang="vi">${esc(vi)}</span>`; }
function LB(en,vi){ return S.lang==='en'?en:S.lang==='vi'?vi:`${en} · ${vi}`; }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

/* ============ STORE (local-first, syncs when there's signal) ============
   Docs live at "kind/key" paths. Each kind maps to one Supabase table. */
const KINDS = {
 profile:{table:'profiles', key:r=>r.id, order:'created_at',
  toRow:(d)=>({id:d.id,name:d.name,color:d.color,created_at:iso(d.ts)}), fromRow:r=>({id:r.id,name:r.name,color:r.color,ts:ms(r.created_at)})},
 quiz:{table:'live_quiz', key:r=>r.id, limit:200, order:'created_at',
  toRow:(d)=>({id:d.id,created_by:d.by,question:d.q,options:d.options,correct:d.correct,status:d.status,kind:d.kind||'family',lang:d.lang||null,created_at:iso(d.ts)}),
  fromRow:r=>({id:r.id,by:r.created_by,q:r.question,options:r.options||[],correct:r.correct,status:r.status,kind:r.kind,lang:r.lang,ts:ms(r.created_at)})},
 notes:{table:'notes', key:r=>`${r.part}__${r.profile_id}`,
  toRow:(d)=>({part:d.part,profile_id:d.pid,text:d.text,updated_at:iso(d.ts)}), fromRow:r=>({part:r.part,pid:r.profile_id,text:r.text,ts:ms(r.updated_at)})},
 game:{table:'game_state', key:r=>r.profile_id,
  toRow:(d,key)=>({profile_id:key,data:d,updated_at:iso()}), fromRow:r=>r.data||{}},
 chat:{table:'chat', key:r=>r.id, limit:300, order:'created_at',
  toRow:(d)=>({id:d.id,profile_id:d.pid,text:d.text,created_at:iso(d.ts)}), fromRow:r=>({id:r.id,pid:r.profile_id,text:r.text,ts:ms(r.created_at)})},
 pred:{table:'predictions', key:r=>`${r.part}__${r.profile_id}`,
  toRow:(d)=>({part:d.part,profile_id:d.pid,words:d.words,hits:d.hits,updated_at:iso(d.ts)}), fromRow:r=>({part:r.part,pid:r.profile_id,words:r.words||[],hits:r.hits||[],ts:ms(r.updated_at)})},
 qa:{table:'quiz_answers', key:r=>`${r.quiz_id}__${r.profile_id}`,
  toRow:(d)=>({quiz_id:d.quiz,profile_id:d.pid,choice:d.choice,created_at:iso(d.ts)}), fromRow:r=>({quiz:r.quiz_id,pid:r.profile_id,choice:r.choice,ts:ms(r.created_at)})},
};
const FLUSH_ORDER=['profile','quiz','notes','game','chat','pred','qa']; /* parents before children (foreign keys) */

function view(prefix){ const out={}; for(const [p,d] of Object.entries(S.docs)) if(p.startsWith(prefix)) out[p]=d; for(const [p,it] of Object.entries(S.pending)) if(p.startsWith(prefix)) out[p]=it.data; return out; }
function roster(){ return Object.values(view('profile/')).filter(p=>p&&p.id).sort((a,b)=>(a.ts||0)-(b.ts||0)); }
function person(pid){ return roster().find(p=>p.id===pid) || {id:pid,name:'?',color:'#888'}; }
function me(){ return roster().find(p=>p.id===S.me) || null; }
let saveT; function saveLocal(){ clearTimeout(saveT); saveT=setTimeout(()=>{ LS.set('tc_docs',S.docs); LS.set('tc_pending',S.pending); },150); }
let flushT, flushing=false;
function write(path,data){
  const prev=S.pending[path]; S.pending[path]={data, v:(prev?prev.v:0)+1};
  saveLocal(); setSync(); clearTimeout(flushT); flushT=setTimeout(flush,700);
}
const isNetErr=e=>!e || !e.code || /fetch|network|load failed|timeout/i.test(e.message||'');
async function flush(){
  if(!SB||flushing||S.gate||S.dbState!=='on'||!navigator.onLine) { setSync(); return; }
  if(!Object.keys(S.pending).length){ setSync(); return; }
  flushing=true;
  try{
    for(const kind of FLUSH_ORDER){
      const K=KINDS[kind]; const items=Object.entries(S.pending).filter(([p])=>p.startsWith(kind+'/'));
      if(!items.length) continue;
      const rows=items.map(([p,it])=>K.toRow(it.data,p.slice(kind.length+1)));
      let {error}=await SB.from(K.table).upsert(rows);
      if(error && !isNetErr(error) && items.length>1){
        /* isolate the bad row so one rejected item can't block the whole outbox */
        error=null;
        for(let i=0;i<items.length;i++){ const r=await SB.from(K.table).upsert([rows[i]]); if(r.error){ if(isNetErr(r.error)){ error=r.error; break; } dropBad(items[i][0],r.error); items[i]=null; } }
        items.splice(0,items.length,...items.filter(Boolean));
      } else if(error && !isNetErr(error)){ dropBad(items[0][0],error); continue; }
      if(error) throw error;
      for(const [p,it] of items){ S.docs[p]=it.data; if(S.pending[p] && S.pending[p].v===it.v) delete S.pending[p]; }
    }
  }catch(e){ /* no signal: try again later */ }
  flushing=false; saveLocal(); setSync();
}
function dropBad(path,err){
  console.warn('sync rejected',path,err);
  if(err.code==='42501'){ /* RLS: this device isn't a member any more */ S.gate=true; LS.set('tc_member',null); render(); return; }
  delete S.pending[path];
  if(/family is full|\d+ people/.test(err.message||'')) toast(tx('The family list is full (20 people).','Danh sách gia đình đã đủ (20 người).'));
  else toast(tx('One change couldn’t be saved to the family.','Một thay đổi không lưu được.'));
}
setInterval(()=>{ if(Object.keys(S.pending).length) flush(); }, 15000);
window.addEventListener('online', ()=>{ setSync(); if(SB && !S.gate && S.dbState==='on'){ fetchAll(); flush(); } else if(SB) boot(); });
window.addEventListener('offline', setSync);
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && SB && S.dbState==='on' && navigator.onLine){ fetchAll(); flush(); } });

function setSync(){
  const el=$('sync'), t=$('sync-t'); const n=Object.keys(S.pending).length;
  let cls='ok', txt=u('synced');
  if(S.dbState==='none'){cls='wait';txt=u('local');}
  else if(!navigator.onLine){cls='off';txt=u('offline');}
  else if(S.dbState==='connecting'){cls='wait';txt=u('connecting');}
  else if(n||S.gate){cls='wait';txt=u('waiting');}
  el.className='pill '+cls; t.textContent=txt;
}
function replacePrefix(prefix, docs){
  for(const p of Object.keys(S.docs)) if(p.startsWith(prefix)) delete S.docs[p];
  for(const [k,d] of docs) S.docs[prefix+k]=d;
  saveLocal();
}
let fetching=false;
async function fetchAll(){
  if(!SB||fetching) return; fetching=true;
  try{
    await Promise.all(Object.entries(KINDS).map(async ([kind,K])=>{
      let q=SB.from(K.table).select('*');
      if(K.order) q=q.order(K.order,{ascending:false});
      if(K.limit) q=q.limit(K.limit);
      const {data,error}=await q; if(error) throw error;
      replacePrefix(kind+'/', data.map(r=>[K.key(r),K.fromRow(r)]));
    }));
    onData('all');
  }catch(e){ if(e && e.code==='42501'){ S.gate=true; render(); } }
  fetching=false;
}
function subscribe(){
  if(CHANNEL) return;
  CHANNEL=SB.channel('family');
  for(const [kind,K] of Object.entries(KINDS)){
    CHANNEL.on('postgres_changes',{event:'*',schema:'public',table:K.table},payload=>{
      if(payload.eventType==='DELETE'){ if(payload.old) delete S.docs[kind+'/'+K.key(payload.old)]; }
      else if(payload.new) S.docs[kind+'/'+K.key(payload.new)]=K.fromRow(payload.new);
      saveLocal(); onData(kind);
    });
  }
  CHANNEL.subscribe(status=>{ if(status==='SUBSCRIBED') fetchAll(); });
}

/* ============ CONNECT: anonymous sign-in → family code → sync ============ */
async function boot(){
  if(!window.supabase || !CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY || /PASTE/.test(CFG.SUPABASE_ANON_KEY)){ S.dbState='none'; setSync(); if(!me()) showPicker(); return; }
  if(!SB) SB=window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'tc_auth'}});
  let session=null;
  try{ ({data:{session}}=await SB.auth.getSession()); }catch(e){}
  const cached=LS.get('tc_member',null);
  if(session && cached===session.user.id){ startSync(); return; } /* joined before: works offline */
  if(!navigator.onLine){ S.dbState='connecting'; S.gate=true; S.gateErr=u('needSignal'); render(); return; }
  try{
    if(!session){ const r=await SB.auth.signInAnonymously(); if(r.error) throw r.error; session=r.data.session; }
    const {data,error}=await SB.from('members').select('user_id').eq('user_id',session.user.id).maybeSingle();
    if(error) throw error;
    if(data){ LS.set('tc_member',session.user.id); startSync(); return; }
    S.gate=true; S.gateErr=''; render();
  }catch(e){
    console.warn(e); S.gate=true;
    S.gateErr = /anonymous/i.test(e?.message||'') ? 'Anonymous sign-ins are turned off in Supabase (Authentication → Sign In / Providers).' : u('needSignal');
    render();
  }
}
function startSync(){
  S.gate=false; S.dbState='on'; render();
  subscribe(); fetchAll(); flush();
  if(!me()) showPicker();
}
async function joinFamily(code){
  if(S.joining) return; code=code.trim(); if(!code) return;
  if(!navigator.onLine){ S.gateErr=u('needSignal'); render(); return; }
  S.joining=true; S.gateErr=''; render();
  try{
    let {data:{session}}=await SB.auth.getSession();
    if(!session){ const r=await SB.auth.signInAnonymously(); if(r.error) throw r.error; session=r.data.session; }
    const {error}=await SB.functions.invoke('join',{body:{code}});
    if(error){ const st=error.context?.status; S.gateErr = st===403?u('wrongCode'): st?`Server error (${st}).`:u('needSignal'); }
    else { LS.set('tc_member',session.user.id); S.joining=false; startSync(); return; }
  }catch(e){ S.gateErr = /anonymous/i.test(e?.message||'') ? 'Anonymous sign-ins are turned off in Supabase.' : u('needSignal'); }
  S.joining=false; render();
}
function isIOSBrowser(){ return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1); }
const standalone=()=>window.matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
function renderGate(){
  return `<div class="gate"><div class="sheet"><h2>${u('joinH')}</h2><div class="saved">${u('joinSub')}</div>
   ${isIOSBrowser()&&!standalone()?`<div class="notice">${u('iosHint')}</div>`:''}
   <input id="code" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(u('joinPh'))}" aria-label="${esc(u('joinPh'))}">
   ${S.gateErr?`<div class="err" role="alert">${esc(S.gateErr)}</div>`:''}
   <button class="btn pri" id="join" ${S.joining?'disabled':''} style="padding:9px 16px;font-size:15px">${S.joining?'…':u('joinBtn')}</button></div></div>`;
}

/* ============ AI (Edge Function proxy) ============ */
const AIERR={offline:['No signal right now. AI needs a connection — notes and games still work.','Không có sóng. AI cần kết nối — ghi chú và trò chơi vẫn dùng được.'],
 rate_limited:['Too many questions at once. Wait a minute and try again.','Quá nhiều câu hỏi. Chờ một phút rồi thử lại.'], busy:['AI is busy right now. Try again in a moment.','AI đang bận. Thử lại sau.'],
 not_member:['This device needs to join the family again.','Máy này cần tham gia lại.'], not_signed_in:['Signing in… try again in a moment.','Đang đăng nhập… thử lại sau.'],
 no_api_key:['AI isn’t set up yet (the owner needs to add the API key secret).','AI chưa được cài đặt.'], too_large:['That’s too long. Try a shorter question.','Quá dài. Hãy hỏi ngắn hơn.'],
 upstream_error:['AI couldn’t answer right now. Try again.','AI chưa trả lời được. Thử lại.'], empty_completion:['No answer came back. Try a shorter question.','Không có câu trả lời.'], timeout:['That took too long. Try again when the signal is better.','Quá lâu. Thử lại khi sóng tốt hơn.']};
const aiErr=code=>{ const e=AIERR[code]||AIERR.upstream_error; return e[S.lang==='vi'?1:0]; };
async function callAI(system, messages, max_tokens=800){
  if(!SB || S.dbState!=='on' || !navigator.onLine) throw {code:'offline'};
  const call=SB.functions.invoke('ai',{body:{system,messages,max_tokens}});
  const timeout=new Promise((_,rej)=>setTimeout(()=>rej({code:'timeout'}),60000));
  const {data,error}=await Promise.race([call,timeout]);
  if(error){ let code=error.name==='FunctionsFetchError'?'offline':'upstream_error'; try{ const j=await error.context.json(); code=j.error||code; }catch(e){} throw {code}; }
  if(!data || !data.text) throw {code:'empty_completion'};
  return data.text;
}

/* ============ GENERIC UI ============ */
function avatar(p,cls=''){ const n=(p.name||'?').trim(); return `<span class="av ${cls}" style="background:${esc(p.color)}" aria-hidden="true">${esc(n.slice(0,1).toUpperCase())}</span>`; }
let toastT; function toast(msg){ const t=$('toast'); t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>t.hidden=true,2600); }
function timeAgo(ts){ const d=new Date(ts); return d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}); }
function toMin(t){ let [h,m]=t.split(':').map(Number); if(h<8) h+=12; return h*60+m; }
function nowMin(){ const d=new Date(); return d.getHours()*60+d.getMinutes(); }
function currentItem(){
  const all=PROGRAM.flatMap(s=>s.items); const n=nowMin();
  for(let i=0;i<all.length;i++){ const st=toMin(all[i].t), en=i+1<all.length?toMin(all[i+1].t):toMin('4:10'); if(n>=st&&n<en) return all[i]; }
  return null;
}
/* Every note-able part with its time window (symposium parts share the symposium's window). */
const PARTS=(()=>{ const out={}; const all=PROGRAM.flatMap(s=>s.items.map(it=>({it,session:s.session})));
  all.forEach(({it,session},i)=>{ const end=i+1<all.length?all[i+1].it.t:'4:10';
    if(it.type==='talk') out[it.id]={id:it.id,en:it.en,vi:it.vi,start:it.t,end,session};
    if(it.type==='sym') it.parts.forEach(p=>out[p.id]={id:p.id,en:p.en,vi:p.vi,start:it.t,end,session,sym:it}); });
  return out; })();

function renderChrome(){
  document.documentElement.lang = S.lang==='vi'?'vi':'en';
  for(const l of ['en','both','vi']) $('lang-'+l).setAttribute('aria-pressed', String(S.lang===l));
  for(const b of document.querySelectorAll('nav.tabs button')){ b.querySelector('span').textContent=u(b.dataset.tab); if(b.dataset.tab===S.tab) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); }
  const m=me(); $('me-chip').innerHTML = m? `${avatar(m)}<span>${esc(m.name)}</span>` : `<span class="av" style="background:var(--muted)">?</span><span>${S.lang==='vi'?'Chọn':'Pick'}</span>`;
  $('me-chip').hidden=S.gate;
  document.querySelector('nav.tabs').hidden=S.gate;
  $('send').textContent=u('send');
  $('compose').placeholder = S.tab==='ask'?u('askPh'):u('chatPh');
  const showC = !S.gate && (S.tab==='chat'||S.tab==='ask');
  $('composer').hidden=!showC; document.body.classList.toggle('has-composer',showC);
  $('clock').textContent = new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  const up=$('update-btn'); if(up) up.textContent=u('update');
  updateChatBadge(); setSync();
}

function render(){
  renderChrome();
  const el=$('main');
  if(S.gate){ el.innerHTML=renderGate(); return; }
  const local = S.dbState==='none' ? `<div class="notice">${u('localMode')}</div>` : '';
  if(S.tab==='program') el.innerHTML=local+renderProgram();
  else if(S.tab==='games') el.innerHTML=renderGames();
  else if(S.tab==='words') el.innerHTML=renderWords();
  else if(S.tab==='chat') { el.innerHTML=renderChat(); markChatSeen(); scrollEnd(); }
  else if(S.tab==='ask') { el.innerHTML=renderAsk(); scrollEnd(); }
  if(S.tab==='program'||S.tab==='games') fillNotes();
}
function scrollEnd(){ requestAnimationFrame(()=>window.scrollTo(0,document.body.scrollHeight)); }
function rerenderKeepScroll(){ const y=window.scrollY; render(); window.scrollTo(0,y); }

/* ============ PROGRAM ============ */
function vocabChips(key){
  const v=VOCAB[key]; if(!v) return '';
  return `<div class="chips">${v.w.map((w,i)=>vocabChipsOne(key+'_'+i)).join('')}</div>`;
}
function vocabChipsOne(id){ const [key,i]=id.split('_'); const w=VOCAB[key].w[+i]; const open=S.open[id];
  return `<button class="chip ${open?'open':''}" data-chip="${id}" lang="vi">${esc(w[0])}${open?` <span class="en">· ${esc(w[1])} · ${esc(w[2])}</span>`:''}</button>`; }
function noteBlock(pid, label){
  return `<div class="note-mine">
    <label class="lbl" for="note-${pid}">${me()?avatar(me()):''}${label||u('myNotes')}</label>
    <textarea class="note" id="note-${pid}" data-note="${pid}" placeholder="${esc(u('notePh'))}"></textarea>
    <div class="note-actions"><button class="btn" data-tryvi="${pid}">${u('tryVi')}</button><span class="saved" id="sv-${pid}"></span></div>
  </div>
  <div class="fam" id="fam-${pid}"></div>`;
}
function rqBlock(n){ const q=RQ[n]; if(!q) return ''; return `<div class="rq"><b>${u('listenFor')} · Q${n}</b>${L(q.en,q.vi)}</div>`; }
function renderProgram(){
  const cur=currentItem();
  let h=`<section class="theme"><div class="eyebrow">${S.lang==='vi'?'Hội nghị vòng quanh 2026–2027':'Circuit Assembly 2026–2027'}</div>
   <h1>${L(THEME.en,THEME.vi)}</h1><div class="ref">${S.lang==='vi'?THEME.refVi:S.lang==='en'?THEME.refEn:THEME.refEn+' · '+THEME.refVi}</div></section>`;
  if(cur && cur.id){ h+=`<div class="now"><span><b>${u('now')}:</b> ${esc(S.lang==='vi'?cur.vi:cur.en)}</span><button data-jump="${cur.id}">${u('jump')}</button></div>`; }
  for(const s of PROGRAM){
    h+=`<div class="session-h"><h2>${u(s.session==='am'?'morning':'afternoon')}</h2></div><div class="prog">`;
    for(const it of s.items){
      const isNow = cur===it;
      if(it.type==='music'){ h+=`<div class="slim"><span class="tm">${it.t}</span>${u('music')}</div>`; continue; }
      if(it.type==='song'){ h+=`<div class="slim"><span class="tm">${it.t}</span><a href="${SONG_URL(it.k,S.lang==='vi'?'vi':'en')}" target="_blank" rel="noopener">${u('song')} ${it.n}</a>${it.extra?' '+u(it.extra):''}</div>`; continue; }
      const label = it.label ? (S.lang==='vi'?it.label[1]:S.lang==='en'?it.label[0]:it.label[0]+' · '+it.label[1]) : (it.type==='sym'?(S.lang==='vi'?UI.symposium[1]:S.lang==='en'?UI.symposium[0]:UI.symposium[0]+' · '+UI.symposium[1]):'');
      h+=`<div class="part ${isNow?'is-now':''}" id="p-${it.id}"><div class="tm">${it.t}</div><div class="card">
        <div class="kicker">${esc(label)}${isNow?`<span class="nowtag">${u('now')}</span>`:''}</div>
        <h3>${L(it.en,it.vi)}</h3>${rqBlock(it.rq)}${vocabChips(it.voc)}`;
      if(it.type==='talk') h+=noteBlock(it.id);
      h+=`</div></div>`;
      if(it.type==='sym'){
        h+=`<div class="part"><div class="tm"></div><div class="subparts">`;
        it.parts.forEach((p,i)=>{ h+=`<div class="card" id="p-${p.id}"><div class="kicker">${u('part')} ${i+1}</div><h3>${L(p.en,p.vi)}</h3>${noteBlock(p.id)}</div>`; });
        h+=`</div></div>`;
      }
    }
    h+=`</div>`;
  }
  return h;
}
function notesFor(part){ return Object.values(view('notes/')).filter(n=>n && n.part===part && (n.text||'').trim()); }
function fillNotes(){ for(const ta of document.querySelectorAll('textarea[data-note]')) updateNote(ta.dataset.note); }
function updateNote(part){
  const ta=$('note-'+part); if(!ta) return;
  const mine = S.me ? view('notes/')[`notes/${part}__${S.me}`] : null;
  if(document.activeElement!==ta){ ta.value = mine?mine.text:''; autoGrow(ta); }
  const sv=$('sv-'+part); if(sv){ const pend=!!S.pending[`notes/${part}__${S.me}`]; sv.textContent = mine&&mine.text ? (pend?u('savedHere'):u('saved')) : ''; }
  const fam=$('fam-'+part); if(!fam) return;
  const others = notesFor(part).filter(n=>n.pid!==S.me).sort((a,b)=>a.ts-b.ts);
  fam.innerHTML = `<div class="fam-h">${u('family')} (${others.length})</div>` + (others.length? others.map(n=>{ const p=person(n.pid);
    return `<div class="fnote">${avatar(p)}<div style="min-width:0"><div class="who">${esc(p.name)} <span>${timeAgo(n.ts)}</span></div><p>${esc(n.text)}</p></div></div>`; }).join('') : `<div class="saved">${u('nobody')}</div>`);
}
function autoGrow(ta){ ta.style.height='auto'; ta.style.height=Math.max(86,ta.scrollHeight+2)+'px'; }
const noteTimers={};
document.addEventListener('input', e=>{
  const ta=e.target.closest('textarea[data-note]'); if(ta){ autoGrow(ta);
    if(!S.me){ showPicker(); return; }
    const part=ta.dataset.note; clearTimeout(noteTimers[part]);
    noteTimers[part]=setTimeout(()=>{ write(`notes/${part}__${S.me}`, {pid:S.me, part, text:ta.value.slice(0,6000), ts:Date.now()}); const sv=$('sv-'+part); if(sv) sv.textContent=u('savedHere'); if(S.tab==='games') renderScoreOnly(); },600);
  }
  if(e.target.id==='compose'){ const c=e.target; c.style.height='auto'; c.style.height=Math.min(120,c.scrollHeight)+'px'; }
});

/* ============ GAMES: shared ============ */
function gameDoc(pid){ return view('game/')['game/'+pid] || {bingo:{am:[],pm:[]}, verses:[], custom:[], wm:0}; }
function myGame(){ return structuredClone(gameDoc(S.me)); }
function saveGame(g){ write('game/'+S.me, g); }
function seeded(str){ let h=2166136261; for(const c of str) h=Math.imul(h^c.charCodeAt(0),16777619); return ()=>{ h=Math.imul(h^(h>>>15),2246822507); h=Math.imul(h^(h>>>13),3266489909); return ((h^=h>>>16)>>>0)/4294967296; }; }
function bingoLayout(pid,sess){ const words=BINGO[sess].map((w,i)=>i); const r=seeded(pid+sess); for(let i=words.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [words[i],words[j]]=[words[j],words[i]]; } words.splice(12,0,-1); return words; }
const LINES=(()=>{ const L=[]; for(let i=0;i<5;i++){ L.push([0,1,2,3,4].map(c=>i*5+c)); L.push([0,1,2,3,4].map(r=>r*5+i)); } L.push([0,6,12,18,24]); L.push([4,8,12,16,20]); return L; })();
function bingoLines(pid,sess,marked){ const lay=bingoLayout(pid,sess); const on=new Set(marked); const hit=pos=>lay[pos]===-1||on.has(lay[pos]); return LINES.filter(l=>l.every(hit)); }
function quizzes(){ return Object.values(view('quiz/')).filter(q=>q&&q.id).sort((a,b)=>b.ts-a.ts); }
function answersFor(qid){ return Object.values(view('qa/')).filter(a=>a&&a.quiz===qid); }
function myAnswer(qid){ return view('qa/')[`qa/${qid}__${S.me}`]; }
function predsFor(part){ return Object.values(view('pred/')).filter(p=>p&&p.part===part); }
function stats(pid){
  const g=gameDoc(pid);
  const notes=Object.values(view('notes/')).filter(n=>n.pid===pid && (n.text||'').trim().length>=10).length;
  const marks=(g.bingo?.am?.length||0)+(g.bingo?.pm?.length||0);
  const lines=bingoLines(pid,'am',g.bingo?.am||[]).length+bingoLines(pid,'pm',g.bingo?.pm||[]).length;
  const verses=(g.verses||[]).length+(g.custom||[]).length;
  const predHits=Object.values(view('pred/')).filter(p=>p.pid===pid).reduce((n,p)=>n+(p.hits||[]).length,0);
  let quizRight=0, aiRight=0;
  for(const a of Object.values(view('qa/'))){ if(a.pid!==pid) continue; const q=view('quiz/')['quiz/'+a.quiz]; if(!q) continue;
    if(q.kind==='family'){ if(q.status==='revealed' && a.choice===q.correct) quizRight++; } else if(a.choice===q.correct) aiRight++; }
  const raceBest=g.race?.best||0, memPlays=g.mem?.plays||0, whoPts=Object.values(g.who||{}).reduce((a,b)=>a+b,0), whoCount=Object.values(g.who||{}).filter(v=>v>0).length, toneRight=g.tone?.right||0;
  return {notes,marks,lines,verses,wm:g.wm||0,predHits,quizRight,aiRight,raceBest,memPlays,whoPts,whoCount,toneRight};
}
function scoreFor(pid){
  const s=stats(pid);
  return s.notes*3 + s.marks + s.lines*5 + s.verses*2 + s.wm*2 + s.predHits*2 + s.quizRight*3 + s.aiRight*2
    + Math.floor(s.raceBest/2) + Math.min(s.memPlays,5)*2 + s.whoPts + Math.min(s.toneRight,20);
}
function badgesFor(pid){
  const s=stats(pid);
  const on={bingo:s.lines>0, hunter:s.verses>=5, notes5:s.notes>=5, predictor:s.predHits>=3, quiz:(s.quizRight+s.aiRight)>=3, racer:s.raceBest>=10, memory:s.memPlays>=1, who:s.whoCount>=4, tones:s.toneRight>=10};
  return BADGES.map(b=>({...b,on:!!on[b.id]}));
}
function renderScore(){
  const ppl=roster(); if(!ppl.length) return '';
  const rows=ppl.map(p=>({p,s:scoreFor(p.id),b:badgesFor(p.id).filter(b=>b.on)})).sort((a,b)=>b.s-a.s); const max=Math.max(10,...rows.map(r=>r.s));
  return `<section class="card score" id="scorebox"><div class="kicker">${u('score')}</div>${rows.map(r=>`<div class="srow">${avatar(r.p)}<div style="min-width:0"><div style="font-size:13px;font-weight:600">${esc(r.p.name)} <span aria-label="badges">${r.b.map(b=>b.icon).join('')}</span></div><div class="bar"><i style="width:${Math.round(r.s/max*100)}%;background:${esc(r.p.color)}"></i></div></div><b>${r.s}</b></div>`).join('')}
   <div class="saved">${S.lang==='vi'?'Ghi chú 3 · ô bingo 1 · một hàng 5 · câu Kinh Thánh 2 · ghép từ 2 · đoán trúng 2 · đố vui 3 (AI 2) · và các trò khác':'Note 3 · bingo square 1 · bingo line 5 · scripture 2 · word match 2 · prediction hit 2 · quiz 3 (AI quiz 2) · plus the other games'}</div></section>`;
}
function renderScoreOnly(){ const b=$('scorebox'); if(b) b.outerHTML=renderScore(); }
const GTABS=['bingo','verses','match','review','predict','quiz','race','memory','whoami','tones','badges'];
function renderGames(){
  if(!GTABS.includes(S.gtab)) S.gtab='bingo';
  let h=renderScore()+`<div class="subnav" role="group">${GTABS.map(t=>`<button data-gtab="${t}" aria-pressed="${S.gtab===t}">${u(t)}</button>`).join('')}</div>`;
  if(!S.me) return h+`<div class="empty">${u('who')}</div>`;
  const g=gameDoc(S.me);
  if(S.gtab==='bingo'){
    const lay=bingoLayout(S.me,S.bsess); const marked=new Set(g.bingo?.[S.bsess]||[]); const win=new Set(bingoLines(S.me,S.bsess,[...marked]).flat());
    h+=`<p class="hint">${u('bingoHint')}</p><div class="subnav" role="group"><button data-bsess="am" aria-pressed="${S.bsess==='am'}">${u('morning')}</button><button data-bsess="pm" aria-pressed="${S.bsess==='pm'}">${u('afternoon')}</button></div>
    <div class="bingo">${lay.map((wi,pos)=>{ if(wi===-1) return `<div class="tile free ${win.has(pos)?'win':''}">${u('free')}</div>`;
      const w=BINGO[S.bsess][wi], en=BINGO_EN[w]||''; const txt = S.lang==='en'? esc(en) : S.lang==='vi'? `<span lang="vi">${esc(w)}</span>` : `<span lang="vi">${esc(w)}</span><small>${esc(en)}</small>`;
      return `<button class="tile ${marked.has(wi)?'on':''} ${win.has(pos)?'win':''}" data-tile="${wi}">${txt}</button>`; }).join('')}</div>`;
  }
  if(S.gtab==='verses'){
    const got=new Set(g.verses||[]);
    h+=`<p class="hint">${u('versesHint')}</p><div style="display:grid;gap:8px">${VERSES.map(v=>`<label class="verse ${got.has(v.id)?'done':''}" for="v-${v.id}"><input type="checkbox" id="v-${v.id}" data-verse="${v.id}" ${got.has(v.id)?'checked':''}><span class="vtxt">${L(v.en,v.vi)}${v.note?`<small>${esc(S.lang==='vi'?v.note[1]:v.note[0])}</small>`:''}</span><a class="btn" href="${BC(v.doc,v.a,v.b,S.lang==='vi'?'vi':'en')}" target="_blank" rel="noopener">${u('read')}</a></label>`).join('')}
    ${(g.custom||[]).map((c,i)=>`<div class="verse done"><input type="checkbox" checked disabled aria-label="${esc(c)}"><span class="vtxt">${esc(c)}</span><button class="btn" data-delverse="${i}">✕</button></div>`).join('')}
    <div class="addrow"><input id="verse-add" placeholder="${esc(u('addVerse'))}" maxlength="60"><button class="btn pri" id="verse-add-btn">${u('add')}</button></div></div>`;
  }
  if(S.gtab==='match'){ h+=`<p class="hint">${u('matchHint')}</p><div id="matchbox"></div>`; setTimeout(()=>{ if(M) drawMatch(); else startMatch(); },0); }
  if(S.gtab==='review'){
    h+=`<p class="hint">${u('reviewHint')}</p><div style="display:grid;gap:10px">${[1,2,3,4,5].map(n=>`<div class="card"><div class="kicker">Q${n}</div><h3 style="font-size:16px">${L(RQ[n].en,RQ[n].vi)}</h3><div class="chips">${RQ[n].refs.map(r=>{const v=VERSES.find(x=>x.id===r);return `<a class="chip" href="${BC(v.doc,v.a,v.b,S.lang==='vi'?'vi':'en')}" target="_blank" rel="noopener">${esc(S.lang==='vi'?v.vi:v.en)}</a>`}).join('')}</div>${noteBlock('rq'+n,u('yourAnswer'))}</div>`).join('')}</div>`;
  }
  if(S.gtab==='predict') h+=renderPredict();
  if(S.gtab==='quiz') h+=renderQuiz();
  if(S.gtab==='race'){ h+=`<p class="hint">${u('raceHint')}</p><div id="racebox"></div>`; setTimeout(drawRace,0); }
  if(S.gtab==='memory'){ h+=`<p class="hint">${u('memHint')}</p><div id="membox"></div>`; setTimeout(()=>{ if(!MEM) startMem(); else drawMem(); },0); }
  if(S.gtab==='whoami'){ h+=`<p class="hint">${u('whoHint')}</p><div id="whobox"></div><p class="small" style="margin-top:12px">${u('whoVerified')}</p>`; setTimeout(()=>{ if(!WHO_S) startWho(); else drawWho(); },0); }
  if(S.gtab==='tones'){ h+=`<p class="hint">${u('tonesHint')}</p><div id="tonebox"></div>`; setTimeout(()=>{ if(!TONE_S) nextTone(); else drawTone(); },0); }
  if(S.gtab==='badges') h+=renderBadges();
  return h;
}

/* ---- Word Match (prototype) ---- */
let M=null;
function allWords(){ return Object.values(VOCAB).flatMap(v=>v.w); }
function startMatch(){
  const pick=shuffle(allWords().filter(w=>w[0].length<26)).slice(0,6);
  M={pick,right:shuffle(pick.map((w,i)=>i)),sel:null,done:new Set()}; drawMatch();
}
function drawMatch(){
  const box=$('matchbox'); if(!box||!M) return;
  const fin=M.done.size===M.pick.length;
  box.innerHTML=`<div class="match"><div class="col">${M.pick.map((w,i)=>`<button class="mbtn ${M.done.has(i)?'ok':''} ${M.sel===i?'sel':''}" data-ml="${i}" lang="vi" ${M.done.has(i)?'disabled':''}>${esc(w[0])}</button>`).join('')}</div>
   <div class="col">${M.right.map(i=>`<button class="mbtn ${M.done.has(i)?'ok':''}" data-mr="${i}" ${M.done.has(i)?'disabled':''}>${esc(M.pick[i][2])}</button>`).join('')}</div></div>
   ${fin?`<div class="note-actions" style="margin-top:12px"><b>${u('wellDone')} +2</b><button class="btn gold" id="match-new">${u('newRound')}</button></div>`:''}`;
}

/* ---- Prediction Cards ---- */
function defaultPredPart(){
  const n=nowMin(); const list=Object.values(PARTS);
  /* the talk happening now, else the next one coming up, else the last one */
  return (list.find(p=>n>=toMin(p.start)&&n<toMin(p.end)) || list.find(p=>toMin(p.start)>n) || list[list.length-1]).id;
}
function renderPredict(){
  const part=S.predPart||(S.predPart=defaultPredPart()); const P=PARTS[part];
  const mine=view('pred/')[`pred/${part}__${S.me}`]||{part,pid:S.me,words:[],hits:[]};
  const ended=nowMin()>=toMin(P.end); const showAll=ended||S.predReveal[part];
  let h=`<p class="hint">${u('predictHint')}</p>
   <label class="lbl" for="pred-part">${u('talkPick')}</label>
   <select id="pred-part" class="opt" style="width:100%;margin:4px 0 12px">${Object.values(PARTS).map(p=>`<option value="${p.id}" ${p.id===part?'selected':''}>${esc(p.start+' · '+(p.sym?tx(p.sym.en,p.sym.vi)+' — ':'')+tx(p.en,p.vi))}</option>`).join('')}</select>
   <section class="card"><div class="kicker">${u('myWords')} (${mine.words.length}/3)</div>`;
  if(mine.words.length) h+=`<div class="hint" style="margin:0">${u('tapHeard')}</div><div class="chips">${mine.words.map((w,i)=>`<button class="pred-word ${mine.hits.includes(i)?'hit':''}" data-predhit="${i}" lang="vi">${mine.hits.includes(i)?'✓ ':''}${esc(w)}</button>`).join('')}${mine.hits.length?'':`<button class="btn" data-predclear="1">✕</button>`}</div>`;
  if(mine.words.length<3){
    h+=`<div class="addrow"><input id="pred-add" maxlength="30" placeholder="${esc(u('addWord'))}" lang="vi"><button class="btn pri" id="pred-add-btn">${u('add')}</button></div>
     <div class="small">${u('suggest')}:</div><div class="chips">${PREDICT_SUGGEST.filter(w=>!mine.words.includes(w)).map(w=>`<button class="chip" data-predsug="${esc(w)}" lang="vi">${esc(w)}</button>`).join('')}</div>`;
  }
  h+=`</section><section class="card" style="margin-top:10px"><div class="kicker">${u('othersCards')}</div>`;
  const others=predsFor(part).filter(p=>p.pid!==S.me && p.words.length);
  if(!showAll) h+=`<div class="row"><span class="small">${u('hiddenUntil')} (${P.end}) · ${others.length} ✍️</span><span class="spacer"></span><button class="btn" data-predshow="${part}">${u('showNow')}</button></div>`;
  else h+= others.length? others.map(p=>{ const pp=person(p.pid); return `<div class="fnote">${avatar(pp)}<div><div class="who">${esc(pp.name)} <span>+${(p.hits||[]).length*2}</span></div><div class="chips">${p.words.map((w,i)=>`<span class="pred-word ${(p.hits||[]).includes(i)?'hit':''}" lang="vi">${esc(w)}</span>`).join('')}</div></div></div>`; }).join('') : `<div class="saved">${u('nobody')}</div>`;
  return h+`</section>`;
}
function predSave(mut){
  const part=S.predPart; const key=`pred/${part}__${S.me}`;
  const cur=structuredClone(view('pred/')[key]||{part,pid:S.me,words:[],hits:[]});
  mut(cur); cur.ts=Date.now(); write(key,cur); rerenderKeepScroll();
}
function predAdd(w){ w=(w||'').trim().slice(0,30); if(!w) return; predSave(c=>{ if(c.words.length<3 && !c.words.includes(w)) c.words.push(w); }); }

/* ---- Live Family Quiz + AI Lunch / Ride-home Quiz ---- */
function renderQuiz(){
  const all=quizzes(); const fam=all.filter(q=>q.kind==='family'); const ai=all.filter(q=>q.kind!=='family');
  let h=`<p class="hint">${u('quizHint')}</p>`;
  if(S.quizForm){
    h+=`<section class="card qcard"><div class="kicker">${u('newQ')}</div>
     <textarea id="qf-q" class="opt" rows="2" maxlength="300" placeholder="${esc(u('qPh'))}"></textarea>
     <div class="small">${u('markRight')}</div>
     ${[0,1,2,3].map(i=>`<div class="addrow"><button class="btn ${i===0?'gold':''}" data-qfright="${i}" aria-label="right answer ${i+1}">✓</button><input id="qf-o${i}" maxlength="80" placeholder="${esc(u('optPh'))} ${i+1}${i>1?' (optional)':''}"></div>`).join('')}
     <div class="row"><button class="btn pri" id="qf-post">${u('post')}</button><button class="btn" id="qf-cancel">${u('cancel')}</button></div></section>`;
  } else h+=`<div class="row" style="margin-bottom:10px"><button class="btn pri" id="qf-open">+ ${u('newQ')}</button></div>`;
  h+= fam.length? `<div style="display:grid;gap:10px">${fam.slice(0,20).map(quizCard).join('')}</div>` : `<div class="saved">${u('noQ')}</div>`;
  h+=`<div class="session-h"><h2>AI</h2><span>${u('aiQuizHint')}</span></div>
   <div class="row" style="margin-bottom:10px"><button class="btn gold" data-aiquiz="lunch" ${S.aiQuizBusy?'disabled':''}>${S.aiQuizBusy==='lunch'?u('making'):u('lunchQuiz')}</button><button class="btn gold" data-aiquiz="ride" ${S.aiQuizBusy?'disabled':''}>${S.aiQuizBusy==='ride'?u('making'):u('rideQuiz')}</button></div>`;
  if(ai.length) h+=`<div style="display:grid;gap:10px">${ai.slice(0,15).map(quizCard).join('')}</div>`;
  return h;
}
function quizCard(q){
  const mineQ=q.by===S.me && q.kind==='family'; const ans=answersFor(q.id); const my=myAnswer(q.id);
  const revealed = q.kind==='family' ? q.status==='revealed' : !!my;
  const by = q.kind==='family' ? person(q.by) : {name:q.kind==='lunch'?u('lunchQuiz'):u('rideQuiz'),color:'var(--gold)'};
  let h=`<section class="card qcard"><div class="fnote">${avatar(by)}<div><div class="who">${esc(by.name)} <span>${timeAgo(q.ts)} · ${ans.length} ${u('answered')}</span></div></div></div>
   <h3 style="font-size:16px">${esc(q.q)}</h3><div class="grid2">`;
  h+=q.options.map((o,i)=>{ let cls=''; if(revealed&&i===q.correct) cls='ok'; else if(revealed&&my&&my.choice===i) cls='no'; else if(my&&my.choice===i) cls='sel';
    const who=revealed? ans.filter(a=>a.choice===i).map(a=>avatar(person(a.pid))).join('') : '';
    return `<button class="opt ${cls}" data-qans="${esc(q.id)}" data-qi="${i}" ${(mineQ||revealed)?'disabled':''}>${esc(o)} ${who}</button>`; }).join('');
  h+=`</div>`;
  if(mineQ && !revealed) h+=`<div class="row"><span class="small">${u('yourQ')}</span><span class="spacer"></span><button class="btn gold" data-qreveal="${esc(q.id)}">${u('reveal')}</button></div>`;
  else if(q.kind==='family' && my && !revealed) h+=`<div class="small">${u('waitReveal')}</div>`;
  return h+`</section>`;
}
let qfRight=0;
function postQuiz(){
  const q=$('qf-q').value.trim(); const opts=[0,1,2,3].map(i=>$('qf-o'+i).value.trim());
  const keep=opts.map((o,i)=>[o,i]).filter(([o])=>o);
  if(!q || keep.length<2){ toast(tx('Add a question and at least 2 answers.','Thêm câu hỏi và ít nhất 2 đáp án.')); return; }
  const correct=keep.findIndex(([,i])=>i===qfRight); if(correct<0){ toast(u('markRight')); return; }
  const id=newId(); write('quiz/'+id,{id,by:S.me,q:q.slice(0,300),options:keep.map(([o])=>o),correct,status:'open',kind:'family',ts:Date.now()});
  S.quizForm=false; qfRight=0; render();
}
async function makeAIQuiz(kind){
  const sess=kind==='lunch'?'am':'pm';
  const parts=Object.values(PARTS).filter(p=>p.session===sess);
  const notes=parts.flatMap(p=>notesFor(p.id).map(n=>`[${p.en}] ${person(n.pid).name}: ${n.text}`));
  if(!notes.length){ toast(u('needNotes')); return; }
  S.aiQuizBusy=kind; render();
  const lang=S.lang==='vi'?'vi':'en';
  const system=`You write a short, kind quiz for a family of Jehovah's Witnesses at a circuit assembly, using ONLY the family's own notes below. Write in ${lang==='vi'?'simple, respectful Vietnamese (anh/chị level)':'simple English'}. Do not quote publications or song lyrics; do not invent facts that are not in the notes.
Return ONLY JSON, no other text: {"questions":[{"q":"question (max 160 chars)","options":["a","b","c","d"],"answer":0}]} with exactly 5 questions, 4 short options each (max 60 chars), answer = index of the right option. Vary which index is right.`;
  try{
    const text=await callAI(system,[{role:'user',content:'FAMILY NOTES:\n'+notes.join('\n').slice(0,15000)}],1200);
    const m=text.match(/\{[\s\S]*\}/); const data=JSON.parse(m?m[0]:text);
    const qs=(data.questions||[]).filter(q=>q&&q.q&&Array.isArray(q.options)&&q.options.length>=2&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length).slice(0,5);
    if(!qs.length) throw {code:'empty_completion'};
    const base=Date.now();
    qs.reverse().forEach((q,i)=>{ const id=newId(); write('quiz/'+id,{id,by:S.me,q:String(q.q).slice(0,300),options:q.options.slice(0,4).map(o=>String(o).slice(0,80)),correct:q.answer,status:'open',kind,lang,ts:base+i}); });
  }catch(e){ toast(e&&e.code?aiErr(e.code):aiErr('upstream_error')); }
  S.aiQuizBusy=null; if(S.tab==='games') rerenderKeepScroll();
}

/* ---- Bible Book Race ---- */
let RACE=null, raceT=null;
function startRace(){
  const dir=LS.get('tc_racedir','vi2en');
  RACE={dir,score:0,left:60,q:null,done:false,wrong:null}; nextRace(); clearInterval(raceT);
  raceT=setInterval(()=>{ if(!RACE||RACE.done) return clearInterval(raceT); RACE.left--; if(RACE.left<=0) endRace(); else { const t=$('race-t'); if(t) t.textContent=RACE.left+'s'; else if(S.gtab!=='race'||S.tab!=='games'){ /* left the game */ } } },1000);
  drawRace();
}
function nextRace(){ const ans=Math.floor(Math.random()*BOOKS.length); const opts=shuffle([ans,...shuffle(BOOKS.map((b,i)=>i).filter(i=>i!==ans)).slice(0,3)]); RACE.q={ans,opts}; RACE.wrong=null; }
function endRace(){ RACE.done=true; RACE.left=0; clearInterval(raceT);
  if(S.me){ const g=myGame(); g.race=g.race||{best:0,plays:0}; g.race.plays++; if(RACE.score>g.race.best){ g.race.best=RACE.score; } saveGame(g); }
  drawRace(); renderScoreOnly(); }
function drawRace(){
  const box=$('racebox'); if(!box) return; const g=gameDoc(S.me); const best=g.race?.best||0;
  const dir=LS.get('tc_racedir','vi2en');
  if(!RACE||RACE.done){
    box.innerHTML=`${RACE?`<div class="card" style="margin-bottom:10px"><div class="big">${RACE.score}</div><div>${u('timeUp')}</div></div>`:''}
     <div class="subnav" role="group"><button data-racedir="vi2en" aria-pressed="${dir==='vi2en'}">VI → EN</button><button data-racedir="en2vi" aria-pressed="${dir==='en2vi'}">EN → VI</button></div>
     <div class="row"><button class="btn pri" id="race-start" style="padding:9px 18px;font-size:15px">${RACE?u('again'):u('start')}</button><span class="small">${u('best')}: ${best}</span></div>
     <p class="small" style="margin-top:12px">${tx('Vietnamese book names from the Bible index on wol.jw.org.','Tên sách theo mục lục Kinh Thánh trên wol.jw.org.')}</p>`;
    return;
  }
  const [from,to]=RACE.dir==='vi2en'?[1,0]:[0,1]; const b=BOOKS[RACE.q.ans];
  box.innerHTML=`<div class="row" style="margin-bottom:8px"><span class="timer" id="race-t">${RACE.left}s</span><span class="spacer"></span><b>${RACE.score}</b></div>
   <div class="card" style="text-align:center"><div class="big" ${from===1?'lang="vi"':''}>${esc(b[from])}</div></div>
   <div class="grid2" style="margin-top:10px">${RACE.q.opts.map(i=>`<button class="opt ${RACE.wrong===i?'no':''}" data-race="${i}" ${to===1?'lang="vi"':''}>${esc(BOOKS[i][to])}</button>`).join('')}</div>`;
}

/* ---- Memory Flip ---- */
let MEM=null, memT=null;
function startMem(){
  const pick=shuffle(allWords().filter(w=>w[0].length<=16 && w[2].length<=22)).slice(0,6);
  const cards=shuffle(pick.flatMap((w,i)=>[{p:i,t:w[0],vi:true},{p:i,t:w[2],vi:false}]));
  MEM={cards,up:[],gone:new Set(),moves:0,start:0,end:0,lock:false}; clearInterval(memT); drawMem();
}
function drawMem(){
  const box=$('membox'); if(!box||!MEM) return; const g=gameDoc(S.me); const best=g.mem?.best;
  const secs=MEM.start?Math.round(((MEM.end||Date.now())-MEM.start)/1000):0; const fin=MEM.gone.size===6;
  box.innerHTML=`<div class="row" style="margin-bottom:8px"><span class="timer" id="mem-t">${secs}s</span><span class="small">${MEM.moves} ${u('moves')}</span><span class="spacer"></span><span class="small">${u('best')}: ${best?best+'s':'—'}</span></div>
   <div class="mem">${MEM.cards.map((c,i)=>{ const up=MEM.up.includes(i), gone=MEM.gone.has(c.p);
     return `<button class="mcard ${gone?'gone':up?'up':''}" data-mem="${i}" ${gone?'disabled':''} ${c.vi?'lang="vi"':''} aria-label="${up||gone?esc(c.t):'card '+(i+1)}">${up||gone?esc(c.t):'?'}</button>`; }).join('')}</div>
   ${fin?`<div class="row" style="margin-top:12px"><b>${u('wellDone')} ${secs}s</b><button class="btn gold" id="mem-new">${u('again')}</button></div>`:''}`;
}
function flipMem(i){
  if(!MEM||MEM.lock||MEM.up.includes(i)||MEM.gone.has(MEM.cards[i].p)) return;
  if(!MEM.start){ MEM.start=Date.now(); memT=setInterval(()=>{ const t=$('mem-t'); if(t&&MEM&&!MEM.end) t.textContent=Math.round((Date.now()-MEM.start)/1000)+'s'; },1000); }
  MEM.up.push(i);
  if(MEM.up.length===2){ MEM.moves++; const [a,b]=MEM.up.map(x=>MEM.cards[x]);
    if(a.p===b.p && a.vi!==b.vi){ MEM.gone.add(a.p); MEM.up=[];
      if(MEM.gone.size===6){ MEM.end=Date.now(); clearInterval(memT); const secs=Math.max(1,Math.round((MEM.end-MEM.start)/1000));
        if(S.me){ const g=myGame(); g.mem=g.mem||{best:0,plays:0}; g.mem.plays++; if(!g.mem.best||secs<g.mem.best) g.mem.best=secs; saveGame(g); setTimeout(renderScoreOnly,50); } } }
    else { MEM.lock=true; setTimeout(()=>{ if(MEM){ MEM.up=[]; MEM.lock=false; drawMem(); } },900); } }
  drawMem();
}

/* ---- Who Am I? ---- */
let WHO_S=null;
function startWho(){
  const g=gameDoc(S.me); const done=g.who||{};
  const left=WHO.filter(w=>done[w.id]===undefined); const pool=left.length?left:WHO;
  const w=pool[Math.floor(Math.random()*pool.length)];
  WHO_S={id:w.id,clue:0,wrong:[],over:false,won:0,opts:shuffle(WHO.map(x=>x.id))}; drawWho();
}
function drawWho(){
  const box=$('whobox'); if(!box||!WHO_S) return; const w=WHO.find(x=>x.id===WHO_S.id);
  const g=gameDoc(S.me); const doneN=Object.keys(g.who||{}).length;
  let h=`<div class="small" style="margin-bottom:8px">${doneN}/${WHO.length}</div><div style="display:grid;gap:8px">`;
  for(let i=0;i<=WHO_S.clue;i++){ const c=w.clues[i]; h+=`<div class="clue"><b>${u('clue')} ${i+1}</b>${L(c[0],c[1])}</div>`; }
  h+=`</div>`;
  if(WHO_S.over) h+=`<div class="card" style="margin-top:10px"><div>${WHO_S.won?`✓ +${WHO_S.won}`:u('itWas')+':'}</div><div class="big">${L(w.en,w.vi)}</div><div class="row"><button class="btn gold" id="who-next">${u('nextPerson')}</button></div></div>`;
  else h+=`<div class="grid2" style="margin-top:10px">${WHO_S.opts.map(id=>{ const x=WHO.find(y=>y.id===id); return `<button class="opt ${WHO_S.wrong.includes(id)?'no':''}" data-who="${id}" ${WHO_S.wrong.includes(id)?'disabled':''}>${esc(LB(x.en,x.vi))}</button>`; }).join('')}</div>
    ${WHO_S.clue<2?`<div class="row" style="margin-top:10px"><button class="btn" id="who-clue">${u('nextClue')}</button></div>`:''}`;
  box.innerHTML=h;
}
function guessWho(id){
  if(!WHO_S||WHO_S.over) return;
  if(id===WHO_S.id){ WHO_S.won=3-WHO_S.clue; WHO_S.over=true; }
  else { WHO_S.wrong.push(id); if(WHO_S.clue<2) WHO_S.clue++; else WHO_S.over=true; }
  if(WHO_S.over && S.me){ const g=myGame(); g.who=g.who||{}; g.who[WHO_S.id]=Math.max(g.who[WHO_S.id]||0,WHO_S.won); saveGame(g); setTimeout(renderScoreOnly,50); }
  drawWho();
}

/* ---- Tone Marks ---- */
let TONE_S=null;
const TONE_SAMPLE={ngang:'a',huyen:'à',sac:'á',hoi:'ả',nga:'ã',nang:'ạ'};
function nextTone(){
  const mode=Math.random()<.5?'word':'tone';
  const t=TONES[Math.floor(Math.random()*TONES.length)]; const w=t.w[Math.floor(Math.random()*t.w.length)];
  if(mode==='word') TONE_S={mode,t:t.id,w,pick:null,opts:TONES.map(x=>x.id)};
  else { const others=shuffle(TONES.filter(x=>x.id!==t.id)).slice(0,3).map(x=>({tone:x.id,w:x.w[Math.floor(Math.random()*x.w.length)]}));
    TONE_S={mode,t:t.id,w,pick:null,opts:shuffle([{tone:t.id,w},...others])}; }
  drawTone();
}
function toneName(t){ return S.lang==='vi'?t.vi:S.lang==='en'?t.en:`${t.en} · ${t.vi}`; }
function drawTone(){
  const box=$('tonebox'); if(!box||!TONE_S) return; const T=TONES.find(x=>x.id===TONE_S.t); const g=gameDoc(S.me);
  const done=TONE_S.pick!==null;
  let h=`<div class="small">✓ ${g.tone?.right||0}</div>`;
  if(TONE_S.mode==='word'){
    h+=`<div class="hint" style="margin:6px 0 0">${u('whichTone')}</div><div class="card"><div class="tone-word" lang="vi">${esc(TONE_S.w[0])}</div>${done?`<div class="small" style="text-align:center">${esc(TONE_S.w[1])}</div>`:''}</div>
     <div class="grid2" style="margin-top:10px">${TONES.map(x=>{ let cls=''; if(done&&x.id===TONE_S.t) cls='ok'; else if(done&&x.id===TONE_S.pick) cls='no';
       return `<button class="opt ${cls}" data-tone="${x.id}" ${done?'disabled':''}><span style="font-size:18px" lang="vi">${TONE_SAMPLE[x.id]}</span> ${esc(toneName(x))}</button>`; }).join('')}</div>`;
  } else {
    h+=`<div class="hint" style="margin:6px 0 0">${u('whichWord')}</div><div class="card" style="text-align:center"><div class="big">${esc(toneName(T))}</div><div style="font-size:28px" lang="vi">${TONE_SAMPLE[T.id]}</div></div>
     <div class="grid2" style="margin-top:10px">${TONE_S.opts.map((o,i)=>{ let cls=''; if(done&&o.tone===TONE_S.t) cls='ok'; else if(done&&i===TONE_S.pick) cls='no';
       return `<button class="opt ${cls}" data-toneword="${i}" lang="vi" ${done?'disabled':''} style="font-size:20px">${esc(o.w[0])}${done?`<div class="small">${esc(o.w[1])}</div>`:''}</button>`; }).join('')}</div>`;
  }
  if(done) h+=`<div class="row" style="margin-top:10px"><button class="btn gold" id="tone-next">${u('next')}</button></div>`;
  box.innerHTML=h;
}
function answerTone(right){
  if(right && S.me){ const g=myGame(); g.tone=g.tone||{right:0,tries:0}; g.tone.right++; g.tone.tries++; saveGame(g); setTimeout(renderScoreOnly,50); }
  else if(S.me){ const g=myGame(); g.tone=g.tone||{right:0,tries:0}; g.tone.tries++; saveGame(g); }
  drawTone();
}

/* ---- Badges + AI recap ---- */
function renderBadges(){
  let h=`<section class="card"><div class="kicker">${u('badges')}</div><div class="badges">${badgesFor(S.me).map(b=>`<span class="bdg ${b.on?'':'off'}">${b.icon} ${esc(LB(b.en,b.vi))}</span>`).join('')}</div></section>`;
  h+=`<section class="card" style="margin-top:10px"><div class="kicker">${u('recap')}</div><div class="hint" style="margin:0">${u('recapHint')}</div>
   <div class="row"><button class="btn gold" id="recap-go" ${S.recapBusy?'disabled':''}>${S.recapBusy?'…':u('makeRecap')}</button>${S.recap?`<button class="btn" id="recap-share">${u('shareChat')}</button>`:''}</div>
   ${S.recap?`<div class="ai-out">${esc(S.recap)}</div>`:''}</section>`;
  return h;
}
async function makeRecap(){
  const lines=Object.values(PARTS).flatMap(p=>notesFor(p.id).map(n=>`[${p.start} ${p.en}] ${person(n.pid).name}: ${n.text}`));
  if(!lines.length){ toast(u('needNotes')); return; }
  S.recapBusy=true; rerenderKeepScroll();
  const system=`You write an end-of-day recap for a family of Jehovah's Witnesses after a one-day circuit assembly (theme: ${THEME.en} — ${THEME.refEn}). Use ONLY the family's notes below. For each talk that has notes, give 1–2 short bullet points of the best ideas, crediting the person by name. Then one warm closing line encouraging the family to apply one point together this week. ${S.lang==='vi'?'Write in simple, respectful Vietnamese, with an English line under each bullet.':S.lang==='both'?'Write in English, with a simple Vietnamese version of the closing line.':'Write in English.'} Keep it under 250 words. Do not quote publications or song lyrics, and do not add facts that aren't in the notes.`;
  try{ S.recap=await callAI(system,[{role:'user',content:'FAMILY NOTES:\n'+lines.join('\n').slice(0,18000)}],1100); LS.set('tc_recap',S.recap); }
  catch(e){ toast(aiErr(e&&e.code)); }
  S.recapBusy=false; if(S.tab==='games') rerenderKeepScroll();
}

/* ============ WORDS ============ */
function renderWords(){
  const keys=Object.keys(VOCAB);
  let h=`<div class="subnav" role="group"><button data-wf="all" aria-pressed="${S.wfilter==='all'}">${u('all')}</button>${keys.map(k=>`<button data-wf="${k}" aria-pressed="${S.wfilter===k}">${esc(S.lang==='vi'?VOCAB[k].vi:VOCAB[k].en)}</button>`).join('')}</div>
   <div class="notice">${u('pronNote')}</div>`;
  for(const k of keys){ if(S.wfilter!=='all'&&S.wfilter!==k) continue;
    h+=`<div class="session-h"><h2>${esc(S.lang==='vi'?VOCAB[k].vi:VOCAB[k].en)}</h2></div><div class="wgrid">`;
    VOCAB[k].w.forEach((w,i)=>{ const id='w_'+k+'_'+i; const hide=S.lang==='vi'&&!S.reveal[id];
      h+=`<div class="word"><div class="vi" lang="vi">${esc(w[0])}</div><div class="pr">${esc(w[1])}</div>
       ${hide?`<button class="reveal" data-reveal="${id}">${u('tapReveal')}</button>`:`<div class="mean">${esc(w[2])}</div>`}
       <div class="meta"><span class="src ${w[3]}">${u(w[3]==='prog'?'srcProg':'srcUnv')}</span>${w[4]?`<span>${esc(w[4])}</span>`:''}<button class="linkbtn" data-askword="${esc(w[0])}">${u('ask')}</button></div></div>`; });
    h+=`</div>`; }
  return h;
}

/* ============ FAMILY CHAT ============ */
function chatMsgs(){ return Object.values(view('chat/')).filter(m=>m&&m.text).sort((a,b)=>a.ts-b.ts); }
function renderChat(){
  const msgs=chatMsgs();
  if(!msgs.length) return `<div class="empty">${u('chatEmpty')}</div>`;
  return `<div class="chat">${msgs.map(m=>{ const p=person(m.pid); const mine=m.pid===S.me; const key=m.id; const pend=!!S.pending['chat/'+key];
    return `<div class="msg ${mine?'mine':''}">${mine?'':avatar(p)}<div class="bub"><div class="who">${esc(p.name)} <span>${timeAgo(m.ts)}${pend?' · ⏳':''}</span></div><p>${esc(m.text)}</p>
      ${S.trans[key]?`<div class="tr" lang="vi">${esc(S.trans[key])}</div>`:`<button class="linkbtn" data-trans="${esc(key)}">${u('translate')}</button>`}</div>${mine?avatar(p):''}</div>`; }).join('')}</div>`;
}
function markChatSeen(){ const msgs=chatMsgs(); const last=msgs.length?msgs[msgs.length-1].ts:0; S.chatSeen=Math.max(S.chatSeen,last); LS.set('tc_chatseen',S.chatSeen); updateChatBadge(); }
function updateChatBadge(){ const n=chatMsgs().filter(m=>m.ts>S.chatSeen && m.pid!==S.me).length; const b=$('chat-badge'); b.hidden=!n||S.tab==='chat'; b.textContent=n>9?'9+':n; }
function sendChat(text){
  if(!S.me){ showPicker(); return; }
  const id=newId();
  write('chat/'+id, {id, pid:S.me, text:text.slice(0,2000), ts:Date.now()});
  render();
}
async function translateMsg(id){
  const m=chatMsgs().find(x=>x.id===id); if(!m) return;
  S.trans[id]='…'; render();
  try{
    const text=await callAI(`Translate this family chat message. If it is English, give natural congregation-level Vietnamese with a simple pronunciation line. If it is Vietnamese, give English. Keep it short. Use official JW wording from this glossary when it applies; otherwise end with "(not verified against JW usage)".\nGLOSSARY:\n${glossary()}`,[{role:'user',content:m.text}],500);
    S.trans[id]=text; LS.set('tc_trans',S.trans);
  }catch(e){ delete S.trans[id]; toast(aiErr(e&&e.code)); }
  if(S.tab==='chat') render();
}

/* ============ PERSONAL AI ============ */
function glossary(){
  const lines=[`Theme: ${THEME.en} = ${THEME.vi} (${THEME.refEn} = ${THEME.refVi})`];
  for(const s of PROGRAM) for(const it of s.items){ if(it.en) lines.push(`${it.t} ${it.en} = ${it.vi}`); if(it.parts) it.parts.forEach(p=>lines.push(`  part: ${p.en} = ${p.vi}`)); }
  for(const n in RQ) lines.push(`Review Q${n}: ${RQ[n].en} = ${RQ[n].vi}`);
  for(const k in VOCAB) for(const w of VOCAB[k].w) lines.push(`${w[0]} = ${w[2]} [${w[3]==='prog'?'verified':'NOT verified'}]`);
  for(const b of BOOKS) lines.push(`Bible book: ${b[0]} = ${b[1]} [verified]`);
  return lines.join('\n');
}
function rules(){
  const p=me();
  return `You are a friendly Vietnamese-language helper for one member of a family of Jehovah's Witnesses (beginner/intermediate learners; ages 12 to adult) at a one-day circuit assembly. You are speaking with ${p?p.name:'a family member'}.
Answer briefly and warmly (usually under 150 words). Use simple English unless asked for Vietnamese.${S.lang==='vi'?' This person has the app set to Vietnamese, so answer mainly in simple Vietnamese, adding short English help where useful.':''}
For any Vietnamese word or phrase, give: the Vietnamese, an easy English-style pronunciation spelling (not IPA), and the English meaning. Mention Northern vs Southern pronunciation when it differs (Gi/D = "z" in the North, "y" in the South; Tr = "ch" in the North).
SOURCES: Official Jehovah's Witnesses Vietnamese wording takes priority. The VERIFIED GLOSSARY below was copied from the official program and Bible index on wol.jw.org; label terms from it "per wol.jw.org (program)". You cannot browse the web, so label anything else "Not verified against JW publications — check wol.jw.org or the JW Language app". Never claim wording is official unless it is in the verified glossary, and never invent quotations from publications.
Use respectful, congregation-level Vietnamese (anh/chị, natural, not slang, not archaic). Do not quote song lyrics. For scriptures, give the reference in both languages and point to wol.jw.org for the full verse rather than quoting long passages.
If asked to help with a note, rewrite it in short, simple Vietnamese sentences with pronunciation.
Plain text only (no markdown tables).
VERIFIED GLOSSARY:
${glossary()}`;
}
function aiKey(){ return 'tc_ai_'+(S.me||'anon'); }
let aiBusy=false;
function renderAsk(){
  const hist=LS.get(aiKey(),[]);
  const quick=S.lang==='vi'?['Nói “Tôi rất thích bài giảng” thế nào?','Giải thích “thuyết trình phối hợp”','Đố tôi 3 từ hôm nay','Giúp tôi chào một anh chị sau buổi họp']
   :['How do I say “I really enjoyed that talk”?','Break down the theme word by word','Quiz me on 3 words from today','How do I greet a brother or sister after the session?'];
  let h=`<div class="notice">${S.lang==='vi'?'Cuộc trò chuyện này chỉ dành cho bạn. Cần có sóng.':'Private to you on this phone. Needs signal. Official wording is marked “per wol.jw.org”; anything else is marked not verified.'}</div>
   <div class="quick">${quick.map(q=>`<button class="btn" data-quick="${esc(q)}">${esc(q)}</button>`).join('')}</div>`;
  if(!hist.length) h+=`<div class="empty">${u('askEmpty')}</div>`;
  h+=`<div class="chat" id="aichat">${hist.map(m=>aiBubble(m)).join('')}</div>`;
  if(hist.length) h+=`<div style="margin-top:14px;text-align:center"><button class="btn" id="ai-clear">${u('clear')}</button></div>`;
  return h;
}
function aiBubble(m){ const p=me()||{name:'You',color:'#888'};
  if(m.role==='user') return `<div class="msg mine"><div class="bub"><p>${esc(m.content)}</p></div>${avatar(p)}</div>`;
  return `<div class="msg ai-a"><span class="av" style="background:var(--gold)">AI</span><div class="bub"><p>${esc(m.content)}</p></div></div>`; }
async function askAI(text){
  if(aiBusy) return;
  const key=aiKey(); const hist=LS.get(key,[]); hist.push({role:'user',content:text}); LS.set(key,hist);
  render();
  const box=$('aichat'); const wrap=document.createElement('div'); wrap.innerHTML=aiBubble({role:'assistant',content:'…'}); const bub=wrap.firstElementChild; box&&box.appendChild(bub); const out=bub.querySelector('p'); scrollEnd();
  aiBusy=true;
  const turns=hist.slice(-12); while(turns.length&&turns[0].role!=='user') turns.shift();
  try{
    const ans=await callAI(rules(),turns,900);
    out.textContent=ans; hist.push({role:'assistant',content:ans}); LS.set(key,hist);
  }catch(e){
    out.textContent=aiErr(e&&e.code); hist.pop(); LS.set(key,hist); /* drop the unanswered question so retry is clean */
  }finally{ aiBusy=false; scrollEnd(); }
}

/* ============ PROFILE PICKER ============ */
function showPicker(){
  if(S.gate) return;
  const ppl=roster();
  $('overlay').innerHTML=`<div class="ov" role="dialog" aria-modal="true" aria-labelledby="pk-h"><div class="sheet">
    <h2 id="pk-h">${u('who')}</h2><div class="saved">${u('whoSub')}</div>
    <div class="people">${ppl.map(p=>`<button class="person" data-pick="${esc(p.id)}" aria-pressed="${p.id===S.me}">${avatar(p,'lg')}${esc(p.name)}</button>`).join('')}</div>
    ${ppl.length<MAX_PEOPLE?`<div class="addrow"><input id="pk-name" maxlength="20" placeholder="${esc(u('addPh'))}" autocomplete="off"><button class="btn pri" id="pk-add">${u('add')}</button></div><div class="saved">${u('max')}</div>`:''}
    ${S.me?`<button class="btn" id="pk-close">${u('done')}</button>`:''}
  </div></div>`;
  setTimeout(()=>{ const i=$('pk-name'); if(i&&!ppl.length) i.focus(); },50);
}
function closePicker(){ $('overlay').innerHTML=''; }
function addPerson(name){
  name=name.trim(); if(!name) return; const ppl=roster(); if(ppl.length>=MAX_PEOPLE) return;
  const used=new Set(ppl.map(p=>p.color)); const color=COLORS.find(c=>!used.has(c))||COLORS[ppl.length%COLORS.length];
  const p={id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), name:name.slice(0,20), color, ts:Date.now()};
  write('profile/'+p.id,p); S.me=p.id; LS.set('tc_me',p.id); closePicker(); render(); toast((S.lang==='vi'?'Xin chào, ':'Welcome, ')+p.name);
}

/* ============ EVENTS ============ */
document.addEventListener('click', e=>{
  const t=e.target.closest('button,a,input'); if(!t) return;
  const d=t.dataset;
  if(d.lang){ S.lang=d.lang; LS.set('tc_lang',S.lang); render(); return; }
  if(d.tab){ S.tab=d.tab; LS.set('tc_tab',S.tab); render(); window.scrollTo(0,0); if(S.tab==='chat'||S.tab==='ask') scrollEnd(); return; }
  if(t.id==='join'){ joinFamily($('code').value); return; }
  if(t.id==='update-btn'){ applyUpdate(); return; }
  if(t.id==='me-chip'){ showPicker(); return; }
  if(d.pick){ S.me=d.pick; LS.set('tc_me',S.me); closePicker(); M=MEM=WHO_S=TONE_S=null; render(); return; }
  if(t.id==='pk-add'){ addPerson($('pk-name').value); return; }
  if(t.id==='pk-close'){ closePicker(); return; }
  if(d.chip){ S.open[d.chip]=!S.open[d.chip]; t.outerHTML=vocabChipsOne(d.chip); return; }
  if(d.jump){ const el=$('p-'+d.jump); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); return; }
  if(d.tryvi){ const ta=$('note-'+d.tryvi); const txt=(ta&&ta.value.trim()); if(!txt){ toast(S.lang==='vi'?'Hãy viết ghi chú trước':'Write a note first'); return; } S.tab='ask'; LS.set('tc_tab','ask'); askAI(`Help me say my note in simple Vietnamese, sentence by sentence, with pronunciation:\n\n${txt}`); return; }
  if(d.gtab){ S.gtab=d.gtab; LS.set('tc_gtab',S.gtab); render(); return; }
  if(!S.me && (d.tile!==undefined||d.verse||d.predhit!==undefined||d.predsug||d.qans||d.race!==undefined||d.mem!==undefined||d.who||d.tone||d.toneword!==undefined)){ e.preventDefault(); showPicker(); return; }
  if(d.bsess){ S.bsess=d.bsess; render(); return; }
  if(d.tile!==undefined){ const g=myGame(); g.bingo=g.bingo||{am:[],pm:[]}; const arr=g.bingo[S.bsess]=g.bingo[S.bsess]||[]; const wi=+d.tile; const before=bingoLines(S.me,S.bsess,arr).length; const ix=arr.indexOf(wi); if(ix>=0) arr.splice(ix,1); else arr.push(wi); saveGame(g); const after=bingoLines(S.me,S.bsess,arr).length; if(after>before) toast('BINGO! +5'); rerenderKeepScroll(); return; }
  if(d.verse){ const g=myGame(); const v=new Set(g.verses||[]); t.checked?v.add(d.verse):v.delete(d.verse); g.verses=[...v]; saveGame(g); rerenderKeepScroll(); return; }
  if(t.id==='verse-add-btn'){ const i=$('verse-add'); const val=i.value.trim(); if(!val) return; const g=myGame(); g.custom=[...(g.custom||[]),val.slice(0,60)]; saveGame(g); rerenderKeepScroll(); return; }
  if(d.delverse!==undefined){ const g=myGame(); g.custom=(g.custom||[]).filter((_,i)=>i!==+d.delverse); saveGame(g); rerenderKeepScroll(); return; }
  if(d.ml!==undefined){ M.sel=+d.ml; drawMatch(); return; }
  if(d.mr!==undefined){ if(M.sel===null) return; const r=+d.mr; if(r===M.sel){ M.done.add(r); M.sel=null; if(M.done.size===M.pick.length && S.me){ const g=myGame(); g.wm=(g.wm||0)+1; saveGame(g); setTimeout(renderScoreOnly,50);} drawMatch(); } else { t.classList.remove('bad'); void t.offsetWidth; t.classList.add('bad'); } return; }
  if(t.id==='match-new'){ startMatch(); return; }
  /* Prediction Cards */
  if(t.id==='pred-add-btn'){ predAdd($('pred-add').value); return; }
  if(d.predsug){ predAdd(d.predsug); return; }
  if(d.predhit!==undefined){ const i=+d.predhit; predSave(c=>{ const ix=c.hits.indexOf(i); if(ix>=0) c.hits.splice(ix,1); else c.hits.push(i); }); return; }
  if(d.predclear){ predSave(c=>{ c.words=[]; c.hits=[]; }); return; }
  if(d.predshow){ S.predReveal[d.predshow]=true; rerenderKeepScroll(); return; }
  /* Quiz */
  if(t.id==='qf-open'){ S.quizForm=true; qfRight=0; rerenderKeepScroll(); setTimeout(()=>$('qf-q')?.focus(),30); return; }
  if(t.id==='qf-cancel'){ S.quizForm=false; rerenderKeepScroll(); return; }
  if(d.qfright!==undefined){ qfRight=+d.qfright; document.querySelectorAll('[data-qfright]').forEach(b=>b.classList.toggle('gold',+b.dataset.qfright===qfRight)); return; }
  if(t.id==='qf-post'){ postQuiz(); return; }
  if(d.qans){ const q=view('quiz/')['quiz/'+d.qans]; if(!q) return; write(`qa/${q.id}__${S.me}`,{quiz:q.id,pid:S.me,choice:+d.qi,ts:Date.now()}); if(q.kind!=='family'){ toast(+d.qi===q.correct?'✓ +2':'✗'); } rerenderKeepScroll(); return; }
  if(d.qreveal){ const q=structuredClone(view('quiz/')['quiz/'+d.qreveal]); q.status='revealed'; write('quiz/'+q.id,q); rerenderKeepScroll(); return; }
  if(d.aiquiz){ makeAIQuiz(d.aiquiz); return; }
  /* Book Race */
  if(d.racedir){ LS.set('tc_racedir',d.racedir); drawRace(); return; }
  if(t.id==='race-start'){ startRace(); return; }
  if(d.race!==undefined){ if(!RACE||RACE.done) return; const i=+d.race; if(i===RACE.q.ans){ RACE.score++; nextRace(); } else { RACE.wrong=i; } drawRace(); return; }
  /* Memory */
  if(d.mem!==undefined){ flipMem(+d.mem); return; }
  if(t.id==='mem-new'){ startMem(); return; }
  /* Who Am I */
  if(d.who){ guessWho(d.who); return; }
  if(t.id==='who-clue'){ if(WHO_S&&WHO_S.clue<2){ WHO_S.clue++; drawWho(); } return; }
  if(t.id==='who-next'){ startWho(); return; }
  /* Tones */
  if(d.tone){ if(TONE_S.pick!==null) return; TONE_S.pick=d.tone; answerTone(d.tone===TONE_S.t); return; }
  if(d.toneword!==undefined){ if(TONE_S.pick!==null) return; const i=+d.toneword; TONE_S.pick=i; answerTone(TONE_S.opts[i].tone===TONE_S.t); return; }
  if(t.id==='tone-next'){ nextTone(); return; }
  /* Recap */
  if(t.id==='recap-go'){ makeRecap(); return; }
  if(t.id==='recap-share'){ if(S.recap){ sendChat(S.recap.slice(0,2000)); toast('✓'); } return; }
  if(d.wf){ S.wfilter=d.wf; render(); return; }
  if(d.reveal){ S.reveal[d.reveal]=true; render(); return; }
  if(d.askword){ S.tab='ask'; LS.set('tc_tab','ask'); askAI(`Teach me the word “${d.askword}”: meaning, pronunciation (North and South), and one simple example sentence I could use at the assembly.`); return; }
  if(d.trans){ translateMsg(d.trans); return; }
  if(d.quick){ askAI(d.quick); return; }
  if(t.id==='ai-clear'){ LS.set(aiKey(),[]); render(); return; }
  if(t.id==='send'){ doSend(); return; }
});
document.addEventListener('change', e=>{ if(e.target.id==='pred-part'){ S.predPart=e.target.value; rerenderKeepScroll(); } });
function doSend(){ const c=$('compose'); const v=c.value.trim(); if(!v) return; c.value=''; c.style.height='auto'; if(S.tab==='chat') sendChat(v); else askAI(v); }
$('compose').addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey && window.matchMedia('(pointer:fine)').matches){ e.preventDefault(); doSend(); } });
document.addEventListener('keydown', e=>{
  if(e.key!=='Enter') return;
  if(e.target.id==='pk-name'){ e.preventDefault(); addPerson(e.target.value); }
  if(e.target.id==='verse-add'){ e.preventDefault(); $('verse-add-btn').click(); }
  if(e.target.id==='pred-add'){ e.preventDefault(); predAdd(e.target.value); }
  if(e.target.id==='code'){ e.preventDefault(); joinFamily(e.target.value); }
});

/* Live data updates without wiping what someone is typing */
let dataT; function onData(kind){
  clearTimeout(dataT); dataT=setTimeout(()=>{
    if(S.gate) return;
    if(kind==='profile'||kind==='all'){ renderChrome(); const ov=$('overlay').innerHTML; if(!me() && !ov) showPicker(); else if(ov && !($('pk-name')&&$('pk-name').value)) showPicker(); }
    const typing=document.activeElement && document.activeElement.matches('input,textarea,select');
    if(S.tab==='program' || (S.tab==='games' && S.gtab==='review')){ fillNotes(); renderScoreOnly(); }
    else if(S.tab==='games' && ['bingo','verses','predict','quiz','badges'].includes(S.gtab) && !typing){ rerenderKeepScroll(); }
    else if(S.tab==='games'){ renderScoreOnly(); }
    if(S.tab==='chat' && (kind==='chat'||kind==='all')){ const atEnd=(window.innerHeight+window.scrollY)>=document.body.scrollHeight-80; $('main').innerHTML=renderChat(); markChatSeen(); if(atEnd) scrollEnd(); }
    updateChatBadge(); setSync();
  },120);
}
setInterval(()=>{ $('clock').textContent=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}); if(S.tab==='program' && !S.gate && !document.activeElement?.matches('textarea')){ const cur=currentItem(); const marked=document.querySelector('.part.is-now'); if(((cur&&cur.id)||null)!==(marked?marked.id.slice(2):null)) rerenderKeepScroll(); } }, 60000);

/* ============ PWA: service worker + update prompt ============ */
let waitingSW=null;
function showUpdate(sw){ waitingSW=sw; if($('update-btn')) return; const b=document.createElement('button'); b.id='update-btn'; b.className='btn gold update'; b.textContent=u('update'); document.body.appendChild(b); }
function applyUpdate(){ if(waitingSW) waitingSW.postMessage('skipWaiting'); else location.reload(); }
if('serviceWorker' in navigator && location.protocol!=='file:'){
  navigator.serviceWorker.register('./sw.js').then(reg=>{
    if(reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener('updatefound',()=>{ const sw=reg.installing; sw&&sw.addEventListener('statechange',()=>{ if(sw.state==='installed' && navigator.serviceWorker.controller) showUpdate(sw); }); });
    setInterval(()=>reg.update().catch(()=>{}), 10*60*1000);
  }).catch(()=>{});
  let reloaded=false; navigator.serviceWorker.addEventListener('controllerchange',()=>{ if(reloaded) return; reloaded=true; location.reload(); });
}
try{ navigator.storage?.persist?.(); }catch(e){}

render();
boot();
