(function(){
  'use strict';

  function stepNumber(){
    var m=(document.title||'').match(/Step\s+(\d+)/i);
    return m ? Number(m[1]) : 1;
  }

  function removeLegacyShare(){
    var a=document.getElementById('shareReview');
    var b=document.getElementById('sharePanel');
    if(a) a.remove();
    if(b) b.remove();
  }

  function buildFullReviewText(){
    var step=stepNumber();
    var prefix=(typeof PREFIX !== 'undefined') ? PREFIX : ('step-'+step+'-');
    var sections=(typeof SECTIONS !== 'undefined') ? SECTIONS : [];
    var questions=(typeof QUESTIONS !== 'undefined') ? QUESTIONS : [];
    var lines=[
      'An Interactive Working Guide to the 12 Steps of NA',
      'Step '+step+' — My Review Answers',
      ''
    ];
    var any=false;

    sections.forEach(function(section,si){
      var sectionLines=[];
      questions.forEach(function(q,index){
        if(q.sectionIndex!==si) return;
        var answer=(localStorage.getItem(prefix+index)||'').trim();
        if(!answer) return;
        any=true;
        sectionLines.push('• '+q.text);
        sectionLines.push('My Answer:');
        sectionLines.push(answer);
        sectionLines.push('');
      });
      if(sectionLines.length){
        lines.push(section.name.toUpperCase());
        lines.push('');
        lines=lines.concat(sectionLines);
      }
    });

    if(!any) lines.push('No answers have been saved yet.');
    return lines.join('\n').trim();
  }

  async function emailFullReview(){
    var step=stepNumber();
    var text=buildFullReviewText();
    var title='NA Step '+step+' — My Review Answers';

    if(navigator.share){
      try{
        await navigator.share({title:title,text:text});
        return;
      }catch(err){
        if(err && err.name==='AbortError') return;
      }
    }

    window.location.href='mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(text);
  }

  function captureEmailClicks(e){
    var target=e.target && e.target.closest ? e.target.closest('button') : null;
    if(!target) return;
    if((target.textContent||'').trim()!=='Email') return;
    if(!target.closest('#reviewOverlay') && !target.closest('#summaryShareCard')) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    emailFullReview();
  }

  removeLegacyShare();
  document.addEventListener('click',captureEmailClicks,true);
  new MutationObserver(removeLegacyShare).observe(document.body,{childList:true,subtree:true});
})();
