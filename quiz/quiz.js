$(document).ready(function(){
	//to read data
	var data;
	var count = 0;
	var score = 0;
	const total_question_count = 10;
	var total;
	var quesTimeout;
	var next_question;

	var lvl1, lvl2, lvl3;
	var current_level;

	var lvl1_correct = 0;
	var lvl2_correct = 0;
	var lvl3_correct = 0;

	var badge_url;
	var character;
	var badge;

	$.ajax({
	  type: "GET",  
	  url: "data.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		data = $.csv.toObjects(response);

		instruction = data.filter(function (el) {
		  return el.category == "Instruction";
		})[0];

		lvl1 = data.filter(function (el) {
		  return el.difficulty == 1;
		});
		lvl2 = data.filter(function (el) {
		  return el.difficulty == 2;
		});
		lvl3 = data.filter(function (el) {
		  return el.difficulty == 3;
		});

		lvl1 = shuffle(lvl1);
		lvl2 = shuffle(lvl2);
		lvl3 = shuffle(lvl3);

		var questions = []
		for(var i=0; i<total_question_count; i++){
			questions.push(null);
		}

		current_level = 1;
		next_question = instruction;

		generateTrackers(questions);
		generateQuestions(next_question, count);
	  }   
	});

	//load badges
	$.ajax({
	  type: "GET",  
	  url: "badges.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		var badges = $.csv.toObjects(response);
		var random_badge = shuffle(badges)[0]

		badge_url = random_badge.url;
		character = random_badge.character;
		description = random_badge.description;

		badge = {"url": badge_url, "character": character, "description": description}
		// console.log(badge_url)
		// console.log(character)
	  	// console.log(badge)
	  }   
	});

	function generateTrackers(myData, myCount){
		var scoreHTML = $('#createScore').html();
		var scoreTemplate = Handlebars.compile(scoreHTML);
		var scoreData = scoreTemplate(myData);

		$.when($('#tracker-section').html(scoreData)).done(function(){
			//add events on click
			$(".question-track-item").on('click', function(event) {
				// console.log($(this).attr('class'));
			});
			for (var i=0; i<total_question_count; i++){
				// $('.tracker-'+i+'>p').text((i+1));
			}
		});
	}

	function generateBadge(myData){
		var badgeHTML = $('#createBadge').html();
		var badgeTemplate = Handlebars.compile(badgeHTML);
		var badgeData = badgeTemplate(myData);

		//for the bg image
		$('.bg-image').addClass('score-bg-img');
		$('.content').css('background-color', 'transparent');

		$.when($('#quiz-content').html(badgeData)).done(function(){
			//add events on click
			$("#tracker-section").hide();
			$('#user-score').text(score);
			$('#total-ques').text(total_question_count);

			$("#share-button").on('click', function(event) {
				
			});
		});
	}

	function generateQuestions(myData, myCount){
		var currentData = myData;
		var isQuestion = true;
		var hasExplanation = true;
		$('#tracker-section').show(0);
		$('.bg-image').removeClass('covid-img');
		$('.content').css('background-color', '#FBF9D2');
		if(currentData.category.trim() == "" ){
			hasExplanation = false;
		}
		if (currentData.category == "Instruction") {
			currentData.instruction = true;
			isQuestion = false;
			$('#tracker-section').hide(0);
			$('.bg-image').addClass('covid-img');
			$('.content').css('background-color', 'transparent');
		} else{
			var otheroptions = [currentData.other1, currentData.other2, currentData.other3, currentData.other4, currentData.other5];
			var others = otheroptions.filter(function (el) {
				 return el.trim() != "";
			});
			var options = shuffle(others);
			if(options.length >= 4) {
				// console.log(options);
				options = options.slice(0, 3);
			}
			currentData.other = shuffle(options);
			// console.log(options);
		}

		// console.log(currentData);

		var quizHTML = $('#createQuestions').html();
		var quizTemplate = Handlebars.compile(quizHTML);
		var quizData = quizTemplate(currentData);

		// console.log(quizData)
		$.when($('#quiz-content').html(quizData)).done(function(){
			
			if(isQuestion){
				$('.tracker-'+(count-2)).removeClass('active-tracker');
				$('.tracker-'+(count-1)).addClass('active-tracker');
				var wrongClicked = false;
				$('#question-number-indicator').text('Question '+ String(count) +'/'+ String(total_question_count));
				shuffleOptions('answer-block', 'answer-text');

				$(".answer-option").on('click', function(event) {
					$('.tracker-'+(count-1)).removeClass('active-tracker');
					if($(this).hasClass('correct-answer')){

						$(".answer-option").css("pointer-events", "none");
						// $(this).addClass('correct-ans');
						$(this).css({'background-color': '#59C057', 'border-color': '#59C057',  'color': 'white'});

						if(!wrongClicked){	
							score++;
							on_correct_counter(current_level);
							$('.tracker-'+(count-1)).css('background-color', '#59C057');
							$('.tracker-'+(count-1)).css('border', 'none');
						}

						if(hasExplanation){
							quesTimeout = setTimeout(function(){
								$('.explanation-text').fadeIn(250, function(){
								});
								$("#next-button").fadeIn(250);
							}, 500);							
						} else{
							$("#next-button").show(0);
						}
					} else{
						$(this).css("pointer-events", "none");
						// $(this).addClass('incorrect-ans');
						$(this).css({'background-color': '#FA9B80', 'border-color': '#FA9B80',  'color': 'white'});
						if(!wrongClicked){	
							$('.tracker-'+(count-1)).css('background-color', '#F95841');
							$('.tracker-'+(count-1)).css('border', 'none');
						}	
						wrongClicked = true;
					}
				});
			}

			$("#next-button").on('click', function(event) {
				next_question = get_next_question(current_level);
				if(count == total_question_count){
					generateBadge(badge);
					$('#quiz-content').css('top', '0');
					$('#quiz-content').css('height', '100%');
					return false;
				} else{
					count++;
					$(this).hide(0);
					generateQuestions(next_question, count);
				}
			});
		});

	}

	function get_next_question(lvl){
		if(lvl == 1){
			return lvl1.pop(); 
		}else if(lvl == 2){
			return lvl2.pop(); 
		}else if(lvl == 3){
			return lvl3.pop(); 
		}
	}

	function on_correct_counter(lvl){
		if(current_level == 1){
			lvl1_correct++;
		}else if(current_level == 2){
			lvl2_correct++;
		}else if(current_level == 3){
			lvl3_correct++;
		}
		if(lvl1_correct == 5){
			current_level = 2;
		}
		if(lvl2_correct == 3){
			current_level = 3;
		}
	}

	
	function getRandom(arr, n) {
	    var result = new Array(n),
	        len = arr.length,
	        taken = new Array(len);
	    if (n > len)
	        throw new RangeError("getRandom: more elements taken than available");
	    while (n--) {
	        var x = Math.floor(Math.random() * len);
	        result[n] = arr[x in taken ? taken[x] : x];
	        taken[x] = --len in taken ? taken[len] : len;
	    }
	    return result;
	}

	// function to shuffle options
	function shuffleOptions(optionContainerID, optionsClass) {
		var container = document.getElementById(optionContainerID);
		var elementsArray = Array.prototype.slice.call(container.getElementsByClassName(optionsClass));
		    elementsArray.forEach(function(element){
		    container.removeChild(element);
		})
		shuffle(elementsArray);
		elementsArray.forEach(function(element){
			container.appendChild(element);
		})
	}

	function shuffle(a) {
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;
	}

});

