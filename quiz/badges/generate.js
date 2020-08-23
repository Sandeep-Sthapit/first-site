//This is done first to reroute if needed for data that doesn't exist (else would look messy)
myData = JSON.parse(sessionStorage.getItem("myData"));
score = parseInt(JSON.parse(sessionStorage.getItem("score"), 10));
total_question_count = parseInt(JSON.parse(sessionStorage.getItem("totalQuestionCount")));

automaticallyRerouteNew(score);

/**
 * The purpose of this is to reroute any new user who clicks on our link but has no score yet to go back
 * to the main page so that a quiz can be taken. This is a safety incase someone goes to this page
 * without any result yet.
 */
function automaticallyRerouteNew(score){
    if(isNaN(score)){
        document.location = "../index.html";
    }
}

/**
 * This can be used for all the badges (one single script) since it expects
 * dynamically injected variables. This can be used for ALL the badge html templates and 
 * is modular enough to do so thanks to the parameter passed in via quiz.js.
 */
$(document).ready(function(){
    sessionStorage.clear(); //to clear it afterwards till the new session
    generateBadge(myData, score, total_question_count); //for readability, even if global in scope


    /**
     * Using the data passed in from the quiz, we generate a page
     * which presents the HTML in the desired way.
     * @param {badge object} myData contains information passed in from other source 
     * @param {int} score the score passed in from other quiz source
     * @param {int} total_question_count passed in from quiz source
     */
    function generateBadge(myData, score, total_question_count){
        var badgeHTML = $('#createBadge').html();
        var badgeTemplate = Handlebars.compile(badgeHTML);
        var badgeData = badgeTemplate(myData);
        console.log(myData, score, total_question_count);
        //for the bg image
        $('.bg-image').addClass('score-bg-img');
        $('.content').css('background-color', 'transparent');
        $.when($('#quiz-content').html(badgeData)).done(function(){
            //add events on click
            $("#tracker-section").hide();
            $('#user-score').text(score);
            $('#total-ques').text(total_question_count);
            $("#share-button").on('click', function(event) {
                runTemporaryWorkaround(myData);
            });
        });
    }

/**
	 * The Facebook API has gotten very strict. Adding images
	 * can only be done via metadata hardcoded in the source file.
	 * This might be dynamically injectible via prerendering, which will
	 * communicate with any crawler only after statically bound. For now,
	 * we use Hashtags, and quotes, with creative usage of metadata, to
	 * get near what we want.
     * 
     * NOTE - the quote below is quite versatile - feel free to add to it
     * and make it more informative, if the user is sharing something, this is surely
     * to give them a creative medium, and we can add a default option that is pretty
     * good as it is (including maybe adding emojis? :p)
	 * 
	 * @param {badge} myData is a hashmap/enumlike object with badge data 
	 */
	function runTemporaryWorkaround(myData){
        console.log("We are about to use this url " + myData.character);
        FB.ui({
			method: 'share',
			href: "https://sandeep-sthapit.github.io/badges/"+myData.character+".html",
			hashtag: "#"+myData.character,
            quote: "That quiz told me I'm a " + myData.character + "!.\nIt describes me as follows: " + myData.description +
            ". What a description... you should try out the quiz to see what you get!",
		  }, function(response){});
	}

});