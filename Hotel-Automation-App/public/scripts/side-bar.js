function toggleMenu() {
  const navigation = document.querySelector(".navigation");
  navigation.classList.toggle("active");
}
function toggleButton(ID) {
  var btns = document.querySelectorAll("li");

  for (i = 0; i < btns.length; i++) {
    btns[i].style.borderLeft = "";
  }

  document.getElementById(ID).style.borderLeft = "3px solid white";
}
