nw.hud = function() {
  var init = function() {
    // shows the popover for specific type
    $('#hud .button').popover({
        placement: 'top', 
        html: true, 
        animation: false, 
        show: true,
        content: function() {
          return $('[data-button='+$(this).attr('rel')+']').html();
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

        $('#hud [rel='+$(this).find('input').val()+']').removeClass('hidden');

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

  return {
    init: init
  };
}(); 
