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
    slide_shit();
  };

  var slide_shit = function() {
    $('.navbar').animate({top: "0px"}, 300);
    //$('.build .hud .button').each(function(i) {
    //  $(this).delay((i + 1) * 80).animate({top: "0px"}, 300);
    //});
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

// markdown converter
var Markdown;if(typeof exports==="object"&&typeof require==="function"){Markdown=exports}else{Markdown={}}(function(){function c(e){return e}function d(e){return false}function b(){}b.prototype={chain:function(g,f){var e=this[g];if(!e){throw new Error("unknown hook "+g)}if(e===c){this[g]=f}else{this[g]=function(h){return f(e(h))}}},set:function(f,e){if(!this[f]){throw new Error("unknown hook "+f)}this[f]=e},addNoop:function(e){this[e]=c},addFalse:function(e){this[e]=d}};Markdown.HookCollection=b;function a(){}a.prototype={set:function(e,f){this["s_"+e]=f},get:function(e){return this["s_"+e]}};Markdown.Converter=function(){var j=this.hooks=new b();j.addNoop("plainLinkText");j.addNoop("preConversion");j.addNoop("postConversion");var w;var n;var e;var z;this.makeHtml=function(P){if(w){throw new Error("Recursive call to converter.makeHtml")}w=new a();n=new a();e=[];z=0;P=j.preConversion(P);P=P.replace(/~/g,"~T");P=P.replace(/\$/g,"~D");P=P.replace(/\r\n/g,"\n");P=P.replace(/\r/g,"\n");P="\n\n"+P+"\n\n";P=J(P);P=P.replace(/^[ \t]+$/mg,"");P=o(P);P=m(P);P=f(P);P=M(P);P=P.replace(/~D/g,"$$");P=P.replace(/~T/g,"~");P=j.postConversion(P);e=n=w=null;return P};function m(P){P=P.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm,function(S,U,T,R,Q,V){U=U.toLowerCase();w.set(U,C(T));if(Q){return R}else{if(V){n.set(U,V.replace(/"/g,"&quot;"))}}return""});return P}function o(R){var Q="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";var P="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";R=R.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,O);R=R.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,O);R=R.replace(/\n[ ]{0,3}((<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,O);R=R.replace(/\n\n[ ]{0,3}(<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>[ \t]*(?=\n{2,}))/g,O);R=R.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,O);return R}function O(P,Q){var R=Q;R=R.replace(/^\n+/,"");R=R.replace(/\n+$/g,"");R="\n\n~K"+(e.push(R)-1)+"K\n\n";return R}function f(R,Q){R=i(R);var P="<hr />\n";R=R.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,P);R=R.replace(/^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm,P);R=R.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm,P);R=L(R);R=q(R);R=g(R);R=o(R);R=I(R,Q);return R}function k(P){P=r(P);P=v(P);P=H(P);P=D(P);P=E(P);P=K(P);P=P.replace(/~P/g,"://");P=C(P);P=x(P);P=P.replace(/  +\n/g," <br>\n");return P}function v(Q){var P=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>)/gi;Q=Q.replace(P,function(S){var R=S.replace(/(.)<\/?code>(?=.)/g,"$1`");R=y(R,S.charAt(1)=="!"?"\\`*_/":"\\`*_");return R});return Q}function E(P){P=P.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,h);P=P.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,h);P=P.replace(/(\[([^\[\]]+)\])()()()()()/g,h);return P}function h(V,ab,aa,Z,Y,X,U,T){if(T==undefined){T=""}var S=ab;var Q=aa.replace(/:\/\//g,"~P");var R=Z.toLowerCase();var P=Y;var W=T;if(P==""){if(R==""){R=Q.toLowerCase().replace(/ ?\n/g," ")}P="#"+R;if(w.get(R)!=undefined){P=w.get(R);if(n.get(R)!=undefined){W=n.get(R)}}else{if(S.search(/\(\s*\)$/m)>-1){P=""}else{return S}}}P=A(P);P=y(P,"*_");var ac='<a href="'+P+'"';if(W!=""){W=G(W);W=y(W,"*_");ac+=' title="'+W+'"'}ac+=">"+Q+"</a>";return ac}function D(P){P=P.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,F);P=P.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,F);return P}function G(P){return P.replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}function F(V,ab,aa,Z,Y,X,U,T){var S=ab;var R=aa;var Q=Z.toLowerCase();var P=Y;var W=T;if(!W){W=""}if(P==""){if(Q==""){Q=R.toLowerCase().replace(/ ?\n/g," ")}P="#"+Q;if(w.get(Q)!=undefined){P=w.get(Q);if(n.get(Q)!=undefined){W=n.get(Q)}}else{return S}}R=y(G(R),"*_[]()");P=y(P,"*_");var ac='<img src="'+P+'" alt="'+R+'"';W=G(W);W=y(W,"*_");ac+=' title="'+W+'"';ac+=" />";return ac}function i(P){P=P.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(Q,R){return"<h1>"+k(R)+"</h1>\n\n"});P=P.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(R,Q){return"<h2>"+k(Q)+"</h2>\n\n"});P=P.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(Q,T,S){var R=T.length;return"<h"+R+">"+k(S)+"</h"+R+">\n\n"});return P}function L(Q){Q+="~0";var P=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;if(z){Q=Q.replace(P,function(S,V,U){var W=V;var T=(U.search(/[*+-]/g)>-1)?"ul":"ol";var R=l(W,T);R=R.replace(/\s+$/,"");R="<"+T+">"+R+"</"+T+">\n";return R})}else{P=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;Q=Q.replace(P,function(T,X,V,S){var W=X;var Y=V;var U=(S.search(/[*+-]/g)>-1)?"ul":"ol";var R=l(Y,U);R=W+"<"+U+">\n"+R+"</"+U+">\n";return R})}Q=Q.replace(/~0/,"");return Q}var p={ol:"\\d+[.]",ul:"[*+-]"};function l(R,Q){z++;R=R.replace(/\n{2,}$/,"\n");R+="~0";var P=p[Q];var S=new RegExp("(^[ \\t]*)("+P+")[ \\t]+([^\\r]+?(\\n+))(?=(~0|\\1("+P+")[ \\t]+))","gm");var T=false;R=R.replace(S,function(V,X,W,U){var aa=U;var ab=X;var Z=/\n\n$/.test(aa);var Y=Z||aa.search(/\n{2,}/)>-1;if(Y||T){aa=f(t(aa),true)}else{aa=L(t(aa));aa=aa.replace(/\n$/,"");aa=k(aa)}T=Z;return"<li>"+aa+"</li>\n"});R=R.replace(/~0/g,"");z--;return R}function q(P){P+="~0";P=P.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(Q,S,R){var T=S;var U=R;T=B(t(T));T=J(T);T=T.replace(/^\n+/g,"");T=T.replace(/\n+$/g,"");T="<pre><code>"+T+"\n</code></pre>";return"\n\n"+T+"\n\n"+U});P=P.replace(/~0/,"");return P}function N(P){P=P.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(e.push(P)-1)+"K\n\n"}function r(P){P=P.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(S,U,T,R,Q){var V=R;V=V.replace(/^([ \t]*)/g,"");V=V.replace(/[ \t]*$/g,"");V=B(V);V=V.replace(/:\/\//g,"~P");return U+"<code>"+V+"</code>"});return P}function B(P){P=P.replace(/&/g,"&amp;");P=P.replace(/</g,"&lt;");P=P.replace(/>/g,"&gt;");P=y(P,"*_{}[]\\",false);return P}function x(P){P=P.replace(/([\W_]|^)(\*\*|__)(?=\S)([^\r]*?\S[\*_]*)\2([\W_]|$)/g,"$1<strong>$3</strong>$4");P=P.replace(/([\W_]|^)(\*|_)(?=\S)([^\r\*_]*?\S)\2([\W_]|$)/g,"$1<em>$3</em>$4");return P}function g(P){P=P.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(Q,R){var S=R;S=S.replace(/^[ \t]*>[ \t]?/gm,"~0");S=S.replace(/~0/g,"");S=S.replace(/^[ \t]+$/gm,"");S=f(S);S=S.replace(/(^|\n)/g,"$1  ");S=S.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(T,U){var V=U;V=V.replace(/^  /mg,"~0");V=V.replace(/~0/g,"");return V});return N("<blockquote>\n"+S+"\n</blockquote>")});return P}function I(W,P){W=W.replace(/^\n+/g,"");W=W.replace(/\n+$/g,"");var X=W.split(/\n{2,}/g);var U=[];var Q=/~K(\d+)K/;var R=X.length;for(var S=0;S<R;S++){var T=X[S];if(Q.test(T)){U.push(T)}else{if(/\S/.test(T)){T=k(T);T=T.replace(/^([ \t]*)/g,"<p>");T+="</p>";U.push(T)}}}if(!P){R=U.length;for(var S=0;S<R;S++){var V=true;while(V){V=false;U[S]=U[S].replace(/~K(\d+)K/g,function(Y,Z){V=true;return e[Z]})}}}return U.join("\n\n")}function C(P){P=P.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");P=P.replace(/<(?![a-z\/?\$!])/gi,"&lt;");return P}function H(P){P=P.replace(/\\(\\)/g,s);P=P.replace(/\\([`*_{}\[\]()>#+-.!])/g,s);return P}function K(Q){Q=Q.replace(/(^|\s)(https?|ftp)(:\/\/[-A-Z0-9+&@#\/%?=~_|\[\]\(\)!:,\.;]*[-A-Z0-9+&@#\/%=~_|\[\]])($|\W)/gi,"$1<$2$3>$4");var P=function(S,R){return'<a href="'+R+'">'+j.plainLinkText(R)+"</a>"};Q=Q.replace(/<((https?|ftp):[^'">\s]+)>/gi,P);return Q}function M(P){P=P.replace(/~E(\d+)E/g,function(Q,S){var R=parseInt(S);return String.fromCharCode(R)});return P}function t(P){P=P.replace(/^(\t|[ ]{1,4})/gm,"~0");P=P.replace(/~0/g,"");return P}function J(S){if(!/\t/.test(S)){return S}var R=["    ","   ","  "," "],Q=0,P;return S.replace(/[\n\t]/g,function(T,U){if(T==="\n"){Q=U+1;return T}P=(U-Q)%4;Q=U+1;return R[P]})}var u=/(?:["'*()[\]:]|~D)/g;function A(Q){if(!Q){return""}var P=Q.length;return Q.replace(u,function(R,S){if(R=="~D"){return"%24"}if(R==":"){if(S==P-1||/[0-9\/]/.test(Q.charAt(S+1))){return":"}}return"%"+R.charCodeAt(0).toString(16)})}function y(T,Q,R){var P="(["+Q.replace(/([\[\]\\])/g,"\\$1")+"])";if(R){P="\\\\"+P}var S=new RegExp(P,"g");T=T.replace(S,s);return T}function s(P,R){var Q=R.charCodeAt(0);return"~E"+Q+"E"}}})();
(function() {
  var textarea = document.getElementsByTagName('textarea')[0],
      preview = document.createElement('div'),
      converter = new Markdown.Converter().makeHtml;

  function update() {
   preview.innerHTML = converter(textarea.value);
  }

  if (textarea) {
    preview.id = 'preview';
    textarea.parentNode.insertBefore(preview, textarea.nextSibling);
    textarea.oninput = function() {
      textarea.onkeyup = null;
      update();
    };
    textarea.onkeyup = update;
    textarea.onkeyup.call(textarea);
    $(window).scrollTop();
  }
}());
 
