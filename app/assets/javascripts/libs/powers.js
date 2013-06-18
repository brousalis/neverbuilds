nw.powers = function() {
  $placed = 0;

  var hover = function(event) {
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

    var input = $(this).find('input'),
        rank  = parseInt(input.val(), 10);

    switch(rank) {
      case 1: $('.details .desc').addClass('on'); break; 
      case 2: $('.details .desc, .details .rank_2').addClass('on'); break;
      case 3: $('.details .desc, .details .rank_2, .details .rank_3').addClass('on'); break;
    } 
  };                                  
  
  // forgive me for the sins committed below
  
  var left_click = function(event) {
    if($placed == 61) return false

    var input = $(this).find('input'),
        rank  = parseInt(input.val(), 10);
 
    if(!$(this).parent().hasClass('on')) return false;
    switch(rank) {
      case 0:
        $(this).find('.rank:lt(1)').addClass('on');
        $(this).find('.ranks').addClass('ranked');
        $('.details .desc').addClass('on');
        $(this).addClass('enabled');
        input.val(rank + 1);
        $placed++;
        break; 
      case 1:
        $(this).find('.rank:lt(2)').addClass('on');
        $('.details .desc, .details .rank_2').addClass('on');
        input.val(rank + 1);
        $placed++;
        break;
      case 2:
        if($placed <= 19) return false;
        $('.details .desc, .details .rank_2, .details .rank_3').addClass('on');
        $(this).find('.rank:lt(3)').addClass('on');
        input.val(rank + 1);
        $placed++;
        break;
    }
  
    update_count($placed);

    if(rank + 1 == 3) return false;

    console.log('=== ' + $placed + ' | ' + rank)
    if($placed != 25 && $placed <= 55 && $placed % 5 == 0) {
      console.log('huh')
      $(this).parent().parent().find('.buttons:not(.on)').first().addClass('on');
    }

    return false; 
  };

  var right_click = function(event) {
    if($placed == 0) return false;
    
    var last_level  = $('.ranked').last().parent().parent().attr('class').replace('buttons','').replace('on','').replace('level_',''),
        this_level  = $(this).parent().attr('class').replace('buttons','').replace('on','').replace('level_',''),
        input       = $(this).find('input'),
        rank        = parseInt(input.val(), 10);

    if(rank == 0) return false;
    
    if($placed <= 50 && $placed % 5 == 0)
      $(this).parent().parent().find('.on').last().removeClass('on');
 
    // check if safe to remove point
    if(($placed - 1) == parseInt(last_level,10) && 
       ($placed - 1) != 5 &&
       ($placed - 1) != 25 &&
       parseInt(last_level,10) != parseInt(this_level,10)) {
      return false;
    }
   
    switch(rank) {
      case 0:
        $(this).find('.rank').removeClass('on')
        $(this).find('.ranks').removeClass('ranked');
        $placed--;
        break; 
      case 1:
        $(this).find('.rank').removeClass('on')
        $(this).find('.ranks').removeClass('ranked');
        $('.details .desc, .details .rank_2, .details .rank_3').removeClass('on');
        $(this).removeClass('enabled');
        input.val(rank - 1);
        $placed--;
        break;
      case 2:
        $(this).find('.rank').removeClass('on');
        $(this).find('.rank:first').addClass('on');
        $('.details .rank_2, .details .rank_3').removeClass('on');
        input.val(rank - 1);
        $placed--;
        break;
      case 3:
        $(this).find('.rank').removeClass('on');
        $(this).find('.rank:lt(2)').addClass('on');
        $('.details .rank_3').removeClass('on');
        input.val(rank - 1);
        $placed--;
        break; 
    } 
    
    update_count($placed);

    return false; 
  };

  // helpers
  var update_count = function(value) {
    $('.powers .count span').html(value)
  };

  var reset_powers = function() {
    $('.powers .tree .button').removeClass('enabled');
    $('.powers .tree .buttons:not(:first-child)').removeClass('on');
    $('.powers .tree .button input').val(0)
    $('.powers .tree .button .rank').removeClass('on');
    $('.powers .tree .button .ranks').removeClass('ranked');
    $('.details span').removeClass('on');
    $placed = 0;
    update_count($placed);
  };
           

  var init = function() {
    update_count($placed);

    // reset powers
    $('.powers .reset').on('click', function() {
      reset_powers();
      return false;
    });

    // collapse/expand tree
    $('.expand').on('click', function() {
      $(this).toggleClass('on');
      $('.powers').toggleClass('expanded');
      return false;
    });
   
    // hover over power fills the sidebar
    $('.tree .button').on('mouseenter', hover);

    // lol gotta happen
    $('.level_0').addClass('on');
    
    // left click rank up the powers
    $('.tree .button').on('click', left_click);

    // right click rank down the powers
    $('.tree .button').bind('contextmenu', right_click);
  };
 
  return {
    init: init
  };
}();
