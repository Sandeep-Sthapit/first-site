$(document).ready(function(){

	//for sticky top navigation bar
	var $navbar = $("#topnav");
	stickyNav();

	$( window ).scroll(function() { 
		stickyNav();
	});

	function stickyNav(){
		var sticky = $navbar.offset().top;
		if (window.pageYOffset >= sticky) {
	    	$navbar.addClass("sticky")
	    	$('.content').css('margin-top', $navbar.height()+'px');
		} else {
		    $navbar.removeClass("sticky");
		    $('.content').css('margin-top', 0);
		}
	}

	//for jump scrolls
	$("#topnav a").on('click', function(event) {
		if (this.hash !== "") {
			$("#topnav a").removeClass('active-nav');
			$(this).addClass('active-nav');
			event.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
			    scrollTop: $(hash).offset().top - $navbar.height()
			}, 800, function(){
			 //    window.location.hash = hash;
			});
		}
	});



	//for accordions
	$('.accordion').each(function(i, obj) {
	    $(obj).on("click", function() {
		    $(this).toggleClass("active-accordion");
		    console.log(this)
		    var panel = this.nextElementSibling;
		    if (panel.style.maxHeight) {
		      panel.style.maxHeight = null;
		    } else {
		      panel.style.maxHeight = panel.scrollHeight + "px";
		    } 
	  	});
	});

	
	//for search
	var $submit = $('#search-submit');
	var $context = $('.content .faq-qna');
	var $section = $('.faq-section');
	var options = {
						"done": function(){
							$section.show();
						}
					}
	var unmark = function(){
		$context.show().unmark( options );
	}
	var mark = function() {
	    var keyword = $(".search-container input[type=text").val();
	    if (keyword) {
	        $context.mark(keyword, {
			    done: function() {
					console.log($section.find('.faq-qna').is(':visible').length);
					$context.not(":has(mark)").hide();
					$section.not(":has(mark)").hide();
				}
	      	});
	    }
	};
	function section_check(){
		var full_length = $('.faq-section').find('.faq-qna').length;
		var not_visible_length = $('.faq-section').find('.faq-qna').not(':visible').length;
		if($section.find('.faq-qna').not(':visible')) {

		} else {

		}
	}

	$(".search-container input[name='keyword']").on("input", unmark);
	$submit.on("click", mark);
});

