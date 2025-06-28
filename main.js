 const quizData = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2,
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1,
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                correct: 3,
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correct: 2,
            },
            {
                question: "What is the smallest prime number?",
                options: ["0", "1", "2", "3"],
                correct: 2,
            },    
            {
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "O2", "NaCl"],
                correct: 0,
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
                correct: 1,
            },
            {
                question: "Who wrote 'To Kill a Mockingbird'?",
                options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
                correct: 0,
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Quartz"],
                correct: 2,
            },   
            {
                question: "What is the main ingredient in guacamole?",
                options: ["Tomato", "Avocado", "Onion", "Pepper"],
                correct: 1,
            },
          ];

        let currentQuestion = 0;
        let score = 0;
        let selectedAnswer = null;
        let userAnswers = [];

        function displayQuestion() {
            const question = quizData[currentQuestion];

            // Update question counter and progress
            document.getElementById(
                "questionCounter"
            ).textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
            const progressPercent = ((currentQuestion + 1) / quizData.length) * 100;
            document.getElementById("progressFill").style.width = progressPercent + "%";

            // Display question
            document.getElementById("questionText").textContent = question.question;

            // Display options
            const optionsContainer = document.getElementById("optionsContainer");
            optionsContainer.innerHTML = "";

            question.options.forEach((option, index) => {
                const optionElement = document.createElement("div");
                optionElement.className = "option";
                optionElement.textContent = option;
                optionElement.onclick = () => selectOption(index, optionElement);
                optionsContainer.appendChild(optionElement);
            });

            // Update buttons
            const prevBtn = document.getElementById("prevBtn");
            const nextBtn = document.getElementById("nextBtn");

            prevBtn.style.display = currentQuestion > 0 ? "block" : "none";
            nextBtn.textContent =
                currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question";

            // Reset selection
            selectedAnswer = null;
            document.getElementById("errorMessage").classList.remove("show");

            // Restore previous answer if exists
            if (userAnswers[currentQuestion] !== undefined) {
                const options = document.querySelectorAll(".option");
                options[userAnswers[currentQuestion]]?.classList.add("selected");
                selectedAnswer = userAnswers[currentQuestion];
            }
        }

        function selectOption(index, optionElement) {
            selectedAnswer = index;
            const options = document.querySelectorAll(".option");
            options.forEach((opt) => opt.classList.remove("selected"));
            optionElement.classList.add("selected");
            document.getElementById("errorMessage").classList.remove("show");
        }

        function nextQuestion() {
            if (selectedAnswer === null) {
                // Show error
                document.getElementById("errorMessage").classList.add("show");
                return;
            }

            // Save user's answer
            userAnswers[currentQuestion] = selectedAnswer;

            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                displayQuestion();
            } else {
                // Quiz finished, show results
                showResults();
            }
        }

        function skipQuestion() {
            // Mark question as skipped (undefined answer)
            userAnswers[currentQuestion] = undefined;

            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                displayQuestion();
            } else {
                showResults();
            }
        }

        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                displayQuestion();
            }
        }

        function calculateScore() {
            score = 0;
            for (let i = 0; i < userAnswers.length; i++) {
                if (userAnswers[i] === quizData[i].correct) {
                    score++;
                }
            }
        }

        function showResults() {
            document.getElementById("quizContent").style.display = "none";
            const resultsDiv = document.getElementById("results");
            resultsDiv.classList.add("show");

            calculateScore();

            const percentage = Math.round((score / quizData.length) * 100);
            document.getElementById("scoreDisplay").textContent = `${score} / ${quizData.length}`;

            let message = "";
            if (percentage >= 80) {
                message = "🌟 Excellent! You really know your stuff!";
            } else if (percentage >= 60) {
                message = "👍 Good job! You got most of them right!";
            } else if (percentage >= 40) {
                message = "📚 Not bad, but there's room for improvement!";
            } else {
                message = "💪 Keep studying and try again!";
            }
            document.getElementById("scoreMessage").textContent = message;

            showFinalAnswers();
        }

        function showFinalAnswers() {
            const resultsDiv = document.getElementById("results");

            // Remove previous detailed answers if present
            const oldDetails = document.getElementById("detailedAnswers");
            if (oldDetails) {
                oldDetails.remove();
            }

            const detailedDiv = document.createElement("div");
            detailedDiv.id = "detailedAnswers";
            detailedDiv.style.textAlign = "left";
            detailedDiv.style.marginTop = "30px";

            quizData.forEach((q, idx) => {
                const questionDiv = document.createElement("div");
                questionDiv.style.marginBottom = "15px";

                const questionText = document.createElement("p");
                questionText.innerHTML = `<strong>Q${idx + 1}:</strong> ${q.question}`;
                questionDiv.appendChild(questionText);

                const userAnswerIndex = userAnswers[idx];
                const userAnswerText =
                    userAnswerIndex === undefined
                        ? "<em>Skipped</em>"
                        : q.options[userAnswerIndex];
                const correctAnswerText = q.options[q.correct];

                const answerText = document.createElement("p");
                answerText.innerHTML = `Your answer: ${userAnswerText} <br> Correct answer: <strong>${correctAnswerText}</strong>`;
                answerText.style.color =
                    userAnswerIndex === q.correct ? "green" : "red";

                questionDiv.appendChild(answerText);
                detailedDiv.appendChild(questionDiv);
            });

            resultsDiv.appendChild(detailedDiv);
        }

        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            selectedAnswer = null;
            userAnswers = [];
            document.getElementById("results").classList.remove("show");
            document.getElementById("quizContent").style.display = "block";
            displayQuestion();
        }

        // Initial call to display the first question
        displayQuestion();
    
