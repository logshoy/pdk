
$('.request__link-data').click(function () {
	$('.request__personaldata').toggle();
});

$(document).ready(function(){
		$('form input[type="submit"]').prop("disabled", true);
		$('form input[type="submit"]').css("opacity", "0.3");
		$(".agree").click(function(){
            if($(this).prop("checked") == true){
                $('form input[type="submit"]').prop("disabled", false);
								$('form input[type="submit"]').css("opacity", "1");
            }
            else if($(this).prop("checked") == false){
                $('form input[type="submit"]').prop("disabled", true);
								$('form input[type="submit"]').css("opacity", "0.3");
            }
        });
    });

jQuery(document).ready(function(){
	$('.request__phone').mask('+0 (000) 000 00 00', {placeholder: "+_ (___) ___ __ __"});
});
