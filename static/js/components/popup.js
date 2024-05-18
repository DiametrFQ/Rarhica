const showPopup = (responseText) => {
  $(".popup").html(responseText);
  $(".popup").css("left", 0);
  setTimeout(() => {
    $(".popup").css("left", "-340px");
  }, 2000);
};

window.showPopup = showPopup;

export default showPopup;
