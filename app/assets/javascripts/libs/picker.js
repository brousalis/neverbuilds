nw.race_picker = function() {
  var init = function() {  
    $('#picker').modal({show:     true, 
                        backdrop: 'static', 
                        keyboard: false});

    // choose a race
    $('.race-picker a').on('click', function() {
      $('#race').val($(this).attr('rel'));
      $('.picked-race').html($(this).find('.race').html());
      $('.race').hide();
      $('.class').show();
      return false;
    });

    // go back to race-picker
    $('.class .go-back').on('click', function() {
      $('#class, #race').val("");
      $('.class').hide();
      $('.race').show();
      return false;
    });

    // choose a class
    $('.class-picker a').on('click', function(e) {
      e.preventDefault();
      $('#class').val($(this).attr('rel'));
      $.ajax({
        type: "post",
        url: "/builds/pick",
        data: {"race":  $('#race').val(), 
               "class": $('#class').val()},
        dataType: "script",
        success: function() {
          setTimeout(function() {
            $('.modal .class').hide();
            $('.modal .race').show(); 
          }, 500);
        }
      }); 
    });
  };

  var show = function() {
   $('#picker').modal('show');
  };

  var hide = function() {
   $('#picker').modal('hide');
  }; 

  return {
    init: init,
    show: show,
    hide: hide
  };
}();
 
