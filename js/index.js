window.onload = function () {
  function getStyle(obj, name) {
    return obj.currentStyle ? obj.currentStyle(name) : getComputedStyle(obj, false)[name];
  }

  function extractUnit(value) {
    return /\d+(\D*)/g.exec(value)[1];
  }

  function move(obj, json, options) {
    var options = options || {};
    options.duration = options.duration || 500;
    options.easing = options.easing || 'linear';

    var start = {};
    var dis = {};
    var unit = {};
    for (var name in json) {
      start[name] = parseFloat(getStyle(obj, name));
      dis[name] = parseFloat(json[name]) - start[name];
      unit[name] = extractUnit(json[name]);
    }

    var count = Math.floor(options.duration / 30);
    var n = 0;

    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
      n++;
      for (var name in json) {
        switch (options.easing) {
          case 'linear':
            var a = n / count;
            var cur = start[name] + dis[name] * a;
            break;
          case 'ease-in':
            var a = n / count;
            var cur = start[name] + dis[name] * a * a * a;
            break;
          case 'ease-out':
            var a = 1 - n / count;
            var cur = start[name] + dis[name] * (1 - a * a * a);
            break;
        }

        if (name == 'opacity') {
          obj.style[name] = cur;
        } else {
          obj.style[name] = cur + (unit[name] || 'px');
        }

      }

      if (n == count) {
        clearInterval(obj.timer);
        options.complete && options.complete();
      }

    }, 30);
  }

  function addEvent(obj, fn, ev) {
    obj.addEventListener ? obj.addEventListener(ev, fn, false) :
        obj.attachEvent('on' + ev, fn);
  }

  var isTransition = false;

  function addWheel(obj, fn) {
    function wheel(e) {
      if (isTransition) {
        obj.preventDefault &&  obj.preventDefault();
        return false;
      }

      var ev = e || event;
      var toDown = ev.detail ? ev.detail > 0 : ev.wheelDelta < 0;
      var distance = ev.detail ? ev.detail : ev.wheelDelta;

      if (Math.abs(distance) < 30) {
        obj.preventDefault &&  obj.preventDefault();
        return false;
      }

      isTransition = true;

      fn && fn(toDown);
      obj.preventDefault &&  obj.preventDefault();
      return false
    }

    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
      addEvent(obj, 'DOMMouseScroll', wheel);
    } else {
       obj.onmousewheel = wheel;
    }
  }

  function mainPage() {
    var openWindow = document.getElementById('open');
    var openBtn = document.getElementById('open-all-projects');
    var welcomeLoading = document.getElementById('welcome_loading');
    openWindow.style.marginTop = document.documentElement.clientHeight / 2 + 'px';
    move(openWindow, {'width': '100%'}, {
      'duration': 500, 'complete': function () {
        var fullPage = document.getElementById('full_page');
        fullPage.className = '';
        openBtn.className = '';
        move(welcomeLoading, {'height': '100%', 'top': 0}, {'duration': 500});
        openWindow.style.display = 'none';
      }
    });
  }

  mainPage();
  function menu() {
    var openMenuBtn = document.getElementById('open-all-projects');
    var fullPage = document.getElementById('full_page');
    var allProjects = document.getElementById('all-projects');
    var openBtn = document.getElementById('open-all-projects');
    var homeCard = document.getElementById('home-card');
    var about = document.getElementById('about');
    openMenuBtn.onclick = function () {
      fullPage.className = 'hide';
      openBtn.className = 'hide';
      allProjects.className = '';
      allProjects.style.transition = 'all 3s ease-in-out';
      move(allProjects, {'opacity': 1}, {
        'complete': function () {
          allProjects.style.transform = 'scale(1)';
          move(about, {'opacity': 1});
        }
      })
      about.style.transform = 'scale(1)';
      about.style.transition = 'all 3S ease-in-out';

      homeCard.className = 'hide';
    }
  }

  menu();
  function closeMenu() {
    var closeBtn = document.getElementById('close-btn');
    var allProjects = document.getElementById('all-projects');
    var homeCard = document.getElementById('home-card');

    closeBtn.onclick = function () {
      mainPage();
      allProjects.className = 'hide';
      homeCard.className = '';

      move(allProjects, {'opacity': 0}, {
        'complete': function () {
          allProjects.style.transform = 'scale(0.8)';
          move(about, {'opacity': 0});
        }
      })
      about.style.transform = 'scale(0.8)';
      about.style.transition = 'all 3s ease-in-out';
    }
  }

  closeMenu();
  function intro() {
    var relatedPush = document.getElementsByClassName('related-push');
    var imgRelPost = document.getElementsByClassName('img-rel-post');
    for (var i = 0; i < imgRelPost.length; i++) {
      (function (index) {
        imgRelPost[i].onmouseover = function () {
          var introImg = this.getElementsByTagName('img')[0];
          var introText = relatedPush[index].getElementsByTagName('h3')[0];
          for (var i = 0; i < imgRelPost.length; i++) {
            relatedPush[i].className = 'related-push';
          }
          relatedPush[index].className = 'related-push active';
          introText.style.display = 'block';
          introImg.style.transform = 'scale(1.5)';
          introImg.style.transition = 'all .3s ease-in-out';
          introImg.style.Zindex = 1500;
        }
        imgRelPost[i].onmouseout = function () {
          var introImg = this.getElementsByTagName('img')[0];
          var introText = relatedPush[index].getElementsByTagName('h3')[0];
          relatedPush[index].className = 'related-push';
          introText.style.display = 'none';
          introImg.style.transform = 'scale(1)';
          introImg.style.transition = 'all .3s ease-in-out';
        }
      })(i)
    }
  }

  intro();

  var num = 0;

  function updateIndex(index) {
    num = index;
  }

  function fullPageWheel() {
    var fullPageBg = document.querySelectorAll('.fp-section');
    for (var i = 0; i < fullPageBg.length; i++) {
      fullPageBg[i].style.height = document.documentElement
              .clientHeight + 'px';
    }

    var fullPage = document.querySelector('#full_page');

    function previous() {
      num = (num + fullPageBg.length - 1) % fullPageBg.length;
      fullPage.style.transform = 'translateY(-' + num *
          fullPageBg[0].offsetHeight + 'px)';
      fullPage.style.transition = '1s all ease';
      showFullPageContent(num);
      fullPageBgToLeft(num);
      rightBtn(num);
    }

    function next() {
      num = (num + 1) % fullPageBg.length;
      fullPage.style.transform = 'translateY(-' + num *
          fullPageBg[0].offsetHeight + 'px)';
      fullPage.style.transition = '1s all ease';
      showFullPageContent(num);
      fullPageBgToLeft(num);
      rightBtn(num);
    }

    fullPage.addEventListener('transitionend', function () {
      isTransition = false;
    });

    var fullPageInto = document.querySelector('#full_page_info');
    function showFullPageContent(num) {
      var fullPageText = document.querySelectorAll('.full-page-content');
      for (var i = 0; i < fullPageText.length; i++) {
        fullPageText[i].style.opacity = 0;
        fullPageText[i].style.left = 0;
        fullPageText[i].style.zIndex = 0;
      }
      if (num == 0) {
        return;
      }
      fullPageText[num].style.opacity = 1;
      fullPageText[num].style.left = '70px';
      fullPageText[num].style.transition = '1s all ease';
      fullPageText[num].style.zIndex = 100;
      fullPageText[num].style.visibility = 'visible';


    }

    var fullPageContentBg = document.querySelectorAll('.section-bg');
    function fullPageBgToLeft(num) {
      if (num == 0) {
        return;
      }
      for (var i = 0; i < fullPageContentBg.length; i++) {
        fullPageContentBg[i].style.left = '0%';
        fullPageContentBg[i].style.zIndex = 0;

      }
      fullPageContentBg[num - 1].style.left = '18%';
      fullPageContentBg[num - 1].style.transition = '1s all ease';
      fullPageContentBg[num - 1].style.zIndex = 100;
      fullPageContentBg[num - 1].style.visibility = 'visible';


    }

    function flipToPage(num) {
      fullPage.style.transform = 'translateY(-' + num *
          fullPageBg[0].offsetHeight + 'px)';
      fullPage.style.transition = '1s all ease';

      fullPageBgToLeft(num);
      rightBtn(num);
    }

    function rightBtn(num) {
      var fpNav =document.querySelector('#fp-nav');
      var fpNavList = fpNav.querySelectorAll('li');
      var fpNavListText = fpNav.querySelectorAll('span');

      if (num == 0) {
        fpNav.style.display = 'none';
        return;
      }
      fpNav.style.display = 'block';
      for (var i = 0; i < fpNavList.length; i++) {
        fpNavListText[i].className = '';
      }
      fpNavListText[num].className = 'active';
      for (var i = 0 ; i < fpNavList.length; i++) {
        (function (index) {
          fpNavList[index].onclick = function () {
            flipToPage(index);
            showFullPageContent(index);
            updateIndex(index);
          }
        })(i)
      }
    }
    addWheel(fullPageInto, function (toDown) {
      if (toDown) {
        next();
      } else {
        previous();
      }
    });
  }
  fullPageWheel();
}