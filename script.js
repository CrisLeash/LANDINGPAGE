// 1- select the portfolio button
//2- add eventlistener click
//3- make it move when click
//4-open the link in new tab

//BACKGROUND - css
//1- make some shape in the background
//2- make the background move when scrolling

const btn = document.querySelector('#btn');

btn.addEventListener('mouseover', (e) => {
    e.preventDefault();
   document.querySelector('#btn').style.background = '#000';
   document.querySelector('#btn').style.color = '#ccc';
  
});