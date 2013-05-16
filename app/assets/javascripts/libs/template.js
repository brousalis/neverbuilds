nw.template = function() {
  var init = function() {  
    // the almighty hack of all hacks
    $('body').tooltip({
      selector: '[data-toggle=tooltip]'
    });
    
    // should move somewhere else
    $('.submit').click(save_build);

    $('fieldset.category a').click(function() {
      $('#build_category').val(this.innerText);
    })
    // end should move somewhere else

    handle_hud();
  };

  var save_build = function() {
    $('form').submit();
  };

  var handle_hud = function() {
    // shows the popover for specific type
    $('#hud .button')
      .popover({
        placement: 'top',
        html: true,
        animation: false,
        show: true,
        content: function() {
          return $('[data-button="'+$(this).attr('rel')+'"]').html();
        }
      })
      .click(function(e) {
        e.preventDefault()
        $('.button').not(this).popover('hide')
                              .removeClass('active');
        $(this).toggleClass('active');
      });
    $('#hud .button').bind('contextmenu', function(e) {
      e.preventDefault();
      $(this).popover('hide')
             .removeClass('active')
             .find('.image').removeAttr('style')
      $('[rel="'+$(this).find('input').val()+'"]').removeClass('hidden');
      $(this).find('input').val('');
    });  
    
    // handles switching the selected power
    $('body').on('click', '.popover .button', function(e) {
      e.preventDefault()

      var power = $(this).attr('rel'),
          image = $(this).find('.image'),
          input = $(this).parents().find('.active input'),
          active = $(this).parents().find('.active .image'),
          button = $(this).parents().find('.active');

      // unhide the previously selected power
      if(input.val()) {
        $('[rel="'+input.val()+'"]').removeClass('hidden');
      }
      
      // set the input to the newly selected power
      input.val(power);

      // hide the power in the popover
      $('[rel="'+power+'"]').addClass('hidden');

      // copy the selected power's image to the hud
      active.css('background', image.css('background'));

      // close the popover
      $('.button').popover('hide').removeClass('active');
    }); 

  };
  return {
    init: init
  };
}();
  
