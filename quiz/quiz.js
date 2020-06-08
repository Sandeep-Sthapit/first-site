$(document).ready(function(){
	//to read data
	var data;
	var count = 0;
	const total_question_count = 15;
	var total;
	var quesTimeout;

	$.ajax({
	  type: "GET",  
	  url: "data.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		data = $.csv.toObjects(response);
		var questions = getRandom(data.slice(1), total_question_count);
		total = data.slice(0,1).concat(questions);

		generateTrackers(questions);
		generateQuestions(total, count);
	  }   
	});

	function generateTrackers(myData, myCount){
		var scoreHTML = $('#createScore').html();
		var scoreTemplate = Handlebars.compile(scoreHTML);
		var scoreData = scoreTemplate(myData);

		$.when($('#tracker-section').html(scoreData)).done(function(){
			//add events on click
			$(".question-track-item").on('click', function(event) {
				console.log($(this).attr('class'));
			});
		});
	}

	function generateQuestions(myData, myCount){
		var currentData = myData[myCount];
		var isQuestion = true;
		var hasExplanation = true;
		if(currentData.category.trim() == "" ){
			hasExplanation = false;
		}
		if (currentData.category == "Instruction") {
			currentData.instruction = true;
			isQuestion = false;
		} else{
			var otheroptions = [currentData.other1, currentData.other2, currentData.other3, currentData.other4, currentData.other5];
			var others = otheroptions.filter(function (el) {
				 return el.trim() != "";
			});
			var options = shuffle(others);
			if(options.length >= 4) {
				console.log(options);
				options = options.slice(0, 3);
			}
			currentData.other = shuffle(options);
			console.log(options);
		}

		console.log(currentData)

		var quizHTML = $('#createQuestions').html();
		var quizTemplate = Handlebars.compile(quizHTML);
		var quizData = quizTemplate(currentData);

		console.log(quizData)
		$.when($('#quiz-content').html(quizData)).done(function(){
			
			if(isQuestion){
				$('.tracker-'+(count-2)).removeClass('active-tracker');
				$('.tracker-'+(count-1)).addClass('active-tracker');
				var wrongClicked = false;
				$('#question-number-indicator').text('Question '+ String(count) +' of '+ String(total_question_count));
				shuffleOptions('answer-block', 'answer-text');
				if(count == total_question_count){
					$("#next-button").text('Play Again');
				}

				$(".answer-option").on('click', function(event) {
					console.log('here');
					if($(this).hasClass('correct-answer')){
						$(this).css('background-color', "green");
						$(".answer-option").css("pointer-events", "none");
						if(!wrongClicked){	
							$('.tracker-'+(count-1)).css('background-color', 'green');
						}
						if(hasExplanation){
							quesTimeout = setTimeout(function(){
								$('.qna-block').fadeOut(500, function(){
									$('.explanation-text').fadeIn(500, function(){
									});
									$("#next-button").fadeIn(500);
								});
							}, 500);							
						} else{
							$("#next-button").show(0);
						}
					} else{
						$(this).css('background-color', "red");
						$(this).css("pointer-events", "none");
						if(!wrongClicked){	
							$('.tracker-'+(count-1)).css('background-color', 'red');
						}	
					}
				});
			}

			$("#next-button").on('click', function(event) {
				if(count == total_question_count){
					location.reload();
					return false;
				} else{
					count++;
					$(this).hide(0);
					generateQuestions(total, count);
				}
			});
		});

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

