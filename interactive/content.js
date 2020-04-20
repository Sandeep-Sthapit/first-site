$(document).ready(function(){
	//to read data
	var count = 0;
	var totalCount;
	var data;
	const currentUrl = $(location).attr('href');

	$.getJSON("data.json", function(result){
	    data = result;
	    totalCount = data.page.length - 2; // -2 for the last share page count
	    const pageTitle = data["title"];

	    initSocialShare();

	    // console.log(data);

		var indicatorHTML = $('#createIndicators').html();
		var indicatorTemplate = Handlebars.compile(indicatorHTML);
		var indicatorData = indicatorTemplate(data);

		$.when($('#page-indication-bar').html(indicatorData)).done(function(){
			update(data, count);

			$('#next-arrow').on('click', function(){
				count++;
				update(data, count);
			});

			$('#three-dots').on('click', function(){
				count++;
				update(data, count);
			});

			$('#prev-arrow').on('click', function(){
				count--;
				update(data, count);
			});

			$('#replay-button').on('click', function(){
				count = 0;
				update(data, count);
			});

		});

		function highlightIndicators(myCount){
			var $children = $('#page-indication-bar').children();
			$children.removeClass('active-page');
			for(var i=0; i<=myCount; i++){
				$children.eq(i).addClass('active-page');
			}
		}

		function checkCount(myCount){
			$('#next-read-more').hide(0);
			$('#next-arrow').show(0);
			$('#prev-arrow').show(0);
			$("#three-dots").hide(0);
			$("#social-share-button").show(0);
			$("#replay-button").hide(0);
			$("#page-indication-bar").show(0);

			if( myCount == 0 ){
				$('#prev-arrow').hide(0);
				$('#next-read-more').show(0);
			}
			if( myCount == totalCount ){
				$('#next-arrow').hide(0);
				$("#three-dots").show(0);
			}
			if( myCount == totalCount + 1){
				$('#next-arrow').hide(0);
				$("#social-share-button").hide(0);
				$("#page-indication-bar").hide(0);
				$("#replay-button").show(0);
			}
		}

		function generatePage(myData, myCount){
			var pageHTML = $('#createPage').html();
			var pageTemplate = Handlebars.compile(pageHTML);
			var pageData = pageTemplate(data["page"][myCount]);

			$.when($('#page-content').html(pageData)).done(function(){
				//click function on each page
				$(".my-page").on("click", function(e){
					var ratio = e.pageX / $(".my-page").width();
					if(ratio>.25){
						$('#next-arrow').trigger("click");
					} else if(myCount > 0){
						$('#prev-arrow').trigger("click");
					}
				})
			});
		}

		function update(myData, myCount){
			checkCount(myCount);
			highlightIndicators(myCount);
			generatePage(myData, myCount);
		}

		//social share functions
		$('#social-share-button').on('click', openSocialShare);
		$('#close-social-share').on('click', closeSocialShare);
		$('#social-share-overlay').on('click', closeSocialShare);
		
		function closeSocialShare(){
			$('#social-share-overlay').fadeOut(200);
			$('#social-share').fadeOut(200);
		}
		function openSocialShare(){
			$('#social-share-overlay').fadeIn(200);
			$('#social-share').fadeIn(200);
		}
		function initSocialShare(){
			$('#social-share-email').attr('href', "mailto:?Subject="+ pageTitle +"&amp;Body=Enjoy%20the%20content%20"+currentUrl);
			$('#social-share-twitter').attr('href', "https://twitter.com/share?url="+currentUrl+"&amp;text="+pageTitle);
			$('#social-share-fb').attr('href', "http://www.facebook.com/sharer.php?u="+ currentUrl);
		}

		//copy functions
		$('#link-copy-button').on('click', function(){
			var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(currentUrl).select();
            document.execCommand("copy", false, $temp.val());
            $temp.remove();
		});

	});
});

