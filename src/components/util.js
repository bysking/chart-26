// 截图方法
export function catchPicture(obj) {
  var imgUri = "";
  var scale = 1;
  var dom = document.querySelector(obj.dom);
  return new Promise(function (success, fail) {
    html2canvas(document.querySelector(obj.dom), {
      scale: scale,
      width: dom.offsetWidth,
      height: dom.offsetHeight,
    }).then(function (canvas) {
      imgUri = canvas.toDataURL("image/png", 0);
      if (imgUri) {
        success(imgUri);
      } else {
        fail("error");
      }
    });
  });
}
