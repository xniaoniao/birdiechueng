/**
 * Created by xiaolili on 16/5/19.
 */
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

window.onload = function () {
  function contentBgHeight() {
    var oilBg = document.querySelector('#oil-bg');
    oilBg.style.height = document.documentElement.clientHeight + 'px';
  }
  contentBgHeight();
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
  function follow() {
    function toAngle(radians) {
      return radians * 180 / Math.PI;
    }

    function hoverDirection(obj, ev) {
      var disX = ev.pageX;
      var disY = ev.pageY;

      var toBoxCenterLeftDistance = obj.offsetLeft + obj.offsetWidth / 2 ;
      var toBoxCenterTopDistance = obj.offsetTop + obj.offsetHeight / 2 ;

      var a = toBoxCenterLeftDistance - disX;
      var b = toBoxCenterTopDistance - disY;

      return (Math.round((toAngle(Math.atan2(b, a)) + 180) / 90)) % 4;
    }
    var sketch = document.getElementById('sketch');
    var imgs = sketch.getElementsByTagName('li');
    var mask = sketch.getElementsByTagName('span');
    var show = sketch.getElementsByClassName('show');
    for(var i = 0; i < imgs.length; i++) {
      imgs[i].index = i;
      imgs[i].onmouseover = function(e) {
        var ev = e || event;
        var n = hoverDirection(this, ev);
        var from = ev.formElement || ev.relatedTarget;
        if (this.contains(from)) return;
        switch(n) {
          case 3:
            mask[this.index].style.left = 0 + 'px';
            mask[this.index].style.top = -200 + 'px';
            break;
          case 0:
            mask[this.index].style.left = 200 + 'px';
            mask[this.index].style.top = 0 + 'px';
            break;
          case 1:
            mask[this.index].style.left = 0 + 'px';
            mask[this.index].style.top = 200 + 'px';
            break;
          case 2:
            mask[this.index].style.left = -200 + 'px';
            mask[this.index].style.top = 0 + 'px';
        }
        move(mask[this.index], {'top' : 0, 'left' : 0 })
      };
      imgs[i].onmouseout = function(e) {
        var ev = e || evetn;
        var to = ev.toElement || ev.relatedTarget;
        var n = hoverDirection(this, ev);
        if(this.contains(to)) return;
        switch(n) {
          case 3:
            move(mask[this.index], {'left' : 0, 'top' : -200});
            break;
          case 0:
            move(mask[this.index], {'left' : 200, 'top' : 0});
            break;
          case 1:
            move(mask[this.index], {'left' : 0, 'top' : 200});
            break;
          case 2:
            move(mask[this.index], {'left' : -200, 'top' : 0});
        }
      }
    }

    // var showBtn = sketch.getElementsByTagName('input')[0];

    var position = [];
    $('#sketch li').each(function (i) {
      position.push({'left' : $('#sketch li')[i].offsetLeft, 'top' :
            $('#sketch li')[i].offsetTop})
    })

    $('#sketch li').each(function () {
      $(this).css({'left' : position[$(this).index()].left, 'top' :
          position[$(this).index()].top,
        'margin' : 0, 'position' : 'absolute'})
    })

    var botton = false;
    // var top = $('#clickBtn').top;alert(top);
    $('#clickBtn').click(function () {
      if(botton) return;
      botton = true;
      var i = -1;
      timer = setInterval(function () {
        i++;
        (function (index) {
          $('#sketch li').eq(index).animate({'top' : 1200, 'left' : 0, 'width' : 0,
            'height' : 0, 'opacity' : 0}, function () {
            if(index == $('#sketch li').size() - 1) {
              var timer = setInterval(function () {
                $('#sketch li').eq(index).animate({'top' : position[index].top,
                  'left' : position[index].left, 'width' : 200,
                      'height' : 200, 'opacity' : 1});
                index--;
                if (index == -1) {
                  clearInterval(timer);
                  botton = false;
                }
              }, 100)
            }
          });
        })(i)
        if (i == $('#sketch li').size()) {
          clearInterval(timer);
        }
      }, 100)
    })

  }

  follow()
};

