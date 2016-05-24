/**
 * Created by xiaolili on 16/5/19.
 */
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
  function switchDrawing() {
    var showContainer = document.querySelector('#show_box');
    var show = document.querySelector('.show');
    var showPic = showContainer.querySelectorAll('img');
    var picClassName = [];
    for (var i = 0; i < showPic.length; i++) {
      picClassName[i] = showPic[i].className;
    }
    var isAnimation = false;
    var switchBtn = show.querySelectorAll('span');
    switchBtn[0].onclick = function () {
      if (isAnimation) {
        return;
      }
      isAnimation = true;
      picClassName.unshift(picClassName.pop());
      for (var i = 0; i < showPic.length; i++) {
        showPic[i].className = picClassName[i];
      }
    };

    switchBtn[1].onclick = function () {
      if (isAnimation) {
        return;
      }
      isAnimation = true;
      picClassName.push(picClassName.shift());
      for (var i = 0; i < showPic.length; i++) {
        showPic[i].className = picClassName[i];
      }
    };

    for (var i = 0; i < showPic.length; i++) {
      (function (index) {
        showPic[index].onmouseover = function () {
          if (showPic[index].className.indexOf('current') != -1) {
            showPic[index].className = 'current show-active';
          }
        };
        showPic[index].onmouseout = function () {
          if (showPic[index].className.indexOf('current') == -1) {
            return;
          }

          for (var j = 0; j < showPic.length; j++) {
            showPic[j].className = picClassName[j];
          }
        }
      })(i)
    }

    showPic[0].addEventListener('transitionend', function () {
      isAnimation = false;
    }, false)
  }

  switchDrawing();


  function changePage() {
    var container = document.querySelector('#person-drawing');
    var contentPage = document.querySelector('#content-pic');
    var frontPage = document.querySelector('#front');
    var backPage = document.querySelector('#back');
    var nextPage = document.querySelector('#next');
    var textMsg = document.querySelector('#text');
    var textArr = ['坐在墙角的女孩',
      '静想的女孩系列--1',
      '静想的女孩系列--2',
      '静想的女孩系列--3',
      'fire-燃烧的火焰' ,
      '静想的女孩系列--4'];
    var pageIndex = 0;
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
        backPage.style.backgroundImage = 'url(img/person/' + (pageIndex + 1) % 6
            + '.jpg)';
        container.style.backgroundImage = 'url(img/person/' + pageIndex % 6 +
            '.jpg)';
        nextPage.style.backgroundImage = 'url(img/person/' + (pageIndex + 1) % 6
            + '.jpg)';

        frontPage.style.backgroundImage = 'url(img/person/' + pageIndex % 6 +
            '.jpg)';

        backPage.style.transition = '6s all ease';


        textMsg.style.right = '120px';
      }, false)
    }
  }
  changePage();


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

};
