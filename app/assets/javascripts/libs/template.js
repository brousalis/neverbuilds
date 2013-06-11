nw.template = function() {
  _points = 60,
  _feats = 0,
  _paragon = false;

  var init = function() {  
    // the almighty hack of all hacks
    $('body').tooltip({ selector: '[data-toggle=tooltip]' });
    
    handle_hud();
    handle_powers();
    handle_feats();
    handle_guide();

    $(".nano").nanoScroller();

    $('.submit').on('click', function() {
      $('form').submit();
    });

    // build type (pvp/pve)
    $('fieldset.category a').on('click', function() {
      $('#build_category').val(this.innerText);
    })

    // lol
    $('.paragon .class').center();
  };

  $.fn.center = function () {
    this.css('left', this.parent().width()/2 - $(this).width()/2);
  };

  var handle_hud = function() {
    // shows the popover for specific type
    $('#hud .button').popover({
        placement: 'top', html: true, 
        animation: false, show: true,
        content: function() {
          return $('[data-button="'+$(this).attr('rel')+'"]').html();
        }
      }).click(function() {
        $('#hud .button').toggleClass('active')
                         .not(this)
                         .popover('hide')
                         .removeClass('active');
        return false;
      }).bind('contextmenu', function() {
        $(this).popover('hide')
               .removeClass('active')
               .find('.image').removeAttr('style')
        $('#hud [rel="'+$(this).find('input').val()+'"]').removeClass('hidden');
        $(this).find('input').val('');
        return false;
      });  
    
    // handles switching the selected power
    $('body').on('click', '#hud .popover .button', function() {
      var power = $(this).attr('rel'),
          image = $(this).find('.image'),
          input = $(this).parents().find('.active input'),
          active = $(this).parents().find('.active .image');
      // unhide the previously selected power
      if(input.val())
        $('[rel="'+input.val()+'"]').removeClass('hidden');
      // set the input to the newly selected power
      input.val(power);
      // hide the power in the popover
      $('[rel="'+power+'"]').addClass('hidden');
      // copy the selected power's image to the hud
      active.css('background', image.css('background'));
      // close the popover
      $('#hud .button').popover('hide').removeClass('active');
      return false;
    }); 
  };

  var handle_feats = function() {
    // init
    $('.meta .points em').html(_feats);
    $('.feat-list div:first-child li:first-child').addClass('enabled');
    // events
    $('.feats .reset').on('click', function() {
      $('.feats .feat-list ul li').removeClass('enabled');
      $('.feat-list div:first-child li:first-child').addClass('enabled');
      $('.feats .feat-list .button input').val(0)
      $('.feats .feat-list .button').removeClass('on');
      $('.feats .feat-list .button .points strong').html("0/");
      $('.feats .content .meta .points em').html(0)
      $('.feats .content .meta .level em').html(10)
      _feats = 0;
      return false;
    }); 
    $('.feat-list .button').on('click', function() {
      var input   = $(this).find('input'),
          type    = $(this).parents('div').attr('class'),
          max     = parseInt($(this).data('points'), 10),
          val     = parseInt(input.val(), 10),
          race    = $('.character span:first-child').attr('data-race');
      if(!$(this).parents('li').hasClass('enabled') || val == max) 
        return false;

      if(_feats == 19) {
        $('.feat-list div:not(.heroic) li:first-child').addClass('enabled');
        _paragon = true;
      }

      if(type.indexOf('heroic') >= 0 && _feats >= 20)
        return false;

      if(_feats >= 51 && race != "human") {
       return false;
      } 

      if(_feats >= 51 && race == "human" && type.indexOf('heroic') <= 0) {
        return false;
      }

      add_feats();

      $('.meta .points em').html(_feats);
      $('.meta .level em').html(10 + _feats); 

      $(this).addClass('on').find('strong')
                            .html((val + 1) + "/");
      input.val(val + 1); 
      
      var total = row_total($(this).parent().parent());

      if(total % 5 == 0)
        $(this).parents('div').first().find('li:not(.enabled)').first().addClass('enabled');

      return false;
    });

    $('.feat-list .button').bind('contextmenu', function() {
      var input   = $(this).find('input'),
          type    = $(this).parents('div').attr('class'),
          val     = parseInt(input.val(), 10);
      if(!$(this).parents('li').hasClass('enabled') || val <= 0) 
        return false;

      if(val == 1) $(this).removeClass('on');

      var total = row_total($(this).parents('li'));

      if(total == 5 && (row_total($(this).parents('li').next()) > 0))
        return false;

      if(_feats >= 21 && _paragon == true && type.indexOf('heroic') >= 0) {
        return false;
      }

      $(this).find('strong')
             .html((val - 1) + "/");
      input.val(val - 1); 


      sub_feats();
      
      $('.meta .points em').html(_feats);
      $('.meta .level em').html(10 + _feats);

      if(_feats == 19) {
        $('.feat-list div:not(.heroic) li:first-child').removeClass('enabled');
        _paragon = false;
        return false;
      }

      if($.inArray(total - 1, [4,9,14,19,24,29,34,39,44,49,54,59]) > -1) // <-- LOL 
        $(this).parents('div').first().find('li.enabled').last().removeClass('enabled');

      return false; 
    });
  };
  var row_total = function(element) {
    var inputs = $(element).find('.button input'),
        total = 0,
        points = $.map(inputs, function(e) { 
                   return parseInt($(e).val(), 10); 
                 });

    $.each(points, function() {
      total += this
    });
    return total;
  };


  var handle_powers = function() {
    $('.count span').html(_points);

    // reset powers
    $('.powers .reset').on('click', function() {
      $('.powers .tree .button').removeClass('enabled');
      $('.powers .tree .button input').val(0)
      $('.powers .tree .button .rank').removeClass('on');
      $('.details span').removeClass('on');
      _points = 60;
      $('.count span').html(_points);
      return false;
    });

    // collapse/expand tree
    $('.expand').on('click', function() {
      $(this).toggleClass('on');
      $('.powers').toggleClass('expanded');
      return false;
    });
   
    // hover over power fills the sidebar
    $('.tree .button').on('mouseenter', function(){
      if($('.details .icon').length > -1)
        $('.details .icon').remove();

      var data = $(this).data('originalTitle');

      if(data === undefined || data === null)
        data = $(this).attr('title');

      $('.details').html(data);

      $('<div/>', {
        class: 'icon',
        style: 'background: '+$(this).find('.image').css('background'),
      }).prependTo('.details');

      var rank = $(this).find('input'),
          val = parseInt(rank.val(), 10);

      switch(val) {
        case 1: $('.details .desc').addClass('on'); break; 
        case 2: $('.details .desc, .details .rank_2').addClass('on'); break;
        case 3: $('.details .desc, .details .rank_2, .details .rank_3').addClass('on'); break;
      } 
    });
    
    // left click rank up the powers
    $('.tree .button').on('click', function() {
      if(_points == 0) return false
      var rank  = $(this).find('input'),
          val   = parseInt(rank.val(), 10);
      switch(val) {
        case 0:
          $(this).find('.rank:lt(1)').addClass('on');
          $('.details .desc').addClass('on');
          $(this).addClass('enabled');
          rank.val(val + 1);
          sub_points();
          break; 
        case 1:
          $(this).find('.rank:lt(2)').addClass('on');
          $('.details .desc, .details .rank_2').addClass('on');
          rank.val(val + 1);
          sub_points();
          break;
        case 2:
          $('.details .desc, .details .rank_2, .details .rank_3').addClass('on');
          $(this).find('.rank:lt(3)').addClass('on');
          rank.val(val + 1);
          sub_points();
          break;
      }
      $('.count span').html(_points)
      return false;
    });

    // right click rank down the powers
    $('.tree .button').bind('contextmenu', function() {
      if(_points == 0) return false
      var rank  = $(this).find('input'),
          val   = parseInt(rank.val(), 10);
      switch(val) {
        case 0:
          $(this).find('.rank').removeClass('on')
          break; 
        case 1:
          $(this).find('.rank').removeClass('on')
          $('.details .desc, .details .rank_2, .details .rank_3').removeClass('on');
          $(this).removeClass('enabled');
          rank.val(val - 1);
          add_points();
          break;
        case 2:
          $(this).find('.rank').removeClass('on');
          $(this).find('.rank:first').addClass('on');
          $('.details .rank_2, .details .rank_3').removeClass('on');
          rank.val(val - 1);
          add_points();
          break;
        case 3:
          $(this).find('.rank').removeClass('on');
          $(this).find('.rank:lt(2)').addClass('on');
          $('.details .rank_3').removeClass('on');
          rank.val(val - 1);
          add_points();
          break; 
      } 
      $('.count span').html(_points)
      return false;
    });
  };

  var add_points = function() { 
    if(_points > 60) return false;
    _points++
  };

  var sub_points = function() {
    if(_points == 0) return false;
    _points--
  };

  var add_feats = function() {
    if(_feats > 51) return false;
    _feats++;
  };

  var sub_feats = function() {
    if(_feats == 0) return false;
    _feats--;
  
  };

  var handle_guide = function() {
    $('.add-video').on('click', function(e) {
      var url = $('.video-url').val();
      if (url.indexOf('youtube') == -1) {
        alert("Enter a valid youtube url");
        return false;
      }
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match&&match[7].length==11){
          url = match[7];
      }
      $('.video-url').val(url);
      $('.youtube').attr("src", "http://www.youtube.com/embed/"+url).fadeIn();
      return false;
    });
    $('.remove-video').on('click', function(e) {
      $('.youtube').attr('src', '').hide();
      $('.video-url').val('');
      return false;
    });

   
    $('.builds .preview').on('click', function(e) {
      $('.builds textarea').toggle();
      $('.builds #preview').toggle();
      $('.builds .video').toggle();
      $('.builds .preview').toggleClass('active');
      return false;
    });
   
    $('.category .filter').on('click', function() {
      $('.category .filter').removeClass('active');
      $(this).addClass('active');
      return false;
    });
  };

  return {
    init: init
  };
}();
  
