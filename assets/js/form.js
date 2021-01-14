$(".iletisim_form input,.iletisim_form textarea").focus(function() {
    $(".iletisim_form label[for='" + this.id + "']").attr("style", "padding-left:0px;top:0px;font-size: 11px;");
    $(this).parent().parent().addClass(this.id);
    $(".style").html("<style>div." + this.id + " span:before{width:100%;}</style>");
}).blur(function() {
    $(".style").html("<style>div." + this.id + " span:before{width:0%;}</style>");
    if ($(this).val() == "") {
        $(".iletisim_form label[for='" + this.id + "']").attr("style", "padding-left:15px;top:38px;font-size: 14px;");
        $(".style").html("<style>div." + this.id + " span:before{width:100%;border-bottom: 2px solid rgba(249, 52, 52, 1);}</style>");
    } else {
        $(".style").html("<style>div." + this.id + " span:before{width:100%;border-bottom: 2px solid rgba(40, 226, 19, 1);}</style>");
    }
});