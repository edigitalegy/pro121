/*-------------------------------short text----------------------------------------*/
const morebtn = document.querySelectorAll('.readMoreBtns');
const text = document.querySelectorAll('.text');

morebtn.forEach(function (button, index) {
  button.addEventListener('click', function () {
    // Toggle the `show-more` class for the corresponding text
    text[index].classList.toggle('show-more');

    // Update button text based on the visibility of the text
    this.textContent = text[index].classList.contains('show-more') ? 'عرض أقل' : 'المزيد';
  });
});

/*------------------------------- ----------------------------------------*/
