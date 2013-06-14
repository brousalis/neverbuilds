nw.ui = function() {
  var init = function() { 
    // toggler
    $('.toggle').on('click', function() {
      $('[class='+$(this).attr('rel')+']').toggle();
      $(this).toggleClass('open');
    })  

    // input stuff  
    $('input').not(':input[type=submit]')
              .input_focus();
    $('textarea').autosize();

    // modal registration
    registration();
    
    // navbar login
    handle_login();

    // slide in on show page
    slide_buttons();
  };

  var slide_buttons = function() {
    $('.build .hud .button').each(function(i) {
      $(this).delay((i + 1) * 80).animate({top: "0px"}, 300);
    });
    $('.build .character').animate({opacity: "1"}, 600);
  };

  var scroll_top = function() {
    $('html, body').animate({scrollTop: 0}, "slow");
  };

  var handle_login = function() {
    $('.login').on('click', function() {
      login();
      return false;
    });
    $('.nav .password').keypress(function(e) {
      if(e.which == 13) login();
    }); 
  };

  var login = function() {
    $.ajax({
      headers: {
        'X-Transaction': 'POST Example',
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }, 
      type: "post",
      url: "/sessions",
      data: {username: $('.nav .username').val(), password: $('.nav .password').val()},
      success: function(json){
        if(json.status == "success") {
          window.location = json.location
        } else {
          $('.nav .username, .nav .password').addClass('failure')
          $('li.error').fadeIn()
        }
      },
      dataType: "json"
    });
  };

  var registration = function() {
    // more ux omg
    $('#register').on('show', function() {
      setTimeout(function() {
        $('#user_username').focus();
      }, 500);
    });
     
    // because fuck you chrome
    $('#register input, #register form').attr('autocomplete','off');

    // omg ux
    $('#user_password_again').keypress(function(e) {
      if(e.which == 13) $('#new_user').submit();
    });
    
    // validate and submit
    $("#new_user").submit(function(e){
      if($("#user_username").val() == "") {
        $('#new_user .error').html('Username can\'t be blank');
        $('input[id*="username"]').addClass('error');
        $('#new_user .errors').show();
        return false
      } else {
        $('input[id*="username"]').removeClass('error');
      }

      if($("#user_password").val() != $("#user_password_again").val() ||
          $("#user_password").val() == "") {
        $('#new_user .error').html('Passwords do not match');
        $('input[id*="password"]').addClass('error');
        $('#new_user .errors').show();
        return false
      } else {
        $('input[id*="password"]').removeClass('error');
      }

      if($("#user_email").val() != "" && !validate_email($("#user_email").val())) {
        $('#new_user .error').html('Invalid email address');
        $('input[id*="email"]').addClass('error');
        $('#new_user .errors').show() ;
        return false
      } else {
        $('input[id*="email"]').removeClass('error');
      }

      $.ajax({
        headers: {
          'X-Transaction': 'POST Example',
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },  
        type: "post",
        url: "/users",
        data: $(this).serialize(),
        success: function(json){
          if(json.status == "success") {
            $('#new_user .errors').hide();
            window.location = json.location
          } else {
            if(json.location) window.location = json.location
            $('#new_user input').removeClass('error');
            $('#new_user .errors').fadeIn();
            $('#new_user .error').html(json.errors);
          }
        },
        dataType: "json"
      });

      return false;
    });  
  };

  var validate_email = function(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(email)
  };

  return {
    init: init,
    scroll_top: scroll_top
  };
}();

// autosize
(function(e){var t,o,n={className:"autosizejs",append:"",callback:!1},i="hidden",s="border-box",a="lineHeight",l='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',r=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],c="oninput",h="onpropertychange",p=e(l).data("autosize",!0)[0];p.style.lineHeight="99px","99px"===e(p).css(a)&&r.push(a),p.style.lineHeight="",e.fn.autosize=function(a){return a=e.extend({},n,a||{}),p.parentNode!==document.body&&(e(document.body).append(p),p.value="\n\n\n",p.scrollTop=9e4,t=p.scrollHeight===p.scrollTop+p.clientHeight),this.each(function(){function n(){o=b,p.className=a.className,e.each(r,function(e,t){p.style[t]=f.css(t)})}function l(){var e,s,l;if(o!==b&&n(),!d){d=!0,p.value=b.value+a.append,p.style.overflowY=b.style.overflowY,l=parseInt(b.style.height,10),p.style.width=Math.max(f.width(),0)+"px",t?e=p.scrollHeight:(p.scrollTop=0,p.scrollTop=9e4,e=p.scrollTop);var r=parseInt(f.css("maxHeight"),10);r=r&&r>0?r:9e4,e>r?(e=r,s="scroll"):u>e&&(e=u),e+=x,b.style.overflowY=s||i,l!==e&&(b.style.height=e+"px",w&&a.callback.call(b)),setTimeout(function(){d=!1},1)}}var u,d,g,b=this,f=e(b),x=0,w=e.isFunction(a.callback);f.data("autosize")||((f.css("box-sizing")===s||f.css("-moz-box-sizing")===s||f.css("-webkit-box-sizing")===s)&&(x=f.outerHeight()-f.height()),u=Math.max(parseInt(f.css("minHeight"),10)-x,f.height()),g="none"===f.css("resize")||"vertical"===f.css("resize")?"none":"horizontal",f.css({overflow:i,overflowY:i,wordWrap:"break-word",resize:g}).data("autosize",!0),h in b?c in b?b[c]=b.onkeyup=l:b[h]=l:b[c]=l,e(window).on("resize",function(){d=!1,l()}),f.on("autosize",function(){d=!1,l()}),l())})}})(window.jQuery||window.Zepto);

// focus
$.fn.input_focus = function() {
  return $(this).each(function() {
    var default_value = $(this).val();
    $(this).focus(function() {
      if($(this).val() == default_value) $(this).val("");
    }).blur(function(){
      if($(this).val().length == 0) $(this).val(default_value);
    });
  });
}  
