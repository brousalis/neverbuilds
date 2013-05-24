nw.template = function() {
  _points = 60,
  _feats = 0;

  var init = function() {  
    // the almighty hack of all hacks
    $('body').tooltip({ selector: '[data-toggle=tooltip]' });
    
    handle_hud();
    handle_powers();
    handle_feats();

    $('.submit').on('click', function() {
      $('form').submit();
    });

    // build type (pvp/pve)
    $('fieldset.category a').on('click', function() {
      $('#build_category').val(this.innerText);
    })
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
    $('.feat-list .button').on('click', function() {
      var points  = $(this).find('input'),
          max     = parseInt($(this).data('points'), 10),
          val     = parseInt(points.val(), 10);
      if(val != max) {
        $(this).addClass('on')
               .find('strong')
               .html((val + 1) + "/");
        points.val(val + 1);
      }
      return false;
    });
    $('.feat-list .button').bind('contextmenu', function() {
      var points  = $(this).find('input'),
          val     = parseInt(points.val(), 10);
      if(val != 0) {
        points.val(val - 1);
        $(this).find('strong').html((val - 1) + "/");
      }
      if(val == 1)
        $(this).removeClass('on');

      return false; 
    });
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
    
    // only scroll tree
    $('.tree').mouseenter(function(){
      $('body').css('overflow', 'hidden');
    }).mouseleave(function(){
      $('body').css('overflow', 'auto');
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
    $('.tree .button').on('click', function(e) {
      e.preventDefault();
      if(_points == 0)
        return false
      var rank = $(this).find('input'),
          val = parseInt(rank.val(), 10);
      switch(val) {
        case 0:
          $(this).find('.rank:lt(1)').addClass('on');
          $('.details .desc').addClass('on');
          rank.val(val + 1);
          $(this).addClass('enabled');
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
    });

    // right click rank down the powers
    $('.tree .button').bind('contextmenu', function(e) {
      e.preventDefault();
      if(_points == 0)
        return false
      var rank = $(this).find('input'),
          val = parseInt(rank.val(), 10);
      switch(val) {
        case 0:
          $(this).find('.rank').removeClass('on')
          break; 
        case 1:
          $(this).find('.rank').removeClass('on')
          $('.details .desc, .details .rank_2, .details .rank_3').removeClass('on');
          rank.val(val - 1);
          $(this).removeClass('enabled');
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

  return {
    init: init
  };
}();
  
