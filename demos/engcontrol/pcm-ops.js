/* EngControl v1.3.5 — Biblioteca categorizada + PCM operacional */
'use strict';

(function(){
  const CATEGORY_MAP=[
    {id:'fundamentos',title:'Fundamentos da Manutenção',icon:'⚙️',ids:['fundamentos','estrategias']},
    {id:'planejamento',title:'Planejamento e Controle',icon:'📋',ids:['planejamento','custos','indicadores','preventiva','preditiva']},
    {id:'qualidade',title:'Falhas, Qualidade e Melhoria',icon:'🧭',ids:['qualidade','5s','pdca','5w2h','ishikawa']},
    {id:'digital',title:'Manutenção 4.0 e Sistemas',icon:'📡',ids:['dadosiot','ia','cmms']},
    {id:'seguranca',title:'Segurança e Normas Regulamentadoras',icon:'🛡️',ids:['seguranca','epi-ca','nr1','nr5','nr7','nr9','nr10','nr12','nr13','nr17','nr18','nr20','nr33','nr35']},
    {id:'normas',title:'Normas ABNT / ISO e Gestão de Ativos',icon:'📚',ids:['iso41001','nbr16747','nbr5674','nbr15575','nbr14037','nbr16955','iso31000','nbr14653','iso22301']}
  ];
  let activeLibraryCategory='all';

  function categoryFor(content){
    return CATEGORY_MAP.find(c=>c.ids.includes(content.id)) || {id:'outros',title:'Outros conteúdos',icon:'📘'};
  }

  function ensureLibraryCategoryUI(){
    const grid=document.getElementById('libraryGrid');
    if(!grid || document.getElementById('libraryCategories')) return;
    const bar=document.createElement('div');
    bar.id='libraryCategories';
    bar.className='library-categories';
    bar.innerHTML=`<button class="lib-cat active" data-cat="all">Todos</button>`+CATEGORY_MAP.map(c=>`<button class="lib-cat" data-cat="${c.id}">${c.icon} ${c.title}</button>`).join('');
    grid.parentNode.insertBefore(bar,grid);
    bar.addEventListener('click',e=>{
      const b=e.target.closest('[data-cat]'); if(!b)return;
      activeLibraryCategory=b.dataset.cat;
      bar.querySelectorAll('.lib-cat').forEach(x=>x.classList.toggle('active',x===b));
      renderLibrary();
    });
  }

  const originalRenderLibrary=renderLibrary;
  renderLibrary=function(){
    ensureLibraryCategoryUI();
    const q=(el.librarySearch?.value||'').trim().toLowerCase();
    let list=PCM_CONTENT.filter(c=>!q||(`${c.title} ${c.summary}`).toLowerCase().includes(q));
    if(activeLibraryCategory!=='all') list=list.filter(c=>categoryFor(c).id===activeLibraryCategory);
    const groups=[];
    CATEGORY_MAP.concat([{id:'outros',title:'Outros conteúdos',icon:'📘'}]).forEach(cat=>{
      const items=list.filter(c=>categoryFor(c).id===cat.id);
      if(items.length)groups.push({cat,items});
    });
    el.libraryGrid.innerHTML=groups.map(g=>`<section class="library-group"><div class="library-group-head"><span>${g.cat.icon}</span><div><h3>${g.cat.title}</h3><small>${g.items.length} conteúdo(s)</small></div></div><div class="library-group-grid">${g.items.map(c=>`<div class='library-card' onclick='openContent("${c.id}")'><div style='font-size:30px'>${c.icon}</div><h3>${c.title}</h3><p>${c.summary}</p><div class='related-levels'>${c.levels.slice(0,4).map(n=>`<span class='related-level'>N${n}</span>`).join('')}${c.levels.length>4?`<span class='related-level'>+${c.levels.length-4}</span>`:''}</div></div>`).join('')}</div></section>`).join('')||`<p>Nenhum conteúdo encontrado.</p>`;
  };

  // Complementos operacionais
  const extraStock=[
    {id:'respirator',name:'Respirador semifacial com filtro adequado — CA simulado válido',type:'EPI',qty:2,min:1,cost:360,ca:'CA-66201',caValid:true,condition:'Apto'},
    {id:'gasDetector',name:'Detector multigases calibrado',type:'instrumento',qty:1,min:1,cost:4200},
    {id:'tripod',name:'Tripé de resgate para espaço confinado',type:'EPC',qty:0,min:1,cost:5200},
    {id:'bearing',name:'Rolamento 6312 C3',type:'sobressalente',qty:0,min:1,cost:890},
    {id:'sealKit',name:'Kit de vedação para bomba centrífuga',type:'sobressalente',qty:1,min:1,cost:640},
    {id:'thermalCam',name:'Câmera termográfica',type:'instrumento',qty:1,min:1,cost:7800},
    {id:'fireExt',name:'Extintor adequado e inspecionado',type:'EPC',qty:2,min:1,cost:420}
  ];
  const extraCatalog=[
    {id:'tripod',name:'Tripé de resgate para espaço confinado',cost:5200},
    {id:'bearing',name:'Rolamento 6312 C3',cost:890},
    {id:'sealKit',name:'Kit de vedação para bomba centrífuga',cost:640},
    {id:'respirator',name:'Respirador semifacial com filtro adequado — CA simulado válido',cost:360},
    {id:'gasDetector',name:'Detector multigases calibrado',cost:4200}
  ];
  extraCatalog.forEach(x=>{if(!PURCHASE_CATALOG.some(y=>y.id===x.id))PURCHASE_CATALOG.push(x)});

  function ensureOpsExpansion(){
    if(!state)return;
    ensureOperations(state);
    extraStock.forEach(x=>{if(!state.operations.stock.some(y=>y.id===x.id))state.operations.stock.push(JSON.parse(JSON.stringify(x)))});
    const teamAdds={T01:['NR-33'],T02:['NR-33'],T03:['NR-33'],T04:[]};
    state.operations.team.forEach(t=>(teamAdds[t.id]||[]).forEach(s=>{if(!t.skills.includes(s))t.skills.push(s)}));
    const assets=[
      {id:'BOM-12',name:'Bomba centrífuga do sistema de utilidades',criticality:'Alta',history:['Vazamento crescente no selo mecânico','Ruído de rolamento registrado há 2 semanas']},
      {id:'RES-03',name:'Reservatório de processo — espaço confinado',criticality:'Alta',history:['Inspeção interna programada','Última entrada registrada há 14 meses']},
      {id:'QGBT-02',name:'QGBT do prédio administrativo',criticality:'Alta',history:['Ponto quente registrado em inspeção termográfica','Sem parada não programada no último ano']},
      {id:'CASA-05',name:'Casa de bombas de combustível',criticality:'Crítica',history:['Inspeção de segurança pendente','Área com risco de inflamáveis']}
    ];
    assets.forEach(a=>{if(!state.operations.assets.some(x=>x.id===a.id))state.operations.assets.push(a)});
  }

  Object.assign(BONUS_MISSIONS,{
    pump:{id:'pump',triggerLevel:15,title:'Bomba com vazamento e ruído crescente',icon:'💧',reward:2400,assetId:'BOM-12',engine:'ops2',related:['planejamento','custos'],theory:[
      `<div class='theory-box'><h3>Planejar corretiva sem transformar defeito conhecido em emergência</h3><p>A bomba ainda opera, mas há vazamento e ruído crescente. O aluno deve avaliar criticidade, equipe, bloqueio, ferramentas, peças e janela operacional antes de liberar a intervenção.</p></div>`,
      `<div class='theory-grid'><div class='concept-card'><h3>RM antes de OC</h3><p>Itens internos devem ser requisitados ao estoque. Somente faltas reais justificam compra.</p></div><div class='concept-card'><h3>Orçamento</h3><p>A OC precisa ser tecnicamente coerente e caber no fundo disponível.</p></div></div>`],
      requirements:{teamMin:2,skills:['Mecânica'],epi:['helmet','lockout'],procedures:['risk','energy','isolation','functional'],materials:['sealKit','bearing','multimeter']}
    },
    confined:{id:'confined',triggerLevel:28,title:'Inspeção interna em reservatório',icon:'🕳️',reward:3200,assetId:'RES-03',engine:'ops2',related:['nr33','epi-ca','planejamento'],theory:[
      `<div class='theory-box'><h3>Espaço confinado: a OS só avança quando o resgate também está planejado</h3><p>A entrada em reservatório exige análise prévia, equipe capacitada conforme o cenário, controle de energias, avaliação atmosférica, comunicação, supervisão e recursos de emergência.</p></div>`,
      `<div class='warning-line'><b>Regra da missão:</b> ausência de recurso obrigatório de segurança suspende a OS. Prazo e orçamento não autorizam improviso.</div>`],
      requirements:{teamMin:3,skills:['NR-33'],epi:['helmet','respirator','lockout'],procedures:['risk','energy','atmosphere','rescue','permit'],materials:['gasDetector','tripod']}
    },
    qgbt:{id:'qgbt',triggerLevel:33,title:'Ponto quente em QGBT crítico',icon:'🔥',reward:2700,assetId:'QGBT-02',engine:'ops2',related:['nr10','preditiva','indicadores'],theory:[
      `<div class='theory-box'><h3>Termografia detectou anomalia antes da falha</h3><p>O aluno deve usar o dado de condição para programar uma intervenção segura, evitando tanto a parada imediata injustificada quanto a postergação sem controle.</p></div>`,
      `<div class='theory-grid'><div class='concept-card'><h3>Segurança elétrica</h3><p>Planeje bloqueio, confirmação da condição segura, equipe adequada e teste funcional.</p></div><div class='concept-card'><h3>Rastreabilidade</h3><p>Registre temperatura, ponto inspecionado, decisão e condição após a intervenção.</p></div></div>`],
      requirements:{teamMin:2,skills:['NR-10'],epi:['helmet','gloves','lockout'],procedures:['risk','energy','measure','functional'],materials:['thermalCam','insulatedTools','contactor']}
    },
    fuel:{id:'fuel',triggerLevel:48,title:'Manutenção em casa de bombas de combustível',icon:'⛽',reward:3600,assetId:'CASA-05',engine:'ops2',related:['nr20','nr10','iso31000','nbr16955'],theory:[
      `<div class='theory-box'><h3>Quando manutenção, energia e inflamáveis se encontram</h3><p>Antes da intervenção, a equipe deve reconhecer fontes de ignição, condição de processo, bloqueios, ventilação, combate a incêndio e procedimentos de emergência.</p></div>`,
      `<div class='warning-line'><b>Decisão profissional:</b> se as condições de segurança não puderem ser demonstradas, a OS deve ser suspensa e replanejada.</div>`],
      requirements:{teamMin:2,skills:['NR-10'],epi:['helmet','gloves','lockout'],procedures:['risk','energy','ignition','fire','functional'],materials:['fireExt','gasDetector','insulatedTools']}
    }
  });

  function reqLabel(code){return ({risk:'Análise de risco',energy:'Bloqueio/controle de energias',isolation:'Isolamento mecânico/processo',functional:'Teste funcional final',atmosphere:'Avaliação atmosférica',rescue:'Plano e recursos de resgate',permit:'Permissão de entrada/trabalho',measure:'Medição/diagnóstico conforme procedimento',ignition:'Controle de fontes de ignição',fire:'Recursos de prevenção e resposta a incêndio'})[code]||code}

  const originalStartBonus=startBonus;
  startBonus=function(id){
    ensureOpsExpansion();
    const m=BONUS_MISSIONS[id];
    if(!m||m.engine!=='ops2')return originalStartBonus(id);
    let ms=missionState(id);ms.status='theory';ms.attempts=(ms.attempts||0)+1;
    let os=addOS(id,m.title,m.assetId);os.assetId=m.assetId;osStatus(os,'EM ANÁLISE','OS recebida e encaminhada para planejamento');
    bonusRuntime={id,page:0};renderBonusTheory();show('bonusTheory');
  };

  const originalRenderBonusMission=renderBonusMission;
  renderBonusMission=function(){
    const id=bonusRuntime?.id,m=BONUS_MISSIONS[id];
    if(!m||m.engine!=='ops2')return originalRenderBonusMission();
    ensureOpsExpansion();
    let ms=missionState(id),os=openOS(ms.osId);
    $('bonusMissionBody').innerHTML=missionHeader(m,os)+renderGenericOSMission(m,os,ms);
  };

  function renderGenericOSMission(m,os,ms){
    if(os.status==='PRONTA PARA RETOMADA'||ms.stage==='resume'){
      return `<div class='keyline'><b>Recursos disponíveis.</b> A OS pode ser retomada.</div><div class='mission-field'><h3>Validação antes da execução</h3>${bonusOption('opsResume','controls','Revalidar controles e condição segura')} ${bonusOption('opsResume','resources','Confirmar equipe, ferramentas e materiais')} ${bonusOption('opsResume','test','Executar teste funcional/critério de aceitação')} ${bonusOption('opsResume','close','Registrar condição final e encerramento')}</div><button class='primary' onclick='finishGenericOS("${m.id}")'>Executar e encerrar OS</button>`;
    }
    const r=m.requirements;
    return `<div class='real-box'><h3>OS ${os.id}</h3><p>Analise a ocorrência e libere a intervenção somente quando equipe, segurança e recursos estiverem adequados.</p></div><div class='mission-grid'>
      <div class='mission-field'><h3>1. Equipe</h3>${state.operations.team.map(t=>bonusOption('opsTeam',t.id,`${t.name} — ${t.skills.join(', ')}`)).join('')}</div>
      <div class='mission-field'><h3>2. EPI / EPC</h3>${r.epi.map(id=>{let s=stockItem(id);return bonusOption('opsEpi',id,`${s?.name||id}${s?.ca?` • ${s.ca} • ${s.caValid?'CA simulado válido':'CA simulado NÃO válido'}`:''}`)}).join('')}<label><input type='checkbox' id='opsCaChecked'> Conferi condição e CA quando aplicável</label></div>
      <div class='mission-field'><h3>3. Procedimentos</h3>${r.procedures.map(p=>bonusOption('opsProc',p,reqLabel(p))).join('')}</div>
      <div class='mission-field'><h3>4. RM / recursos</h3>${r.materials.map(id=>{let s=stockItem(id);return bonusOption('opsMat',id,`${s?.name||id} — estoque: ${s?.qty??0}`)}).join('')}</div>
    </div><button class='primary' onclick='submitGenericOS("${m.id}")'>Registrar planejamento e emitir RM</button>`;
  }

  window.submitGenericOS=function(id){
    const m=BONUS_MISSIONS[id],r=m.requirements,ms=missionState(id),os=openOS(ms.osId);
    const team=selected('opsTeam'),epi=selected('opsEpi'),proc=selected('opsProc'),mat=selected('opsMat');
    const caChecked=$('opsCaChecked')?.checked;
    const teamOk=team.length>=r.teamMin && r.skills.every(skill=>team.some(tid=>state.operations.team.find(t=>t.id===tid)?.skills.includes(skill)));
    const epiOk=r.epi.every(x=>epi.includes(x));
    const procOk=r.procedures.every(x=>proc.includes(x));
    const invalid=epi.some(x=>stockItem(x)?.caValid===false);
    os.requirements={team,epi,proc,materials:mat,caChecked};
    os.history.push({date:new Date().toISOString(),event:'Planejamento técnico e administrativo registrado'});
    if(!teamOk||!epiOk||!procOk||!caChecked||invalid){
      finance('Reprogramação '+os.id+' — planejamento incompleto',-600,'erro-missao');
      osStatus(os,'REPROGRAMADA','OS não liberada: requisitos obrigatórios incompletos ou não conformes');
      renderBonusMission();return;
    }
    const missing=consumeOrReserve(mat,os);
    os.materialRequest={id:'RM-'+Date.now().toString(36).toUpperCase(),items:mat,missing,created:new Date().toISOString()};
    state.operations.materialRequests.push({...os.materialRequest,osId:os.id});
    os.history.push({date:new Date().toISOString(),event:os.materialRequest.id+' emitida'});
    if(missing.length){renderPurchaseForOS(os,missing);return;}
    osStatus(os,'EM EXECUÇÃO','Equipe, controles e recursos confirmados; intervenção liberada');
    ms.stage='resume';renderBonusMission();
  };

  window.finishGenericOS=function(id){
    const checks=selected('opsResume');
    if(checks.length<4)return alert('Conclua todas as validações antes de encerrar a OS.');
    const ms=missionState(id),os=openOS(ms.osId);
    osStatus(os,'CONCLUÍDA','Serviço executado, critério de aceitação atendido e OS encerrada');
    completeBonus(id,true,'OS concluída com planejamento, recursos e rastreabilidade completos');
  };

  const originalOpenOperations=openOperations;
  openOperations=function(){ensureOpsExpansion();return originalOpenOperations();};

  const originalRenderOperations=renderOperations;
  renderOperations=function(tab='os'){
    ensureOpsExpansion();
    originalRenderOperations(tab);
    if(tab==='os'){
      document.querySelectorAll('#opsContent .ops-card').forEach(card=>{
        const details=card.querySelector('details');
        if(details&&!details.dataset.timeline){details.dataset.timeline='1';details.classList.add('os-timeline')}
      });
    }
  };

  const style=document.createElement('style');
  style.textContent=`
    .library-categories{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 6px}.lib-cat{border:1px solid #334155;background:#0b1220;color:#cbd5e1;padding:9px 12px;border-radius:999px;font-weight:800;cursor:pointer}.lib-cat.active{border-color:#38bdf8;color:#e0f2fe;background:rgba(56,189,248,.12)}
    #libraryGrid.library-grid{display:block}.library-group{margin:22px 0 30px}.library-group-head{display:flex;gap:10px;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #243244}.library-group-head>span{font-size:28px}.library-group-head h3{margin:0;color:#e2e8f0}.library-group-head small{color:#94a3b8}.library-group-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.os-timeline ul{list-style:none;padding-left:0}.os-timeline li{padding:8px 10px;border-left:3px solid #38bdf8;margin:6px 0;background:rgba(56,189,248,.05);border-radius:0 8px 8px 0}
    @media(max-width:900px){.library-group-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.library-group-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  // garante dados adicionais em saves existentes
  if(state)ensureOpsExpansion();
})();
