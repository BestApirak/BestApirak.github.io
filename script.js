// Smooth scrolling for in-page navigation and set current year
document.addEventListener('DOMContentLoaded', function(){
  // set year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', '#'+targetId);
      }
    });
  });

  // Profile image upload / preview / persistence
  const fileInput = document.getElementById('profileUpload');
  const preview = document.getElementById('profilePreview');
  const heroAvatar = document.getElementById('heroAvatar');
  const removeBtn = document.getElementById('removeImage');
  const modal = document.createElement('div');

  function openModal(src){
    let imgModal = document.getElementById('imgModal');
    if(!imgModal){
      imgModal = document.createElement('div');
      imgModal.id = 'imgModal';
      imgModal.className = 'img-modal';
      imgModal.setAttribute('aria-hidden', 'true');
      imgModal.innerHTML = '<div class="img-modal-content"><img id="modalImg"><button class="close-modal" aria-label="Close">×</button></div>';
      document.body.appendChild(imgModal);
      imgModal.querySelector('.close-modal').addEventListener('click', function(){ imgModal.setAttribute('aria-hidden','true'); });
      imgModal.addEventListener('click', function(e){ if(e.target === imgModal) imgModal.setAttribute('aria-hidden','true'); });
    }
    const modalImg = document.getElementById('modalImg');
    modalImg.src = src;
    imgModal.setAttribute('aria-hidden','false');
  }

  // load saved image from localStorage
  try{
    const saved = localStorage.getItem('profileImage');
    if(saved){
      preview.src = saved; preview.style.display = 'block';
      heroAvatar.src = saved; removeBtn.style.display = 'inline-block';
    }
  }catch(e){console.warn('Could not access localStorage', e)}

  if(preview){
    preview.addEventListener('click', function(){
      if(this.src) openModal(this.src);
    });
  }

  if(fileInput){
    fileInput.addEventListener('change', function(e){
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = function(ev){
        const data = ev.target.result;
        preview.src = data; preview.style.display = 'block';
        heroAvatar.src = data; removeBtn.style.display = 'inline-block';
        try{ localStorage.setItem('profileImage', data); }catch(err){console.warn('Save failed', err)}
      };
      reader.readAsDataURL(file);
    });
  }

  if(removeBtn){
    removeBtn.addEventListener('click', function(){
      try{ localStorage.removeItem('profileImage'); }catch(e){}
      const def = heroAvatar.getAttribute('data-default') || '';
      heroAvatar.src = def;
      preview.src = ''; preview.style.display = 'none';
      removeBtn.style.display = 'none';
      if(fileInput) fileInput.value = '';
    });
  }
});
