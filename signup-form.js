logEvent('PageLoad', { pageName: 'signupform' });


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const errorContinueButton = document.getElementById('errorContinueButton');
    const timerBar = document.getElementById('timerBar');
    let totalTime = 1.8 * 60; // Total time in seconds (5 minutes)
    let elapsed = 0;
    const surveyModal = document.getElementById('surveyModal');
    const feedbackSlider = document.getElementById('feedbackSlider');
    const feedbackValue = document.getElementById('feedbackValue');
    const submitFeedbackButton = document.getElementById('submitFeedbackButton');
    const additionalFeedbackModal = document.getElementById('additionalFeedbackModal');
    const additionalFeedback = document.getElementById('additionalFeedback');
    const submitAdditionalFeedbackButton = document.getElementById('submitAdditionalFeedbackButton');
    let outOfTime = false;
    let sucessSubmitted = false;

    function updateTimer() {
        if (!outOfTime) {
          elapsed += 0.25; // Increment elapsed time by 0.25 seconds (quarter of a second)
          let remainingTime = totalTime - Math.floor(elapsed * 4); // Countdown at 4x speed
          if (remainingTime <= 0) {
              timerBar.textContent = "Time's up!";
              logEvent('FailedAttempt', { pageName: 'signupForm', reason: 'timeout' });
              showError('You ran out of time');
              outOfTime = true;
              // Optionally, you can handle form timeout here
          } else {
              let minutes = Math.floor(remainingTime / 60);
              let seconds = remainingTime % 60;
              timerBar.textContent = `You have ${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutes to fill out this form.`;
          }
        }
    }

    setInterval(updateTimer, 250);

    setTimeout(() => {
      surveyModal.style.display = 'block';
    }, 5000);

    feedbackSlider.addEventListener('input', () => {
        feedbackValue.textContent = `${feedbackSlider.value}*`;
    });

    submitFeedbackButton.addEventListener('click', () => {
        logEvent('SiteFeedbackStars', { pageName: 'signupForm', stars: feedbackSlider.value });
        if (feedbackSlider.value !== '5') {
            surveyModal.style.display = 'none';
            additionalFeedbackModal.style.display = 'block';
        } else {
            surveyModal.style.display = 'none';
        }
    });

    submitAdditionalFeedbackButton.addEventListener('click', () => {
      if (additionalFeedback.value.trim() === '') {
          additionalFeedbackModal.style.display = 'none';
          logEvent('FailedAttempt', { pageName: 'signupForm', reason: 'didn\'t give feedback' });
          showError('We are so sorry that you didn\'t think giving us written feedback was worth your precious time. You must be really important. Maybe try again when you\'ve got capacity to take this seriously.');
      } else {
        logEvent('SiteFeedbackReason', { pageName: 'signupForm', feedback: additionalFeedback.value.trim() });
          additionalFeedbackModal.style.display = 'none';
      }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const optOut = document.getElementById('optOut').checked;
        logEvent('DetailsFormSubmission', { pageName: 'signupForm', firstName: firstName, lastName: lastName, email: email, phoneNUmber: phoneNumber  });

        if (firstName !== firstName.toLowerCase()) {
            logEvent('FailedAttempt', { pageName: 'signupForm', reason: 'first name not lower case' });
            showError('First name must be all lower case.');
            return;
        }

        if (lastName !== lastName.toUpperCase()) {
            logEvent('FailedAttempt', { pageName: 'signupForm', reason: 'last name not upper lower case' });
            showError('Last name must be all upper case.');
            return;
        }

        let attempts = parseInt(localStorage.getItem('attempts')) || 0;
        let timestamp = new Date().toISOString();
        const formData = {
            timestamp: timestamp,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            optOut: optOut,
            attempts: attempts,
            totalTime: Math.floor((Date.now() - parseInt(localStorage.getItem('startTime'))) / 1000) // Calculate total time in seconds
        };
        if (sucessSubmitted == false) {
          successSubmitted = true;
          fetch('https://script.google.com/macros/s/AKfycbwLzohbFfOPPpio_-eS0mbGR1v0fYvH-2g6CdwW_RKFcmRgg7w_-qKd-sPSQpvIryOH/exec', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              mode: 'no-cors',
              body: JSON.stringify(formData)
          })
          .then(() => {
              // Since we can't check the response, assume success
              window.location.href = `congratulations.html?firstName=${firstName}&lastName=${lastName}`;
          })
          .catch(error => {
              console.error('Error:', error);
              showError('Failed to submit form. Please try again.');
              successSubmitted = false;
          });

        }

    });

    errorContinueButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Reload to the main site
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.style.display = 'block';
    }
});
