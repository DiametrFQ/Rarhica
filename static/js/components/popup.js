let setTimeoutIndex = 0

const showPopup = (status, responseText, color) => {
  $(".popup__status").html(status);
  $(".popup__message").html(responseText);
  $(".popup").css("background-color", color);

  $(".popup").css("left", 0);
  clearTimeout(setTimeoutIndex);
  setTimeoutIndex = setTimeout(() => {
    $(".popup").css("left", "-340px");
  }, 3000);
};

window.showPopup = showPopup;

export default showPopup;
