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
 function switchCreateDrawing() {
  var box = document.querySelectorAll('.show')[0];
  var row = 5;
  var column = 7;
  for (var i = 0; i < row; i++) {
    for (var j = 0; j < column; j++) {
      var smallImg = document.createElement('span');
      smallImg.style.width = box.offsetWidth / column + 'px';
      smallImg.style.height = box.offsetHeight / row + 'px';
      box.appendChild(smallImg);
      smallImg.style.left = smallImg.offsetWidth * j + 'px';
      smallImg.style.top = smallImg.offsetHeight * i + 'px';
      smallImg.innerHTML = '<i class="front"></i><i class="back"></i>'
      smallImg.children[0].style.backgroundPosition = -smallImg.offsetLeft +
          'px ' + (-smallImg.offsetTop) + 'px';
      smallImg.children[1].style.backgroundPosition = -smallImg.offsetLeft +
          'px ' + (-smallImg.offsetTop) + 'px';
      smallImg.r = i;
      smallImg.c = j;
    }
  }
  var smallImgs = box.querySelectorAll('span');
  var now = 0;
  var isAnimating = false;
  box.onclick = function () {
    if (isAnimating) return;
    isAnimating = true;
    now++;
    for (var i = 0; i < smallImgs.length; i++) {
      smallImgs[i].style.transition = '1s all ease ' + (smallImgs[i].r +
          smallImgs[i].c) * 200 + 'ms';
      smallImgs[i].style.transform = 'perspective(800px) rotateY(180deg)';
    }
    box.style.backgroundImage = 'url(img/create/' +
        (now % 6) + '.png)';
    smallImgs[smallImgs.length - 1]
        .addEventListener('transitionend', function () {
          isAnimating = false;
          for (var i = 0; i < smallImgs.length; i++) {
            smallImgs[i].style.transition = 'none';
            smallImgs[i].style.transform = 'perspective(800px) rotateY(0deg)';
            smallImgs[i].children[0].style.backgroundImage = 'url(img/' +
                'create/' + (now % 6) + '.png)';
            smallImgs[i].children[1].style.backgroundImage = 'url(img/' +
                'create/'+ (now + 1) % 6 + '.png)';
          }
        }, false)
  }
}
  switchCreateDrawing()
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
 function scrollToBoth() {
  var createDrawing = document.querySelector('#person');
  var list = createDrawing.getElementsByTagName('ul')[0];
  var timer = null;
  list.innerHTML += list.innerHTML;
  var allWidth = list.children[0].offsetWidth * list.children.length;
  list.style.width = allWidth +'px';
  function move () {
    clearInterval(timer);
    timer = setInterval(function(){
      var left = list.offsetLeft - 5;
      if(left <= -list.offsetWidth / 2) left = 0;
      list.style.left = left + 'px';
    },30)
  }
  move();
  var leftBtn = document.getElementById('left');

  leftBtn.onmouseover = function() {
    move();
  }

  list.onmouseover = function() {
    clearInterval(timer);

  }
  var rigthBtn = document.getElementById('right');
  rigthBtn.onmouseover = function() {
    clearInterval(timer);
    timer = setInterval(function(){
      var left = list.offsetLeft + 5;
      if(left >= 0) left = -list.offsetWidth / 2;
      list.style.left = left + 'px';
    },30)
  }
}
  scrollToBoth();
};
