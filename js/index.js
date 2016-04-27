window.onload = function () {
  function getStyle(obj, name){
    return obj.currentStyle ? obj.currentStyle(name) : getComputedStyle(obj, false)[name];
  }
function extractUnit(value) {
  return /\d+(\D*)/g.exec(value)[1];
}
  function move(obj, json, options){
    var options = options || {};
    options.duration = options.duration || 500;
    options.easing = options.easing || 'linear';

    var start = {};
    var dis = {};
    var unit = {};
    for (var name in json){
      start[name] = parseFloat(getStyle(obj, name));
      dis[name] = parseFloat(json[name]) - start[name];
      unit[name] = extractUnit(json[name]);
    }

    var count = Math.floor( options.duration / 30);
    var n = 0;

    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
      n++;
      for (var name in json){
        switch(options.easing){
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

        if (name == 'opacity'){
          obj.style[name] = cur;
        }else{
          obj.style[name] = cur + (unit[name] || 'px');
        }

      }

      if (n == count) {
        clearInterval(obj.timer);
        options.complete&&options.complete();
      }

    },30);
  }

  function mainPage() {
    var openWindow = document.getElementById('open');
    var openBtn = document.getElementById('open-all-projects');
    var welcomeLoading = document.getElementById('welcome_loading');
    openWindow.style.marginTop = document.documentElement.clientHeight / 2 + 'px';
    move(openWindow, {'width' : '100%'}, {'duration' : 500, 'complete' : function () {
      var fullPage = document.getElementById('full_page');
      fullPage.className = '';
      openBtn.className = '';
      move(welcomeLoading, {'height' : '100%','top' : 0}, {'duration' : 500});
      openWindow.style.display = 'none';
    }
    });
  }
  mainPage();
  function  menu() {
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
      move(allProjects, {'opacity' : 1}, {'complete' : function () {
        allProjects.style.transform = 'scale(1)';
        move(about, {'opacity' : 1});
      }})
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

      move(allProjects, {'opacity' : 0}, {'complete' : function () {
        allProjects.style.transform = 'scale(0.8)';
        move(about, {'opacity' : 0});
      }})
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
}