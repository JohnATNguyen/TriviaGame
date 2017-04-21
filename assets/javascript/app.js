var correctAnswers = 0;
var incorrectAnswers = 0;
var unanswered = 0;

var jeopardy = new Audio('assets/Jeopardy-theme-song.mp3');

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

function main() {
	var numberOfQuestions = correctAnswers + incorrectAnswers + unanswered;
	console.log(numberOfQuestions);
	if (numberOfQuestions == 15) {
		jeopardy.play();
		$('#stuff').html(`
			<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="row">
					<h2>You've reached 15 questions... congratulations!!!</h2>
				</div>
				<div class="row">
					<h2>Here's how you did:</h2>
				</div>
			</div>
			<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="row">
					<h1>Correct Answers: ${correctAnswers}</h1>
					<h1>Incorrect Answers: ${incorrectAnswers}</h1>
					<h1>Unanswered: ${unanswered}</h1>
				</div>
			</div>
			<div>
				<h2>Please press <button type="button" class="btn btn-default" onclick="main()"><h1 class="adjustedH1">RESTART</h1></button> to play again!</h2>
			</div>
		`);
		correctAnswers = 0;
		incorrectAnswers = 0;
		unanswered = 0;
		return;
	}

	var answers = [];
	var randomQuestion = 0; // or Math.floor(Math.random() * 50), changing the number in the opentdb url below to 50 as well;

	$.ajax({
		url: 'https://opentdb.com/api.php?amount=1',
		method: 'GET'
	}).done(function(response) {
		correctAnswer = response.results[randomQuestion].correct_answer;
		console.log(correctAnswer);
		answers = [correctAnswer];
		for (var i = 0, n = response.results[randomQuestion].incorrect_answers.length; i < n; i++) {
			answers.push(response.results[randomQuestion].incorrect_answers[i]);
		}

		shuffle(answers);

		var number = 30;
		var interval = setInterval(function() {
			number--;
			$('#secs').text(number);
			if (number == 0) {
				unanswered++;
				jeopardy.pause();
				jeopardy.currentTime = 0;
				clearInterval(interval);
				$.ajax({
					url: `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=funny+${response.results[randomQuestion].question}+${correctAnswer}`,
					method: 'GET'
				}).done(function(response) {
					$('#stuff').html(`
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div class="row">
								<h2>Time Remaining: <span id="secs">${number}</span> Seconds</h2>
							</div>
							<div class="row">
								<h2>TIME'S UP! The correct answer is ${correctAnswer}.</h2>
							</div>
						</div>
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div class="row">
								<img id="gif" src="${response.data.image_original_url}" alt="Powered by Giphy">
							</div>
						</div>
					`);
					setTimeout(main, 5000);
				});
			}
		}, 1000);

		if (response.results[randomQuestion].type == 'multiple') {
			$('#stuff').html(`
				<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="row">
						<h2>Time Remaining: <span id="secs">${number}</span> Seconds</h2>
					</div>
					<div class="row">
						<h2>${response.results[randomQuestion].question}</h2>
					</div>
				</div>
				<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div id="0" class="answerDiv row center-block">
						<h1 class="adjustedH1"><span class="answerText">A) ${answers[answers.length - (answers.length)]}</span></h1>
					</div>
					<div id="1" class="answerDiv row center-block">
						<h1 class="adjustedH1"><span class="answerText">B) ${answers[answers.length - (answers.length - 1)]}</span></h1>
					</div>
					<div id="2" class="answerDiv row center-block">
						<h1 class="adjustedH1"><span class="answerText">C) ${answers[answers.length - (answers.length - 2)]}</span></h1>
					</div>
					<div id="3" class="answerDiv row center-block">
						<h1 class="adjustedH1"><span class="answerText">D) ${answers[answers.length - (answers.length - 3)]}</span></h1>
					</div>				
				</div>
			`);
		}
		else if (response.results[randomQuestion].type == 'boolean') {
			if (answers[0] == 'True') {
				$('#stuff').html(`
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<h2>Time Remaining: <span id="secs">${number}</span> Seconds</h2>
						</div>
						<div class="row">
							<h2>${response.results[randomQuestion].question}</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="0" class="answerDiv row center-block">
							<h1 class="adjustedH1"><span class="answerText">A) ${answers[0]}</span></h1>
						</div>
						<div id="1" class="answerDiv row center-block">
							<h1 class="adjustedH1"><span class="answerText">B) ${answers[1]}</span></h1>
						</div>	
					</div>
				`);
			}
			else if (answers[1] == 'True') {
				$('#stuff').html(`
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<h2>Time Remaining: <span id="secs">${number}</span> Seconds</h2>
						</div>
						<div class="row">
							<h2>${response.results[randomQuestion].question}</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div id="0" class="answerDiv row center-block">
							<h1 class="adjustedH1"><span class="answerText">A) ${answers[1]}</span></h1>
						</div>
						<div id="1" class="answerDiv row center-block">
							<h1 class="adjustedH1"><span class="answerText">B) ${answers[0]}</span></h1>
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
			if (correctAnswer == 'True') {
					$('#0').addClass('correct');
					$('#1').addClass('incorrect');		
			}
			else if (correctAnswer == "False") {
					$('#0').addClass('incorrect');
					$('#1').addClass('correct');					
			}
		}

		$('.correct').on('click', function() {
			correctAnswers++;
			jeopardy.pause();
			jeopardy.currentTime = 0;
			clearInterval(interval);
			$.ajax({
				url: `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=funny+${response.results[randomQuestion].question}+${correctAnswer}`,
				method: 'GET'
			}).done(function(response) {
				$('#stuff').html(`
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<h2>Time Remaining: <span id="secs">${number}</span> Seconds</h2>
						</div>
						<div class="row">
							<h2>CORRECT!</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<img id="gif" src="${response.data.image_original_url}" alt="Powered by Giphy">
						</div>
					</div>
				`);
				setTimeout(main, 5000);
			});
		});
		$('.incorrect').on('click', function() {
			incorrectAnswers++;
			jeopardy.pause();
			jeopardy.currentTime = 0;
			clearInterval(interval);
			$.ajax({
				url: `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=funny+${response.results[randomQuestion].question}+${correctAnswer}`,
				method: 'GET'
			}).done(function(response) {
				$('#stuff').html(`
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<h2>Time Remaining: <span id="secs">${number}</span> Seconds</h2>
						</div>
						<div class="row">
							<h2>INCORRECT! The correct answer is ${correctAnswer}.</h2>
						</div>
					</div>
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<img id="gif" src="${response.data.image_original_url}" alt="Powered by Giphy">
						</div>
					</div>
				`);
				setTimeout(main, 5000);
			});
		});
	});
}