
window.onload = function () {
  function contentBgHeight() {
    var oilBg = document.querySelector('#oil-bg');
    oilBg.style.height = document.documentElement.clientHeight + 'px';
  }
  contentBgHeight();
  function scrollTopLogo() {
    var topLogo = document.querySelector('#topLogo');
    window.onscroll = function () {
      var top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top > 140) {
        topLogo.style.display = 'block';
        topLogo.style.top = '60px';
        topLogo.style.position = 'fixed';
      } else {
        topLogo.style.display = 'none';
        topLogo.style.top = '0';
      }
    }
  }
  scrollTopLogo();
  function titleMenu() {
    var menuLogo = document.querySelector('#menu');
    var menuText = document.querySelector('#menu-text');
    menuLogo.onmouseover = function () {
      menuText.style.opacity = '1';
      menuText.style.left = '60px';
      menuText.style.transition = '.6s all ease';
    }
    menuLogo.onmouseout = function () {
      menuText.style.opacity = '0';
      menuText.style.left = '0';
      menuText.style.transition = '.6s all ease';

    }
  }
  titleMenu();

  function changePosition() {
    var footerContainer = document.querySelector('footer');
    var footerImg = footerContainer.querySelectorAll('img');
    var containerWidth = footerContainer.offsetWidth;
    var containerHeight = footerContainer.offsetHeight;

    function rnd(lower, upper) {
      return parseInt(Math.random() * (upper - lower) + lower);
    }

    function CircleMove(id) {
      this.id = id;
      this.speedX = 0;
      this.speedY = 0;
      this.timer = null;
      this.lastX = 0;
      this.lastY = 0;
    }

    CircleMove.prototype.move = function () {
      var thiz = this;
      this.id.onmousedown = function (ev) {
        var e = ev || event;
        var disX = e.clientX - thiz.id.offsetLeft;
        var disY = e.clientY - thiz.id.offsetTop;
        document.onmousemove = function (ev) {
          var e = ev || event;
          var left = e.clientX - disX;
          var top = e.clientY - disY;
          thiz.id.style.left = left + 'px';
          thiz.id.style.top = top + 'px';
          thiz.speedX = e.clientX - thiz.lastX;
          thiz.speedY = e.clientY - thiz.lastY;
          thiz.lastX = e.clientX;
          thiz.lastY = e.clientY;
        };
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
          thiz.bounce();
          thiz.id.releaseCapture && thiz.id.releaseCapture();
        };
        thiz.id.setCapture && thiz.id.setCapture();
        return false;
      }
    };

    CircleMove.prototype.bounce = function () {
      var thiz = this;
      clearInterval(this.timer);
      thiz.timer = setInterval(function () {
        thiz.speedY += 1.1;
        var left = thiz.id.offsetLeft + thiz.speedX;
        var top = thiz.id.offsetTop + thiz.speedY;
        if (left > containerWidth - thiz.id.offsetWidth) {
          left = containerWidth - thiz.id.offsetWidth;
          thiz.speedX *= -0.8;
          thiz.speedY *= 0.8;
        }
        if (left <= 0) {
          left = 0;
          thiz.speedX *= -0.8;
          thiz.speedY *= 0.8;
        }
        if (top > containerHeight - thiz.id.offsetHeight) {
          top = containerHeight - thiz.id.offsetHeight;
          thiz.speedX *= 0.8;
          thiz.speedY *= -0.8;
        }
        if (top <= 0) {
          top = 0;
          thiz.speedX *= 0.8;
          thiz.speedY *= -0.8;
        }
        thiz.id.style.left = left + 'px';
        thiz.id.style.top = top + 'px';
        if (Math.abs(thiz.speedX) < 1) thiz.speedX = 0;
        if (Math.abs(thiz.speedY) < 1) thiz.speedY = 0;
        if (thiz.speedX == 0 && thiz.speedY == 0 && containerHeight -
            thiz.id.offsetHeight == thiz.id.offsetTop) {
          clearInterval(thiz.timer);
        }
      }, 16)
    };

    for (var i = 0; i < footerImg.length; i++) {
      footerImg[i].style.left = rnd(0, containerWidth) + 'px';
      (function (index) {
        var circleBounce = new CircleMove(footerImg[index]);
        circleBounce.move();
      })(i)
    }
  }
  changePosition();
  function lineDrawingShow() {

    var box = document.querySelector('.show');
    var imagesBox = document.getElementsByTagName('ul')[0];
    var imagesList = imagesBox.getElementsByTagName('li');
    var images = box.getElementsByTagName('img');
    imagesBox.style.width = imagesList[0].offsetWidth * imagesList.length +
        'px';
    var boxCenter = box.offsetWidth / 2;
    var n = 3;
    imagesBox.style.left = boxCenter - (n + 0.5) * imagesList[0].offsetWidth +
        'px';
    imagesBox.onmousedown = function(e) {
      var ev = e || event;
      var disX = ev.clientX - imagesBox.offsetLeft;
      document.onmousemove = function(e) {
        var ev = e || event;
        var left = ev.clientX - disX;
        if ( left > boxCenter - 0.5 * imagesList[0].offsetWidth)
          left = boxCenter - 0.5 * imagesList[0].offsetWidth;
        if (left < boxCenter - (imagesList.length - 0.5) *
            imagesList[0].offsetWidth)
          left = boxCenter - (imagesList.length - 0.5) *
              imagesList[0].offsetWidth;
        imagesBox.style.left = left + 'px';
        resize();
      }
      document.onmouseup = function() {
        document.onmouseup = document.onmousemove = null;
      }
      return false;
    }
    resize();
    function resize() {
      for (var i = 0; i < imagesList.length; i++) {
        var liToCenterDistance = boxCenter - (imagesList[i].offsetLeft +
            imagesBox.offsetLeft + imagesList[0].offsetWidth / 2);
        var scale = 1 - Math.abs(liToCenterDistance / 1000);
        scale < 0.3 && (scale = 0.3);
        images[i].style.width = scale * 450 + 'px';
        images[i].style.height = scale * 600 + 'px';
        images[i].style.marginTop = - (images[i].offsetHeight - 300) / 2 + 'px';
        images[i].style.marginLeft = - (images[i].offsetWidth - 350) / 2+ 'px';
        imagesList[i].style.zIndex = scale * 1000;
      }
    }
  }
    lineDrawingShow();
  function changePage() {
    var container = document.querySelector('#person-drawing');
    var contentPage = document.querySelector('#content-pic');
    var frontPage = document.querySelector('#front');
    var backPage = document.querySelector('#back');
    var nextPage = document.querySelector('#next');
    var textMsg = document.querySelector('#text');
    var textArr = ['镜中的自己',
      '路边女孩的背影',
      '写生女青年系列--1',
      '写生男青年系列--1'];
    var pageIndex = 1;
    var isAnimation = false;
    container.onclick = function () {
      if (isAnimation) return;
      isAnimation = true;
      pageIndex++;
      contentPage.style.transition = '1s all ease';
      contentPage.style.transform = 'perspective(800px) rotateY(-180deg)';
      textMsg.innerHTML = textArr[pageIndex % textArr.length];
      textMsg.style.right = '0px';

      contentPage.addEventListener('transitionend', function () {
        isAnimation = false;

        contentPage.style.transform = 'perspective(800px) rotateY(0deg)';
        contentPage.style.transition = 'none';

        container.style.backgroundImage = 'url(img/lineDrawing/' + pageIndex %
            4 + '.png)';
        frontPage.style.backgroundImage = 'url(img/lineDrawing/' + pageIndex %
            4 + '.png)';

        backPage.style.transition = '1s all ease';
        backPage.style.backgroundImage = 'url(img/lineDrawing/' + (pageIndex +
            1) % 4 + '.png)';
        nextPage.style.backgroundImage = 'url(img/lineDrawing/' + (pageIndex +
            1) % 4 + '.png)';
        textMsg.style.right = '120px';
      }, false)
    }
  }
  changePage();
};
