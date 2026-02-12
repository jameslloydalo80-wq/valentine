import { initializeApp } from "";
import { getDatabase, ref, set } from "";

  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
  
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function saveData(id,data){
    set(ref(db,'valentine/'+id),data)
      .then(() => console.log("Data saved:", data))
      .catch(err => console.error("Error saving:", err));
}


function getParams(){ return new URLSearchParams(window.location.search); }

function createFlowers(){
    const flowerImage = 'fla.png';
    for(let i=0;i<100;i++){
        const f = document.createElement('img');
        f.src = flowerImage;
        f.className='flower';
        f.style.left=Math.random()*90+'%';
        f.style.top=Math.random()*90+'%';
        f.style.animationDuration=(4+Math.random()*5)+'s';
        f.style.animationDelay=(Math.random()*5)+'s';
        document.body.appendChild(f);
    }
}

function initIndexPage(){
    const createBtn=document.getElementById('createBtn');
    const downloadBtn=document.getElementById('downloadBtn');
    if(!createBtn) return;

    createBtn.addEventListener('click',()=>{
        const from=document.getElementById('from').value.trim();
        const to=document.getElementById('to').value.trim();
        if(!from||!to) { alert("Fill both names!"); return; }
      
        const url=`?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        document.getElementById('qrcode').innerHTML='';
        new QRCode(document.getElementById('qrcode'),{text:url,width:200,height:200});

        const id=Date.now();
        saveData(id,{stage:'indexQR',from,to,createdAt:new Date().toISOString()});

        setTimeout(()=>{
            const qrImg=document.querySelector('#qrcode img');
            if(qrImg) downloadBtn.onclick=()=>{ 
                const link=document.createElement('a');
                link.href=qrImg.src; link.download='valentine_qrcode.png'; link.click();
            }
        },100);
    });
}
function initDatePage(){
    if(!document.getElementById('details')) return;

    createFlowers();
    const urlParams=getParams();
    const fromName=urlParams.get('from')||'Someone';
    const toName=urlParams.get('to')||'You';

    const inviteText=document.getElementById('inviteText');
    if(inviteText) inviteText.innerText=` ${fromName} invites ${toName} on Valentine’s Day! `;

    

    const cancelBtn=document.getElementById('cancelCardBtn');
    if(cancelBtn) cancelBtn.addEventListener('click',()=>{
        document.getElementById('details').classList.add('hidden');
        const question=document.getElementById('question');
        if(question) question.classList.remove('hidden');
        const choices=document.getElementById('choices');
        if(choices) choices.classList.remove('hidden');
        document.getElementById('finalQR').innerHTML='';
        const downloadBtn=document.getElementById('downloadBtn');
        if(downloadBtn) downloadBtn.style.display='none';
    });

    const createQRBtn=document.getElementById('createQR');
    if(createQRBtn) createQRBtn.addEventListener('click',()=>{
        const location=document.getElementById('location').value||'Unknown location';
        const time=document.getElementById('time').value||'Unknown time';
        const outfit=document.getElementById('outfit').value||'Any color';
        const resultURL=`?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}&location=${encodeURIComponent(location)}&time=${encodeURIComponent(time)}&outfit=${encodeURIComponent(outfit)}`;

        document.getElementById('finalQR').innerHTML='';
        new QRCode(document.getElementById('finalQR'),{text:resultURL,width:200,height:200});

        const id=Date.now();
        saveData(id,{stage:'dateQR',from:fromName,to:toName,location,time,outfit,createdAt:new Date().toISOString()});

        const downloadBtn=document.getElementById('downloadBtn');
        downloadBtn.style.display='block';
        const qrDiv=document.getElementById('finalQR');
        downloadBtn.onclick=()=>{
            const img=qrDiv.querySelector('img');
            if(img){const link=document.createElement('a'); link.href=img.src; link.download='valentine_qr.png'; link.click();}
        }
    });
}
function playMusic() {
  const music = document.getElementById('bgMusic');
  if (music && music.paused) {
    music.play().catch(err => console.log("Autoplay blocked:", err));
  }
}


window.answer = function(choice){
    playMusic(); 

    if(choice === 'A' || choice === 'B' || choice === 'C' || choice === 'D'){
        document.getElementById('question').classList.add('hidden');
        document.getElementById('choices').classList.add('hidden');
        document.getElementById('details').classList.remove('hidden');
    } else {
        alert("Wrong answer! Try again.");
    }
};

function initResultPage(){
    const resEl=document.getElementById('result');
    if(!resEl) return;

    const urlParams=getParams();
    const fromName=urlParams.get('from')||'Someone';
    const toName=urlParams.get('to')||'You';
    const location=urlParams.get('location')||'Unknown location';
    const time=urlParams.get('time')||'Unknown time';
    const outfit=urlParams.get('outfit')||'Any color';

    resEl.innerText=`From: ${fromName}\nTo: ${toName}\nLocation: ${location}\nTime: ${time}\nOutfit Color: ${outfit}`;
}

document.addEventListener('DOMContentLoaded',()=>{
    initIndexPage();
    initDatePage();
    initResultPage();
});