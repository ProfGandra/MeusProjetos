/* EngControl v1.3.7 — crachá profissional, acessos professor/desenvolvedor e atividade integradora */
'use strict';
(function(){
  const VERSION='1.3.7';
  const SPECIAL_AVATAR='PROF_GANDRA';
  const DEV_CODE='!G@NDR@!';
  const TEACHER_CODES=[
    'PCM#Prof!7A2','EngC@Teach#91','Prof!PCM@4K8','PCM@Mestre#26','Ctrl#Prof@8Q1',
    'Eng!Docente#73','PCM#Aula@5X9','Manut@Prof#42','Prof#EngC!6R4','PCM!Tutor@81',
    'EngCtrl#P@39','Docente!PCM#57','PCM@Lab#2N6','Prof!Manut@94','EngC#Master!31',
    'PCM#Instrutor@68','Prof@Control#75','Eng!PCM#4T2','PCM@Professor#83','CtrlManut!#96'
  ];

  if(!AVATARS.some(a=>a[0]===SPECIAL_AVATAR)) AVATARS.push([SPECIAL_AVATAR,'Professor']);

  const baseAvatarSrc=avatarSrc;
  avatarSrc=function(v){ return v===SPECIAL_AVATAR ? 'https://raw.githubusercontent.com/ProfGandra/EngControl/main/assets/avatar-sucesso.png' : baseAvatarSrc(v); };

  function installStyles(){
    if(document.getElementById('ec137Styles'))return;
    const s=document.createElement('style');s.id='ec137Styles';s.textContent=`
      .dashboard{align-items:start}
      .dashboard>.id-card.ec-badge{align-self:start;justify-self:stretch;height:auto!important;min-height:0!important;max-height:none!important}
      .two-col>.id-card.ec-badge{align-self:center;justify-self:center;width:min(100%,360px);height:auto!important;min-height:0!important;max-height:none!important}
      #profile .two-col{align-items:start}
      #profile .id-card.ec-badge{width:min(100%,360px);padding:28px 18px 20px;margin-top:42px}
      #profile .id-card.ec-badge .id-company{margin-bottom:10px}
      #profile .id-card.ec-badge .id-role{font-size:11px;line-height:1.25;min-height:34px;display:flex;align-items:center;justify-content:center}
      #profile .id-card.ec-badge .id-photo{width:110px;height:120px;object-fit:cover}
      #profile .id-card.ec-badge .id-name{font-size:23px;margin:12px 0 4px}
      #profile .id-card.ec-badge .barcode{height:54px}
      #profile .id-card.ec-badge .ec-access-note{margin-top:10px}
      .id-card.ec-badge{position:relative;overflow:visible;background:linear-gradient(180deg,#f8fafc 0,#eef3f7 100%);color:#0b1f33;border:2px solid #c9d3dd;border-radius:18px;box-shadow:0 16px 34px rgba(0,0,0,.28);padding:28px 18px 20px;margin-top:34px;display:block!important}
      .id-card.ec-badge:before{content:'';position:absolute;left:50%;top:-38px;transform:translateX(-50%);width:68px;height:48px;border-radius:12px 12px 5px 5px;background:linear-gradient(#1f2937,#111827);border:2px solid #64748b;box-shadow:0 6px 12px rgba(0,0,0,.3)}
      .id-card.ec-badge:after{content:'';position:absolute;left:50%;top:-27px;transform:translateX(-50%);width:28px;height:12px;border-radius:999px;background:#020617;border:2px solid #94a3b8}
      .id-card.ec-badge .id-company{background:#fff;border-radius:10px;padding:9px;border:1px solid #d6dee6;margin-bottom:10px}
      .id-card.ec-badge .compact-id-brand strong,.id-card.ec-badge .compact-id-brand small{color:#0b1f33!important}
      .id-card.ec-badge .id-role{margin:0 -18px 14px;padding:8px 10px;background:#0f4c81;color:white!important;font-weight:900;letter-spacing:.06em;text-align:center}
      .id-card.ec-badge .id-photo{background:white;border:2px solid #9fb0bf;border-radius:14px;padding:3px;box-shadow:none}
      .id-card.ec-badge .id-name{color:#0b1f33!important;font-weight:900;font-size:24px;text-align:center;margin-top:10px}
      .id-card.ec-badge .id-code,.id-card.ec-badge .barcode-number{color:#334155!important;text-align:center}
      .id-card.ec-badge .barcode{background:#fff;border:1px solid #94a3b8;border-radius:6px;padding:8px;margin-top:12px}
      .ec-access-note{margin-top:8px;padding:8px 10px;border-radius:10px;background:#eef6ff;border:1px solid #bfdbfe;color:#1e3a5f;font-size:11px;text-align:center;font-weight:700}
      .integrator-card{border:1px solid rgba(168,85,247,.45);background:linear-gradient(135deg,rgba(88,28,135,.16),rgba(30,41,59,.5));border-radius:16px;padding:18px;margin-top:14px}
      .integrator-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
      .integrator-box{border:1px solid var(--border);background:#0b1220;border-radius:14px;padding:14px}
      .integrator-box label{display:block;margin:8px 0;line-height:1.35}
      .integrator-step{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.integrator-step span{padding:7px 10px;border:1px solid var(--border);border-radius:999px;font-size:12px}.integrator-step span.on{border-color:#a855f7;background:rgba(168,85,247,.15)}
      .integrator-score{font-size:42px;font-weight:900;color:#7dd3fc;text-align:center}
      @media(max-width:900px){.dashboard>.id-card.ec-badge{justify-self:center;width:min(100%,360px)}#profile .two-col>.id-card.ec-badge{justify-self:center;width:min(100%,360px)}}
      @media(max-width:760px){.integrator-grid{grid-template-columns:1fr}.id-card.ec-badge{margin-top:42px}}
    `;document.head.appendChild(s);
  }

  function decorateBadges(){
    document.querySelectorAll('.id-card').forEach(card=>{
      card.classList.add('ec-badge');
      if(!card.querySelector('.ec-access-note')){
        const n=document.createElement('div');n.className='ec-access-note';
        n.textContent='CRACHÁ DE ACESSO • ENGCONTROL';card.appendChild(n);
      }
    });
  }

  function addField(){
    const target=document.getElementById('selectedAvatar');
    if(!target || document.getElementById('professorTestCode')) return;
    const box=document.createElement('div');box.className='field';
    box.innerHTML='<label>Código especial <span class="tiny">(opcional)</span></label><input id="professorTestCode" type="password" autocomplete="off" placeholder="Professor / desenvolvedor"><p class="tiny">Alunos devem deixar este campo em branco.</p>';
    target.parentElement.insertAdjacentElement('afterend',box);
  }

  function unlockAll(x){x.unlocked=Array.from({length:60},(_,i)=>i+1);x.availability=100;x.reliability=100;x.safety=100;ensureOperations(x);return x;}
  function configureDeveloper(x){x.name='Gandra';x.avatar=SPECIAL_AVATAR;x.role='Desenvolvedor / Professor';x.teacherMode=true;x.developerMode=true;x.accessProfile='developer';x.id='ENG-TEST-DG';return unlockAll(x);}
  function configureProfessor(x){x.role='Professor / Modo de Teste';x.teacherMode=true;x.developerMode=false;x.accessProfile='professor';return unlockAll(x);}

  const normalCreate=createPlayer;
  createPlayer=function(){
    const field=document.getElementById('professorTestCode');
    const code=(field?.value||'').trim();
    if(!code)return normalCreate();
    if(code===DEV_CODE){state=configureDeveloper(fresh('Gandra',SPECIAL_AVATAR));save();showHome();setTimeout(()=>alert('Modo Desenvolvedor / Professor ativado. Todos os níveis e a Atividade Integradora foram liberados.'),80);return;}
    if(TEACHER_CODES.includes(code)){
      const name=(el.playerName?.value||'Professor').trim()||'Professor';
      const av=el.selectedAvatar?.value||'masculino_01_moreno.png';
      state=configureProfessor(fresh(name,av));state.id='ENG-PROF-'+Math.random().toString(36).slice(2,7).toUpperCase();save();showHome();setTimeout(()=>alert('Modo Professor ativado. Todos os níveis e a Atividade Integradora foram liberados para teste.'),80);return;
    }
    alert('Código especial não reconhecido.');
  };

  const baseMigrate=migrateState;
  migrateState=function(x){x=baseMigrate(x);if(x?.developerMode||x?.avatar===SPECIAL_AVATAR)configureDeveloper(x);else if(x?.teacherMode)configureProfessor(x);return x;};

  const basePicker=renderAvatarPicker;
  renderAvatarPicker=function(){
    if(!el.avatarPicker)return;el.avatarPicker.innerHTML='';
    AVATARS.filter(a=>a[0]!==SPECIAL_AVATAR).forEach(([file,label])=>{const b=document.createElement('button');b.type='button';b.className='avatar-choice'+(el.selectedAvatar.value===file?' selected':'');b.innerHTML=`<img src="https://raw.githubusercontent.com/ProfGandra/EngControl/main/assets/avatars/${file}" alt="${label}"><small>${label}</small>`;b.onclick=()=>selectAvatar(file);el.avatarPicker.appendChild(b);});
  };

  function installIntegrator(){
    if(document.getElementById('integratorScreen'))return;
    const shell=document.querySelector('.shell')||document.body;
    const sec=document.createElement('section');sec.id='integratorScreen';sec.className='screen';
    sec.innerHTML=`<div class='panel'><div class='theory-head'><div><span class='tag'>ATIVIDADE INTEGRADORA</span><h2>🏭 Gestão Integrada de PCM</h2><p class='muted'>Um caso completo para integrar priorização, OS, segurança, RM, estoque, orçamento, indicadores e decisão gerencial.</p></div><button class='secondary' onclick='showHome()'>← Voltar à campanha</button></div><div id='integratorBody'></div></div>`;
    shell.appendChild(sec);
  }

  function integratorAvailable(){return !!(state&&(state.teacherMode||(state.completed||[]).length>=60));}
  function addIntegratorCard(){
    const panels=[...document.querySelectorAll('#home main .panel')];
    const phase12=panels.find(p=>p.textContent.includes('FASE 12'));
    if(!phase12||phase12.querySelector('.integrator-card'))return;
    const d=document.createElement('div');d.className='integrator-card';
    const open=integratorAvailable();
    d.innerHTML=`<h3>🧩 Atividade Integradora — Gestão de uma operação realista</h3><p>Analise um conjunto de OS, priorize intervenções, planeje recursos e segurança, emita RM/OC quando necessário, avalie orçamento e encerre com uma decisão gerencial baseada em indicadores.</p><button class='primary' ${open?'':'disabled'} onclick='openIntegrator()'>${open?'Iniciar Atividade Integradora':'Concluir os 60 níveis para liberar'}</button>`;
    phase12.appendChild(d);
  }

  window.openIntegrator=function(){if(!integratorAvailable())return alert('A Atividade Integradora é liberada após os 60 níveis.');installIntegrator();state.integrator=state.integrator||{step:1,score:0,answers:{},started:new Date().toISOString()};renderIntegrator();show('integratorScreen');save();};
  function stepBar(n){return `<div class='integrator-step'>${['Prioridade','Planejamento','RM/OC','Indicadores','Encerramento'].map((x,i)=>`<span class='${i+1===n?'on':''}'>${i+1}. ${x}</span>`).join('')}</div>`;}
  function checked(name){return [...document.querySelectorAll(`[name="${name}"]:checked`)].map(x=>x.value);}
  function radio(name){return document.querySelector(`[name="${name}"]:checked`)?.value||'';}

  window.renderIntegrator=function(){
    installIntegrator();const r=state.integrator||{step:1,score:0,answers:{}};const b=document.getElementById('integratorBody');
    if(r.step===1)b.innerHTML=stepBar(1)+`<div class='real-box'><h3>Entrada de turno — três OS aguardando decisão</h3><p><b>OS A:</b> ventilador de exaustão administrativo parado, equipamento reserva disponível.<br><b>OS B:</b> proteção móvel de célula automatizada apresenta intermitência e pode comprometer segurança.<br><b>OS C:</b> bomba de processo apresenta vazamento crescente, mas ainda opera com monitoramento.</p></div><div class='integrator-box'><h3>Qual OS deve receber prioridade máxima?</h3><label><input type='radio' name='intPriority' value='A'> OS A — porque já está parada</label><label><input type='radio' name='intPriority' value='B'> OS B — risco de segurança em máquina automatizada</label><label><input type='radio' name='intPriority' value='C'> OS C — porque qualquer vazamento é automaticamente prioridade máxima</label></div><button class='primary' onclick='intStep1()'>Registrar priorização</button>`;
    else if(r.step===2)b.innerHTML=stepBar(2)+`<div class='real-box'><h3>OS B — planejamento</h3><p>A célula automatizada deve ser parada para inspeção da proteção móvel. Selecione os elementos indispensáveis antes da liberação.</p></div><div class='integrator-grid'><div class='integrator-box'><h3>Equipe e segurança</h3><label><input type='checkbox' name='intPlan' value='nr12'> Profissional com competência compatível e requisitos de NR-12</label><label><input type='checkbox' name='intPlan' value='energy'> Controle de energias/bloqueio</label><label><input type='checkbox' name='intPlan' value='guard'> Restabelecer e testar proteção/dispositivo</label><label><input type='checkbox' name='intPlan' value='improvise'> Neutralizar temporariamente o intertravamento para reduzir a parada</label></div><div class='integrator-box'><h3>Documentação</h3><label><input type='checkbox' name='intPlan' value='risk'> Análise de risco</label><label><input type='checkbox' name='intPlan' value='os'> Atualizar a OS com planejamento e critérios de aceitação</label><label><input type='checkbox' name='intPlan' value='test'> Teste funcional antes da liberação</label></div></div><button class='primary' onclick='intStep2()'>Validar planejamento</button>`;
    else if(r.step===3)b.innerHTML=stepBar(3)+`<div class='real-box'><h3>RM e orçamento</h3><p>A inspeção confirmou falha na chave de segurança da proteção móvel. Estoque: <b>0 unidades</b>. Preço no catálogo: <b>R$ 1.250</b>. Fundo disponível: <b>R$ ${Number(state.budget).toLocaleString('pt-BR')}</b>.</p></div><div class='integrator-box'><h3>Qual fluxo administrativo é adequado?</h3><label><input type='radio' name='intBuy' value='buy'> Emitir RM, registrar falta, suspender a OS e emitir OC de 1 unidade vinculada à OS</label><label><input type='radio' name='intBuy' value='bypass'> Retirar o dispositivo e liberar a máquina sem proteção até chegar a peça</label><label><input type='radio' name='intBuy' value='bulk'> Comprar 10 unidades imediatamente, sem justificar estoque mínimo ou orçamento</label></div><button class='primary' onclick='intStep3()'>Processar RM / OC</button>`;
    else if(r.step===4)b.innerHTML=stepBar(4)+`<div class='real-box'><h3>Indicadores após 6 meses</h3><p>A célula apresentou MTBF de 420 h no semestre anterior e 610 h neste semestre. O MTTR caiu de 4,8 h para 3,1 h. A quantidade produzida permaneceu comparável.</p></div><div class='integrator-box'><h3>Qual interpretação é mais consistente?</h3><label><input type='radio' name='intKpi' value='better'> Os dados sugerem melhora simultânea de confiabilidade operacional e capacidade de restauração, mas a tendência deve continuar sendo acompanhada</label><label><input type='radio' name='intKpi' value='worse'> O aumento do MTBF significa que o equipamento está falhando mais</label><label><input type='radio' name='intKpi' value='perfect'> Os indicadores comprovam que nenhuma nova falha ocorrerá</label></div><button class='primary' onclick='intStep4()'>Registrar análise</button>`;
    else if(r.step===5)b.innerHTML=stepBar(5)+`<div class='real-box'><h3>Encerramento gerencial</h3><p>Defina a decisão final considerando segurança, histórico da OS, custo, disponibilidade e aprendizado para o plano de manutenção.</p></div><div class='integrator-box'><label><input type='radio' name='intClose' value='close'> Encerrar após teste funcional, registrar causa/ação, atualizar histórico e revisar o plano preventivo conforme evidência</label><label><input type='radio' name='intClose' value='erase'> Encerrar a OS e apagar a ocorrência para não prejudicar indicadores</label><label><input type='radio' name='intClose' value='ignore'> Liberar sem teste porque a peça é nova</label></div><button class='primary' onclick='intStep5()'>Concluir Atividade Integradora</button>`;
    else b.innerHTML=stepBar(5)+`<div class='keyline'><h3>Atividade Integradora concluída</h3><div class='integrator-score'>${r.score}/100</div><p>${r.score>=90?'Excelente integração dos conceitos de PCM.':r.score>=70?'Boa integração. Revise os pontos em que houve perda de pontuação.':'Recomenda-se revisar planejamento, segurança, materiais e indicadores antes de uma nova tentativa.'}</p><p><b>Documento:</b> ${r.documentId||'—'}</p><button class='primary' onclick='showHome()'>Voltar à campanha</button></div>`;
  };

  window.intStep1=function(){const v=radio('intPriority');if(!v)return alert('Selecione uma prioridade.');state.integrator.answers.priority=v;if(v==='B')state.integrator.score+=20;else{state.integrator.score+=5;state.budget=Math.max(0,state.budget-350);}state.integrator.step=2;save();renderIntegrator();};
  window.intStep2=function(){const v=checked('intPlan');if(!v.length)return alert('Selecione os elementos de planejamento.');const needed=['nr12','energy','guard','risk','os','test'];const ok=needed.every(x=>v.includes(x))&&!v.includes('improvise');state.integrator.answers.plan=v;if(ok)state.integrator.score+=20;else{state.integrator.score+=8;state.safety=Math.max(0,state.safety-5);state.budget=Math.max(0,state.budget-500);}state.integrator.step=3;save();renderIntegrator();};
  window.intStep3=function(){const v=radio('intBuy');if(!v)return alert('Escolha o fluxo administrativo.');state.integrator.answers.purchase=v;if(v==='buy'){state.integrator.score+=20;if(state.budget>=1250){state.budget-=1250;ensureOperations(state);state.operations.materialRequests.push({id:'RM-INT-'+Date.now().toString(36).toUpperCase(),osId:'OS-INT-01',items:['guardSwitch'],missing:['guardSwitch'],created:new Date().toISOString()});state.operations.purchaseOrders.push({id:'OC-INT-'+String(state.operations.purchaseOrders.length+1).padStart(3,'0'),osId:'OS-INT-01',items:[{id:'guardSwitch',name:'Chave de segurança para proteção móvel',qty:1,unit:1250,total:1250}],total:1250,status:'EXPEDIDA',created:new Date().toISOString()});}}else{state.integrator.score+=4;state.safety=Math.max(0,state.safety-10);state.budget=Math.max(0,state.budget-700);}state.integrator.step=4;save();renderIntegrator();};
  window.intStep4=function(){const v=radio('intKpi');if(!v)return alert('Selecione uma interpretação.');state.integrator.answers.kpi=v;if(v==='better')state.integrator.score+=20;else state.integrator.score+=5;state.integrator.step=5;save();renderIntegrator();};
  window.intStep5=function(){const v=radio('intClose');if(!v)return alert('Selecione a decisão final.');state.integrator.answers.close=v;if(v==='close')state.integrator.score+=20;else{state.integrator.score+=4;state.budget=Math.max(0,state.budget-400);}state.integrator.step=6;state.integrator.completed=new Date().toISOString();state.integrator.documentId='INT-PCM-'+new Date().getFullYear()+'-'+String(Date.now()).slice(-6);state.documents=state.documents||{};state.documents.integrator={id:state.integrator.documentId,created:state.integrator.completed,score:state.integrator.score,answers:state.integrator.answers,validation:{status:'Aguardando validação do professor'}};save();renderIntegrator();};

  const baseShowHome=showHome;
  showHome=function(){if(state?.developerMode||state?.avatar===SPECIAL_AVATAR)configureDeveloper(state);else if(state?.teacherMode)configureProfessor(state);baseShowHome();decorateBadges();addIntegratorCard();const main=document.querySelector('#home main');const old=document.getElementById('professorModeBanner');if(old)old.remove();if(state?.teacherMode&&main){const b=document.createElement('div');b.id='professorModeBanner';b.className='warning-line';b.style.marginBottom='14px';b.innerHTML=`<b>🔧 ${state.developerMode?'MODO DESENVOLVEDOR / PROFESSOR':'MODO PROFESSOR'}</b> — ${escHtml(state.name)} • 60 níveis e Atividade Integradora liberados para testes.`;main.insertBefore(b,main.firstChild);save();}};

  installStyles();addField();installIntegrator();decorateBadges();
  document.title='EngControl — v'+VERSION;document.querySelectorAll('.landing-brand .beta').forEach(v=>v.textContent='v'+VERSION);
  setTimeout(()=>{addField();decorateBadges();addIntegratorCard();},50);
})();
