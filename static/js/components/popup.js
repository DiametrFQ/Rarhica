const showPopup = (status, responseText, color) => {
  $(".popup__status").html(status);
  $(".popup__message").html(responseText);
  $(".popup").css("background-color", color);

  $(".popup").css("left", 0);
  setTimeout(() => {
    $(".popup").css("left", "-340px");
  }, 2000);
};

window.showPopup = showPopup;

export default showPopup;
