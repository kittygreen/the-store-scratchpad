const backgroundMusic = document.getElementById('backgroundMusic');
logEvent('PageLoad', { pageName: 'terms' });



document.addEventListener('DOMContentLoaded', () => {
    const sillyClauses = [
        "BY ENTERING THIS STORE, YOU MAY COME IN CLOSE CONTACT WITH NUTS AND EVEN NUTTIER PERFORMERS. LIQUIDS, SPRAYS, GELS, GLUE AND VARIOUS FOOD ITEMS WILL BE USED THROUGHOUT THE WEEKEND.",
        "No non-Inconvenience store bucket hats can be worn inside.",
        "You must know that this is our 10th boomtown",
        "Clause 4: I am holding up 12 fingers"
    ];

    const questions = [
        "Which of these won't you see or be covered with inside the venue?",
        "What can't be worn inside?",
        "What number Boomtown is this year for the Inconvenience Store?",
        "According to clause 4, how may fingers am i holding up?"
    ];

    const correctAnswers = [
        "animal products",
        "non-Inconvenience store bucket hats",
        "10",
        "12"
    ];

    const wrongAnswers = [
        ["liquids", "sprays", "gels", "glue", "various food items"],
        ["birthday suit", "boot-cut jeans", "football shirts"],
        ["5", "6", "7", "8", "9", "11", "12"],
        ["5", "6", "7", "8", "9", "11", "13"]
    ];

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const termsContent = `
        <h1 class="flashing-text">TO CONTINUE PLEASE READ AND ACCEPT OUR TERMS AND CONDITIONS</h1>
        <h2>Terms and conditions</h2>
        <p class="fading-text">Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Inconvenience Store's relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.</p>
        <p class="fading-text">The term 'Inconvenience Store' or 'us' or 'we' refers to the owner of the website whose registered office is Inconvenience Store, Letsbe Avenue, Boomtown. Our company registration number is 3498486993. The term 'you' refers to the user or viewer of our website.</p>

        <h2>Terms of Use</h2>
        <p>The use of this website is subject to the following terms of use:</p>
        <ul class="fading-text">
            <li>${sillyClauses[2]}</li>
            <li>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</li>
            <li>This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: .</li>
            <li>${sillyClauses[3]}</li>
            <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
            <li>${sillyClauses[0]}</li>
            <li>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</li>
            <li>${sillyClauses[1]}</li>
            <li>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
            <li>All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
            <li>Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.</li>
            <li>From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).</li>
            <li>Your use of this website and any dispute arising out of such use of the website is subject to the laws of England, Northern Ireland, Scotland and Wales.</li>
        </ul>
    `;

    const termsContentDiv = document.getElementById('termsContent');
    termsContentDiv.innerHTML = termsContent;

    document.getElementById('acceptTermsButton').addEventListener('click', () => {
        document.getElementById('quizModal').style.display = 'block';
        backgroundMusic.play();
        backgroundMusic.volume = 1;

        // Insert quiz questions
        const quizQuestionsDiv = document.getElementById('quizQuestions');
        quizQuestionsDiv.innerHTML = '';
        questions.forEach((question, index) => {
            let options = [correctAnswers[index], ...wrongAnswers[index]];
            options = shuffle(options);

            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <label>${question}</label>
                <select name="question${index}" required>
                    <option value="">Select an answer</option>
                    ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
            `;
            quizQuestionsDiv.appendChild(questionDiv);
        });
    });

    function generateToken() {
        return Math.random().toString(36).substr(2); // Generate a simple random token
    }

    document.getElementById('quizForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const userAnswers = [];
        questions.forEach((_, index) => {
            userAnswers.push(document.querySelector(`select[name="question${index}"]`).value.toLowerCase());
        });

        let correct = true;
        userAnswers.forEach((answer, index) => {
          logEvent('AnswerGiven', { pageName: 'terms', answer: answer });
            if (answer !== correctAnswers[index].toLowerCase()) {
                correct = false;
            }
        });

        if (correct) {
            const token = generateToken();
            sessionStorage.setItem('signupToken', token); // Store the token in session storage
            window.location.href = `signup-form.html?token=${token}`;
        } else {
            logEvent('FailedAttempt', { pageName: 'terms', reason: 'failed_quiz' });
            document.getElementById('quizModal').style.display = 'none';
            document.getElementById('failModal').style.display = 'block';
        }
    });

    document.getElementById('failContinueButton').addEventListener('click', () => {
        window.location.href = 'index.html'; // Reload to the main site
    });
});
