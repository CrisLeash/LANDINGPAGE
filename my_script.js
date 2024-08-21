
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