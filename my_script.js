

const circleAnimate = document.getElementById('circleAnimation' , 'sacrix') 

window.addEventListener('scroll', function() {
  const scrollPosition = window.scrollY = 0;
  const maxScroll = document.documentElement.scrolHeight - this.window.innerHeight;

  const newYposition = 100 + (scrollPosition / maxScroll) * 100;

  circleAnimate.setAttribute('cy', newYposition);

  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

//BUTTONS

document.getElementById('btn_portfolio').addEventListener('click', function() {
  window.open('https://www.behance.net/cristiarodrigu420/projects', '_blank');
  return false;
});

document.getElementById('btn_linkedin').addEventListener('click', function() {
  window.open('https://www.linkedin.com/in/crodrigues93/', '_blank');
  return false;
});

document.getElementById('btn_twitter').addEventListener('click', function() {
  window.open('https://twitter.com/cris_Leash', '_blank');
  return false;
});

document.getElementById('btn_github').addEventListener('click', function() {
  window.open('https://github.com/CrisLeash', '_blank');
  return false;
});

document.getElementById('btn_IG').addEventListener('click', function() {
  window.open('https://www.instagram.com/crisleash/', '_blank');
  return false;
});


// Function to copy text to clipboard
function copyToClipboard(text) {
    // Modern approach using Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard! ✓');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard! ✓');
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy');
    }
    
    document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message) {
    // Check if toast already exists
    let toast = document.querySelector('.copy-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Add click event listeners to copyable elements
document.addEventListener('DOMContentLoaded', function() {
    const copyables = document.querySelectorAll('.copyable');
    
    copyables.forEach(element => {
        element.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyToClipboard(textToCopy);
        });
    });
});


// carousel 


document.addEventListener("DOMContentLoaded", function() {
    const heroSwiper = new Swiper('.hero-swiper .swiper-container', {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      speed: 800,
      navigation: {
        nextEl: '.hero-swiper .swiper-button-next',
        prevEl: '.hero-swiper .swiper-button-prev',
      },
      pagination: {
        el: '.hero-swiper .swiper-pagination',
        clickable: true,
      },
    });
  });
