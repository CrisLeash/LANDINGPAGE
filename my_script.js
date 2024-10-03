
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

document.getElementById('btn_portfolio').addEventListener('click', function() {
  window.open('https://crodrigues.portfoliobox.net/', '_blank');
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