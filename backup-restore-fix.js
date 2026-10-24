(function(){
  'use strict';
  var STORAGE = {
    1:{answers:'step-one-complete-v4-',notes:'stepOneNotes_',state:'step-one-v4-resume-state'},
    2:{answers:'step-two-complete-v1-',notes:'stepOneNotes_',state:'step-two-v1-resume-state'},
    3:{answers:'step-three-complete-v1-',notes:'stepOneNotes_',state:'step-three-v1-resume-state'},
    4:{answers:'step-four-complete-v1-',notes:'stepOneNotes_',state:'step-four-v1-resume-state'},
    5:{answers:'step-five-complete-v1-',notes:'stepOneNotes_',state:'step-five-v1-resume-state'},
    6:{answers:'step-six-complete-v1-',notes:'stepOneNotes_',state:'step-six-v1-resume-state'},
    7:{answers:'step-seven-v1-',notes:'step7Notes_',state:'step-seven-v1-resume-state'},
    8:{answers:'step-eight-v1-',notes:'step8Notes_',state:'step-eight-v1-resume-state'},
    9:{answers:'step-nine-v1-',notes:'step9Notes_',state:'step-nine-v1-resume-state'},
    10:{answers:'step-ten-v1-',notes:'step10Notes_',state:'step-ten-v1-resume-state'},
    11:{answers:'step-eleven-v1-',notes:'step11Notes_',state:'step-eleven-v1-resume-state'},
    12:{answers:'step-twelve-v1-',notes:'step12Notes_',state:'step-twelve-v1-resume-state'}
  };

  function targetDocument(){
    if(document.getElementById('main')) return document;
    var frame=document.querySelector('iframe');
    try { if(frame && frame.contentDocument && frame.contentDocument.getElementById('main')) return frame.contentDocument; } catch(e) {}
    return null;
  }
  function collect(prefix){
    var out={};
    for(var i=0;i<localStorage.length;i++){
      var key=localStorage.key(i);
      if(key && key.indexOf(prefix)===0) out[key.slice(prefix.length)]=localStorage.getItem(key);
    }
    return out;
  }
  function makeBackup(){
    var steps={};
    Object.keys(STORAGE).forEach(function(n){
      var k=STORAGE[n];
      steps[n]={answers:collect(k.answers),notes:collect(k.notes),state:localStorage.getItem(k.state)};
    });
    return {format:'NA-Step-Working-Guide-Backup',version:1,createdAt:new Date().toISOString(),steps:steps};
  }
  function downloadBackup(doc){
    var data=JSON.stringify(makeBackup(),null,2);
    var blob=new Blob([data],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=doc.createElement('a');
    a.href=url;a.download='NA-Working-Guide-Answers-Backup.json';
    doc.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},1000);
    var status=doc.getElementById('naBackupStatus');
    if(status) status.textContent='Backup file created. Keep it somewhere safe so you can restore your answers later.';
  }
  function restoreFile(file,doc){
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var data=JSON.parse(reader.result);
        if(!data || data.format!=='NA-Step-Working-Guide-Backup' || !data.steps) throw new Error('invalid');
        var restored=0;
        Object.keys(STORAGE).forEach(function(n){
          var k=STORAGE[n],s=data.steps[n]||data.steps[String(n)];
          if(!s)return;
          ['answers','notes'].forEach(function(type){
            var values=s[type]||{};
            Object.keys(values).forEach(function(id){
              var key=k[type]+id;
              localStorage.setItem(key,String(values[id]==null?'':values[id]));
              restored++;
            });
          });
          if(s.state) localStorage.setItem(k.state,String(s.state));
        });
        if(!restored) throw new Error('empty');
        alert('Restore complete: '+restored+' saved answer/note entries restored across your NA workbook.');
        var frame=window.frameElement;
        if(frame && frame.contentWindow) frame.contentWindow.location.reload();
        else if(doc.defaultView) doc.defaultView.location.reload();
      }catch(e){alert('This backup file could not be restored. Please choose a JSON backup exported from the NA Working Guide.');}
    };
    reader.onerror=function(){alert('The backup file could not be read. Please try again.');};
    reader.readAsText(file);
  }
  function install(){
    var doc=targetDocument();
    if(!doc || !doc.body)return;
    var main=doc.getElementById('main'),h=main&&main.querySelector('h1');
    var isHome=!!(h && /^The Narcotics Anonymous Working Guide$/i.test((h.textContent||'').trim()));
    var old=doc.getElementById('naHomeBackupRestore');
    if(!isHome){if(old)old.remove();return;}
    if(old)return;
    var panel=doc.createElement('section');
    panel.id='naHomeBackupRestore';
    panel.style.cssText='margin:18px 0 22px;padding:16px;border:1px solid #d7d7d7;border-radius:14px;background:#f8f8f8';
    panel.innerHTML='<h2 style="margin:0 0 6px;font-size:20px">Save & Restore Your Work</h2><p style="margin:0 0 12px;line-height:1.5;color:#444">Your answers save automatically on this device. Export a backup before changing devices or clearing browser data.</p><div style="display:flex;flex-wrap:wrap;gap:8px"><button type="button" id="naExportAnswers">Export My Answers</button><button type="button" class="secondary" id="naRestoreAnswers">Restore My Answers</button></div><input type="file" id="naRestoreFile" accept=".json,application/json" style="display:none"><div id="naBackupStatus" role="status" style="font-size:13px;color:#555;line-height:1.4;margin-top:10px">Backup files include saved answers, notes, and resume positions for all 12 steps.</div>';
    var firstCard=main.querySelector('.card');
    if(firstCard) main.insertBefore(panel,firstCard); else main.appendChild(panel);
    doc.getElementById('naExportAnswers').addEventListener('click',function(){downloadBackup(doc)});
    var input=doc.getElementById('naRestoreFile');
    doc.getElementById('naRestoreAnswers').addEventListener('click',function(){input.click()});
    input.addEventListener('change',function(){if(input.files&&input.files[0])restoreFile(input.files[0],doc);input.value=''});
  }
  function start(){
    install();
    var frame=document.querySelector('iframe');
    if(frame) frame.addEventListener('load',function(){setTimeout(install,100);setTimeout(install,500)});
    var observer=new MutationObserver(function(){install()});
    observer.observe(document.body,{childList:true,subtree:true});
    setInterval(install,700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();