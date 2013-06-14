//= require jquery
//= require jquery_ujs
//= require bootstrap-modal
//= require bootstrap-transition
//= require bootstrap-tooltip
//= require bootstrap-popover
//= require_self
//= require_tree .

var nw = (function(nw, $) {
  $(function() {
    nw.ui.init();
    nw.picker.init();
  });
  return nw;
}(nw || {}, jQuery));

