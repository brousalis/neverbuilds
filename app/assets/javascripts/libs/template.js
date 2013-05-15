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
    
    // handles switching the selected power
    $('body').on('click', '.popover .button', function(e) {
      e.preventDefault()

      var power = $(this).attr('rel'),
          image = $(this).find('.image'),
          input = $(this).parents().find('.active input'),
          active = $(this).parents().find('.active .image');

      if(input.val()) {
        $('[rel="'+input.val()+'"]').removeClass('hidden');
      }
       
      input.val(power);

      $('[rel="'+power+'"]').addClass('hidden');

      active.css('background', image.css('background'));

      $('.button').popover('hide').removeClass('active');
    }); 

  };
  return {
    init: init
  };
}();
  