/*! nanoScrollerJS - v0.7.3 - (c) 2013 James Florentino; Licensed MIT */
!function(a,b,c){"use strict";var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x;w={paneClass:"pane",sliderClass:"slider",contentClass:"content",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null,documentContext:null,windowContext:null},s="scrollbar",r="scroll",k="mousedown",l="mousemove",n="mousewheel",m="mouseup",q="resize",h="drag",u="up",p="panedown",f="DOMMouseScroll",g="down",v="wheel",i="keydown",j="keyup",t="touchmove",d="Microsoft Internet Explorer"===b.navigator.appName&&/msie 7./i.test(b.navigator.appVersion)&&b.ActiveXObject,e=null,x=function(){var a,b,d;return a=c.createElement("div"),b=a.style,b.position="absolute",b.width="100px",b.height="100px",b.overflow=r,b.top="-9999px",c.body.appendChild(a),d=a.offsetWidth-a.clientWidth,c.body.removeChild(a),d},o=function(){function i(d,f){this.el=d,this.options=f,e||(e=x()),this.$el=a(this.el),this.doc=a(this.options.documentContext||c),this.win=a(this.options.windowContext||b),this.$content=this.$el.children("."+f.contentClass),this.$content.attr("tabindex",0),this.content=this.$content[0],this.options.iOSNativeScrolling&&null!=this.el.style.WebkitOverflowScrolling?this.nativeScrolling():this.generate(),this.createEvents(),this.addEvents(),this.reset()}return i.prototype.preventScrolling=function(a,b){if(this.isActive)if(a.type===f)(b===g&&a.originalEvent.detail>0||b===u&&a.originalEvent.detail<0)&&a.preventDefault();else if(a.type===n){if(!a.originalEvent||!a.originalEvent.wheelDelta)return;(b===g&&a.originalEvent.wheelDelta<0||b===u&&a.originalEvent.wheelDelta>0)&&a.preventDefault()}},i.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:"touch"}),this.iOSNativeScrolling=!0,this.isActive=!0},i.prototype.updateScrollValues=function(){var a;a=this.content,this.maxScrollTop=a.scrollHeight-a.clientHeight,this.prevScrollTop=this.contentScrollTop||0,this.contentScrollTop=a.scrollTop,this.iOSNativeScrolling||(this.maxSliderTop=this.paneHeight-this.sliderHeight,this.sliderTop=this.contentScrollTop*this.maxSliderTop/this.maxScrollTop)},i.prototype.createEvents=function(){var a=this;this.events={down:function(b){return a.isBeingDragged=!0,a.offsetY=b.pageY-a.slider.offset().top,a.pane.addClass("active"),a.doc.bind(l,a.events[h]).bind(m,a.events[u]),!1},drag:function(b){return a.sliderY=b.pageY-a.$el.offset().top-a.offsetY,a.scroll(),a.updateScrollValues(),a.contentScrollTop>=a.maxScrollTop&&a.prevScrollTop!==a.maxScrollTop?a.$el.trigger("scrollend"):0===a.contentScrollTop&&0!==a.prevScrollTop&&a.$el.trigger("scrolltop"),!1},up:function(){return a.isBeingDragged=!1,a.pane.removeClass("active"),a.doc.unbind(l,a.events[h]).unbind(m,a.events[u]),!1},resize:function(){a.reset()},panedown:function(b){return a.sliderY=(b.offsetY||b.originalEvent.layerY)-.5*a.sliderHeight,a.scroll(),a.events.down(b),!1},scroll:function(b){a.isBeingDragged||(a.updateScrollValues(),a.iOSNativeScrolling||(a.sliderY=a.sliderTop,a.slider.css({top:a.sliderTop})),null!=b&&(a.contentScrollTop>=a.maxScrollTop?(a.options.preventPageScrolling&&a.preventScrolling(b,g),a.prevScrollTop!==a.maxScrollTop&&a.$el.trigger("scrollend")):0===a.contentScrollTop&&(a.options.preventPageScrolling&&a.preventScrolling(b,u),0!==a.prevScrollTop&&a.$el.trigger("scrolltop"))))},wheel:function(b){var c;if(null!=b)return c=b.delta||b.wheelDelta||b.originalEvent&&b.originalEvent.wheelDelta||-b.detail||b.originalEvent&&-b.originalEvent.detail,c&&(a.sliderY+=-c/3),a.scroll(),!1}}},i.prototype.addEvents=function(){var a;this.removeEvents(),a=this.events,this.options.disableResize||this.win.bind(q,a[q]),this.iOSNativeScrolling||(this.slider.bind(k,a[g]),this.pane.bind(k,a[p]).bind(""+n+" "+f,a[v])),this.$content.bind(""+r+" "+n+" "+f+" "+t,a[r])},i.prototype.removeEvents=function(){var a;a=this.events,this.win.unbind(q,a[q]),this.iOSNativeScrolling||(this.slider.unbind(),this.pane.unbind()),this.$content.unbind(""+r+" "+n+" "+f+" "+t,a[r])},i.prototype.generate=function(){var a,b,c,d,f;return c=this.options,d=c.paneClass,f=c.sliderClass,a=c.contentClass,this.$el.find(""+d).length||this.$el.find(""+f).length||this.$el.append('<div class="'+d+'"><div class="'+f+'" /></div>'),this.pane=this.$el.children("."+d),this.slider=this.pane.find("."+f),e&&(b={right:-e},this.$el.addClass("has-scrollbar")),null!=b&&this.$content.css(b),this},i.prototype.restore=function(){this.stopped=!1,this.pane.show(),this.addEvents()},i.prototype.reset=function(){var a,b,c,f,g,h,i,j,k,l;return this.iOSNativeScrolling?(this.contentHeight=this.content.scrollHeight,void 0):(this.$el.find("."+this.options.paneClass).length||this.generate().stop(),this.stopped&&this.restore(),a=this.content,c=a.style,f=c.overflowY,d&&this.$content.css({height:this.$content.height()}),b=a.scrollHeight+e,k=parseInt(this.$el.css("max-height"),10),k>0&&(this.$el.height(""),this.$el.height(a.scrollHeight>k?k:a.scrollHeight)),h=this.pane.outerHeight(),j=parseInt(this.pane.css("top"),10),g=parseInt(this.pane.css("bottom"),10),i=h+j+g,l=Math.round(i/b*i),l<this.options.sliderMinHeight?l=this.options.sliderMinHeight:null!=this.options.sliderMaxHeight&&l>this.options.sliderMaxHeight&&(l=this.options.sliderMaxHeight),f===r&&c.overflowX!==r&&(l+=e),this.maxSliderTop=i-l,this.contentHeight=b,this.paneHeight=h,this.paneOuterHeight=i,this.sliderHeight=l,this.slider.height(l),this.events.scroll(),this.pane.show(),this.isActive=!0,a.scrollHeight===a.clientHeight||this.pane.outerHeight(!0)>=a.scrollHeight&&f!==r?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===a.scrollHeight&&f===r?this.slider.hide():this.slider.show(),this.pane.css({opacity:this.options.alwaysVisible?1:"",visibility:this.options.alwaysVisible?"visible":""}),this)},i.prototype.scroll=function(){return this.isActive?(this.sliderY=Math.max(0,this.sliderY),this.sliderY=Math.min(this.maxSliderTop,this.sliderY),this.$content.scrollTop(-1*((this.paneHeight-this.contentHeight+e)*this.sliderY/this.maxSliderTop)),this.iOSNativeScrolling||this.slider.css({top:this.sliderY}),this):void 0},i.prototype.scrollBottom=function(a){return this.isActive?(this.reset(),this.$content.scrollTop(this.contentHeight-this.$content.height()-a).trigger(n),this):void 0},i.prototype.scrollTop=function(a){return this.isActive?(this.reset(),this.$content.scrollTop(+a).trigger(n),this):void 0},i.prototype.scrollTo=function(b){return this.isActive?(this.reset(),this.scrollTop(a(b).get(0).offsetTop),this):void 0},i.prototype.stop=function(){return this.stopped=!0,this.removeEvents(),this.pane.hide(),this},i.prototype.destroy=function(){return this.stopped||this.stop(),this.pane.length&&this.pane.remove(),d&&this.$content.height(""),this.$content.removeAttr("tabindex"),this.$el.hasClass("has-scrollbar")&&(this.$el.removeClass("has-scrollbar"),this.$content.css({right:""})),this},i.prototype.flash=function(){var a=this;if(this.isActive)return this.reset(),this.pane.addClass("flashed"),setTimeout(function(){a.pane.removeClass("flashed")},this.options.flashDelay),this},i}(),a.fn.nanoScroller=function(b){return this.each(function(){var c,d;if((d=this.nanoscroller)||(c=a.extend({},w,b),this.nanoscroller=d=new o(this,c)),b&&"object"==typeof b){if(a.extend(d.options,b),b.scrollBottom)return d.scrollBottom(b.scrollBottom);if(b.scrollTop)return d.scrollTop(b.scrollTop);if(b.scrollTo)return d.scrollTo(b.scrollTo);if("bottom"===b.scroll)return d.scrollBottom(0);if("top"===b.scroll)return d.scrollTop(0);if(b.scroll&&b.scroll instanceof a)return d.scrollTo(b.scroll);if(b.stop)return d.stop();if(b.destroy)return d.destroy();if(b.flash)return d.flash()}return d.reset()})}}(jQuery,window,document);
