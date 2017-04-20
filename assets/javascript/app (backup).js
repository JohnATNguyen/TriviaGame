// https://opentdb.com/

// Fisher-Yates Shuffle
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
		}

  return array;
}

function nextQuestion() {

}

function main() {

	var answers = [];
	var randomQuestion = Math.floor(Math.random() * 50);

	$.ajax({
		url: 'https://opentdb.com/api.php?amount=50',
		method: 'GET'
	}).done(function(response) {
		correctAnswer = response.results[randomQuestion].correct_answer;
		console.log(correctAnswer);
		answers = [correctAnswer];
		for (var i = 0, n = response.results[randomQuestion].incorrect_answers.length; i < n; i++) {
			answers.push(response.results[randomQuestion].incorrect_answers[i]);
		}

		shuffle(answers);
		console.log (answers);

		if (response.results[randomQuestion].type == 'multiple') {
			$('#stuff').html(`
				<div id="info" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div id="time" class="row">
						<h2>Time Remaining: <span id="timer">30</span> Seconds</h2>
					</div>
					<div id="question" class="row">
						<h2 id="questions">${response.results[randomQuestion].question}</h2>
					</div>
				</div>
				<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div id="0" class="answerDiv row center-block">
						<h1>A) <span class="answerText">${answers[answers.length - (answers.length)]}</span></h1>
					</div>
					<div id="1" class="answerDiv row center-block">
						<h1>B) <span class="answerText">${answers[answers.length - (answers.length - 1)]}</span></h1>
					</div>
					<div id="2" class="answerDiv row center-block">
						<h1>C) <span class="answerText">${answers[answers.length - (answers.length - 2)]}</span></h1>
					</div>
					<div id="3" class="answerDiv row center-block">
						<h1>D) <span class="answerText">${answers[answers.length - (answers.length - 3)]}</span></h1>
					</div>				
				</div>
			`);
		}
		else if (response.results[randomQuestion].type == 'boolean') {
			if (answers[0] == 'True') {
				$('#stuff').html(`
					<div id="info" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="time" class="row">
							<h2>Time Remaining: <span id="timer">30</span> Seconds</h2>
						</div>
						<div id="question" class="row">
							<h2 id="questions">${response.results[randomQuestion].question}</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="0" class="answerDiv row center-block">
							<h1>A) <span class="answerText">${answers[0]}</span></h1>
						</div>
						<div id="1" class="answerDiv row center-block">
							<h1>B) <span class="answerText">${answers[1]}</span></h1>
						</div>	
					</div>
				`);
			}
			else if (answers[1] == 'True') {
				$('#stuff').html(`
					<div id="info" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="time" class="row">
							<h2>Time Remaining: <span id="timer">30</span> Seconds</h2>
						</div>
						<div id="question" class="row">
							<h2 id="questions">${response.results[randomQuestion].question}</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="0" class="answerDiv row center-block">
							<h1>A) <span class="answerText">${answers[1]}</span></h1>
						</div>
						<div id="1" class="answerDiv row center-block">
							<h1>B) <span class="answerText">${answers[0]}</span></h1>
						</div>	
					</div>
				`);
			}
		}

		if (response.results[randomQuestion].type == 'multiple') {
			for (var i = 0, n = answers.length; i < n; i++) {
				if (answers[i] == correctAnswer) {
					$('#' + i).addClass('correct');
				}
				else
					$('#' + i).addClass('incorrect');
			}
		}
		else if (response.results[randomQuestion].type == 'boolean') {
			if (answers[0] == 'True') {
					$('#0').addClass('correct');
					$('#1').addClass('incorrect');		
			}
			else if (answers[1] == 'True') {
					$('#0').addClass('incorrect');
					$('#1').addClass('correct');					
			}
		}

		$('.correct').on('click', function() {
			$.ajax({
				url: `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${response.results[randomQuestion].question}+${correctAnswer}`,
				method: 'GET'
			}).done(function(response) {
				$('#stuff').html(`
					<div id="info" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="time" class="row">
							<h2>Time Remaining: <span id="timer">TIME LEFT</span> Seconds</h2>
						</div>
						<div id="question" class="row">
							<h2>CORRECT!</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<div><img src="${response.data.image_original_url}" alt="Powered by Giphy"></div>
						</div>
					</div>
				`);
			});
			// setTimeout(nextQuestion, 5000);
		});
		$('.incorrect').on('click', function() {
			$.ajax({
				url: `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${response.results[randomQuestion].question}+${correctAnswer}`,
				method: 'GET'
			}).done(function(response) {
				$('#stuff').html(`
					<div id="info" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="time" class="row">
							<h2>Time Remaining: <span id="timer">TIME LEFT</span> Seconds</h2>
						</div>
						<div id="question" class="row">
							<h2>INCORRECT! The correct answer is ${correctAnswer}.</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<div><img src="${response.data.image_original_url}" alt="Powered by Giphy"></div>
						</div>
					</div>
				`);
			});
			// setTimeout(nextQuestion, 5000);
		});
	});
}