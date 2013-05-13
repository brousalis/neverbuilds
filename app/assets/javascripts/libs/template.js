nw.template = function() {
  var init = function() {  
    $('#hud .button')
      .popover({
        placement: 'top',
        html: 'true',
        animation: false,
        show: true,
        content: function() {
          return $('[data-button="'+$(this).attr('rel')+'"]').html();
        }
      })
      .click(function(e) {
        e.preventDefault()
        $('.button').not(this).popover('hide').removeClass('active');
        $(this).toggleClass('active');
    });  
    $('body').on('click', '.popover .button', function(e) {
      var style = $(this).find('.image').css('background')
      $(this).parents().find('.active .image').css('background', style);
    });
  };

  return {
    init: init
  };
}();
  
