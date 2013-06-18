nw.feats = function() {
  _feats = 0,
  _human = 0,
  _heroic = 0,
  _paragon = false; 

  var init = function() {
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
      return false;
    }); 
    $('.feat-list .button').on('click', function() {
      var input   = $(this).find('input'),
          type    = $(this).parents('div').attr('class'),
          max     = parseInt($(this).data('points'), 10),
          val     = parseInt(input.val(), 10),
          race    = $('#race').val();
      if(!$(this).parents('li').hasClass('enabled') || val == max) 
        return false;

      if(_feats >= 51) {
       return false;
      }
      
      if(_human > 3) {
        return false;
      }

      if(type.indexOf('heroic') >= 0 && _human >= 3 && race == "human") {
        return false;
      }

      if(type.indexOf('heroic') >= 0 && _feats >= 20 && race != "human") {
        return false;
      }

      if(type.indexOf('heroic') >= 0 && _feats >= 20 && _paragon == true && race == "human") {
        _human++;
      }

      add_feats(race, type);

      $('.meta .points em').html(_feats);
      $('.meta .level em').html(10 + _feats); 

      $(this).addClass('on').find('strong')
                            .html((val + 1) + "/");
      input.val(val + 1); 
      
      var total = row_total($(this).parent().parent());
 
      if(_feats == 20) {
        $('.feat-list div:not(.heroic) li:first-child').addClass('enabled');
        _paragon = true;
      }
       
      if(total % 5 == 0)
        $(this).parents('div').first().find('li:not(.enabled)').first().addClass('enabled');

      return false;
    });

    $('.feat-list .button').bind('contextmenu', function() {
      var input   = $(this).find('input'),
          type    = $(this).parents('div').attr('class'),
          val     = parseInt(input.val(), 10),
          race    = $('#race').val();

      if(!$(this).parents('li').hasClass('enabled') || val <= 0) 
        return false;

      var total = row_total($(this).parents('li'));

      if(total == 5 && (row_total($(this).parents('li').next()) > 0)) {
        return false;
      }

      if(_feats == 20 && _human == 0) {
        $('.feat-list div:not(.heroic) li:first-child').removeClass('enabled');
        _paragon = false;
      }

      if(_feats >= 21 && type.indexOf('heroic') >= 0 && _paragon == true && _human == 0) {
        return false;
      }

      if(_feats >= 20 && type.indexOf('heroic') >= 0 && race == 'human' && _human > 0) {
        _human--;
      }

      if(_feats >= 21 && _paragon == true && type.indexOf('heroic') >= 0 && race != 'human') {
        return false;
      }

      if(val == 1) $(this).removeClass('on');
       
      $(this).find('strong')
             .html((val - 1) + "/");
      input.val(val - 1); 

      sub_feats(race, type);
      
      $('.meta .points em').html(_feats);
      $('.meta .level em').html(10 + _feats);
      
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
  
  var add_feats = function(race, type) {
    if(_feats > 51) return false;
    if(race == 'human' && _feats >= 20 && type.indexOf('heroic') >= 0) return false;
    _feats++;
  };

  var sub_feats = function(race, type) {
    if(_feats == 0) return false;
    if(_human > 0) return false;
    if(race == 'human' && _feats >= 20 && type.indexOf('heroic') >= 0 && _human == 0 && _paragon == true) return false;
    _feats--;
  };
 
  return {
    init: init
  }
}();
