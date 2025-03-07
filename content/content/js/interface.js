/*************************************interface button******************************************/
const user = document.querySelector('.user');
const muser = document.querySelector('.container .menu-list');
const chatai = document.querySelector('.chatai');
const menuList = document.querySelector(".container .menu-list");
const userIcon = document.querySelector(".user");
const adminbutton = document.getElementById('admin-button');
adminbutton.disabled = true;
/*************************************elements button******************************************/
const btnpretest = document.getElementById('btnpretest');
const btnposttest = document.getElementById('btnposttest');
const btnwpretest = document.getElementById('btnwpretest');
const btnwposttest = document.getElementById('btnwposttest');

const btnchatroom = document.getElementById('btnchatroom');
const buttonsArray = [btnpretest,btnposttest,btnwpretest,btnwposttest,btnchatroom];

/*************************************iframes add******************************************/
const pretest = document.querySelector('.container .pretest');
const posttest = document.querySelector('.container .posttest');
const wpretest = document.querySelector('.container .wpretest');
const wposttest = document.querySelector('.container .wposttest');
const chat = document.querySelector('.container .chat');
const act1 = document.querySelector('.container .act1');
const elearray = [chat, act1,pretest,wpretest,posttest,wposttest];

/*************************************btn iframe******************************************/

btnchatroom.addEventListener('click', () => {hiddenele(0);});
chatai.addEventListener('click', () => {hiddenele(1);});
btnpretest.addEventListener('click', () => {hiddenele(2);});
btnwpretest.addEventListener('click', () => {hiddenele(3);});
btnposttest.addEventListener('click', () => {hiddenele(4);});
btnwposttest.addEventListener('click', () => {hiddenele(5);});
/************************************remove function******************************************/
function hiddenele(page) {
  if (!elearray || elearray.length === 0) return; // Ensure elearray is defined
  for (let i = 0; i < elearray.length; i++) {
    if (i === page) continue; // Skip the iteration when i equals page
    console.log(page);
    if (elearray[i].classList.contains('show')) {
      elearray[i].classList.toggle('hidden');
      elearray[i].classList.remove('show');
    }
  }
  // Toggle 'show' class for the specific page element
  if (elearray[page]) {
    if ( elearray[page].classList.contains('show')) {
      elearray[page].classList.remove('show');
      elearray[page].classList.toggle('hidden');
    } else {
      elearray[page].classList.toggle('show');
      elearray[page].classList.remove('hidden');
      }
}
}
/*************************************user function******************************************/
user.addEventListener('click', () => {
  user.classList.toggle('close');
  muser.classList.toggle('show');
  const menuWidth = menuList.offsetWidth ; // Get the actual width of menu-list
  userIcon.style.setProperty("--menu-width", `${menuWidth}px`); // Update CSS variable
});

adminbutton.addEventListener('click', () => {
  window.open('results.html', '_blank');
});

/************************************************************************/
const pages = ["cont1.html", "cont2.html","cont3.html","cont4.html","cont5.html","cont6.html"];

function openpages(num)
{
  window.location.href = pages[num] ; // Redirect back to login page

}
