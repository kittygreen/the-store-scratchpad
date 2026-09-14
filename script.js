document.addEventListener('DOMContentLoaded', function() {

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    overlay.addEventListener('click', function() {
        console.log("hello");
        overlay.style.display = 'none';
        setTimeout(() => {
            initializePopups(); // Initialize and display the initial popups
        }, 1000);
    });


    let hasSeenIntro = localStorage.getItem('hasSeenIntro')
    overlay.style.display = 'none';
    if (!hasSeenIntro) {
        logEvent('IntroShown', { pageName: 'homepage' });
        localStorage.setItem('hasSeenIntro', true);
        overlay.style.display = 'flex';
    } else {
      setTimeout(() => {
          initializePopups(); // Initialize and display the initial popups
      }, 1000);
    }

    var popups = ['popup1', 'popup2', 'popup3', 'popup4'];
    var closeButtonPositions = [
        'close-top-right', 'close-bottom-left',
        'close-top-left', 'close-bottom-right'
    ];
    const popsound = document.getElementById('popsound');
    const charliSound = document.getElementById('charliSound');
    const bennySound = document.getElementById('bennySound');
    let attemptsVar = 1;

    if (!localStorage.getItem('startTime')) {
        localStorage.setItem('startTime', Date.now());
    }
    if (!localStorage.getItem('attempts')) {
        localStorage.setItem('attempts', 1);
    } else {
        let attempts = parseInt(localStorage.getItem('attempts'));
        localStorage.setItem('attempts', parseInt(attempts) + 1);
        attemptsVar = parseInt(attempts) + 1;
    }
    logEvent('PageLoad', { pageName: 'homepage' });




    var firstPopupIndex = 0; // Start with the first popup
    var imageBasePath = 'img/'; // Base path for images
    var firstAdClicked = false;
    const token = generateToken();
    sessionStorage.setItem('termsToken', token);
    sessionStorage.setItem('signupToken', token);
    let displayedBratImages = [];
    let displayedNonBratImages = [];
    let clickCounts = new Array(popups.length).fill(0); // Track clicks on close buttons

    // Parameters for number of brat and non-brat images
    const numberOfBratImages = 13; // Total number of brat images available
    const numberOfNonBratImages = 11; // Total number of non-brat images available
    const initialBratImages = 3; // Number of brat images to show initially
    const initialNonBratImages = 9 - initialBratImages; // Number of non-brat images to show initially
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.style.display = 'block';
    }


    const notBratDescription = [
      "Kier is not brat altho he looks like an old dnb DJ from the 90s in this pic amirite??"
      , "Kim will say she's brat but she's NOT. THIS SHOWS YOU ARE A ROBOT NOW GO BACK TO ROBOT SCHOOL"
      , "Trump is not brat."
      , "Stevie G is not brat. ur defo not a human. ynwa"
      , "Drake is not brat, you are either a robot or you need to have a deep think about ur life choices"
      , "errrr Toast is not brat. you might be a robot. not worth the risk."
      , "Tier bikes are brat are you joking. that shade of green erughhhhhhh"
      , "The Olympics are not brat. altho the logo kinda is"
      , "did u actually think Tesla was brat. u are defo a robot"
      , "Some people think Paris is brat. OR SHOULD I SAY SOME ROBOTS THINK PARIS IS BRAT. not this time you binary b"
      , "the green is close but DEFINITELY not. apart from their own brand summer energy drink weirdly"
    ]

    function moveCloseButton(closeButton) {
        var randomPosition = closeButtonPositions[Math.floor(Math.random() * closeButtonPositions.length)];
        closeButton.className = 'close-btn ' + randomPosition; // Apply random position
    }

    // Initialize and display the popups when the page loads
    function initializePopups() {
        showPopup(firstPopupIndex); // Show the first popup

        // Attach close event to each popup
        popups.forEach((popupId, index) => {
            var closeButton = document.getElementById('close-btn' + (index + 1));
            var popup = document.getElementById(popupId);
            var link = popup.querySelector('a');
            console.log(link)
            clickCounts[index] = 0; // Initialize click count

            popup.addEventListener('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
              logEvent('FailedAttempt', { pageName: 'homepage', reason: 'Clicked on ad', adId: popupId });
              var link = popup.querySelector('a');
              window.location.href = link.href;// Open link in a new tab
            })

            closeButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation(); // Prevent default close action
                clickCounts[index]++;
                handleCloseButtonClick(index);
            });
        });
    }

    function showPopup(index) {
      setTimeout(() => {
        try {
          popsound.play();
        }
        catch(err) {
          console.log('user had not interacted with screen yet');
        }
        var popup = document.getElementById(popups[index]);
        var closeButton = popup.querySelector('.close-btn');
        moveCloseButton(closeButton); // Initial random position for close button
        popup.style.display = 'block'; // Show the popup
      }, 3000);

    }

    function handleCloseButtonClick(index) {
        if (index === 2 && clickCounts[index] === 1 && !firstAdClicked) {
            firstAdClicked = true; // Set the flag that the first ad has been clicked
            window.location.href = "mailto:boss@example.com?subject=Not%20feeling%20great&body=Dear%20[your bosses name],%0AI'm%20just%20emailing%20you%20to%20let%20you%20know%20that%20I've%20got%20a%20bit%20of%20a%20head%20cold%20and%20it's%20looking%20like%20I%20might%20not%20be%20able%20to%20make%20it%20in%20on%20Monday.%20It%20really%20seems%20to%20be%20going%20round%20at%20the%20moment!%20I'm%20going%20to%20rest%20up%20-%20hopefully%20see%20you%20Tuesday.%0ABest,%0A[your name]";
            return; // Exit the function to prevent further actions
        }

        if (clickCounts[index] < 1) {
            // Move the close button to a new random position
            var closeButton = document.getElementById('close-btn' + (index + 1));
            moveCloseButton(closeButton);
        } else {
            closePopup(index);
        }
    }

    function closePopup(index) {
        var popup = document.getElementById(popups[index]);
        popup.style.display = 'none'; // Hide the popup

        // Show next popup if exists
        var nextIndex = index + 1;
        if (nextIndex < popups.length) {
            showPopup(nextIndex);
        }
    }

    function loadImages() {
        const imageGrid = document.getElementById('imageGrid');
        imageGrid.innerHTML = ''; // Clear previous images
        displayedBratImages = [];
        displayedNonBratImages = [];

        // Create an array with 9 slots and shuffle it to randomize positions
        let indices = Array.from(Array(9).keys());
        indices = shuffleArray(indices);



        // Assign initial slots for brat and non-brat images
        for (let i = 0; i < 9; i++) {
            let img = document.createElement('img');
            if (indices[i] < initialBratImages) { // Assign brat images
                img.src = `${imageBasePath}isbrat${indices[i] + 1}.png`; // Brat images
                img.dataset.isBrat = 'true';
                displayedBratImages.push(indices[i] + 1);
            } else { // Assign non-brat images
                img.src = `${imageBasePath}notbrat${indices[i] - initialBratImages + 1}.png`; // Non-brat images
                img.dataset.isBrat = 'false';
                img.dataset.errorMessage = notBratDescription[indices[i] - initialBratImages]
                displayedNonBratImages.push(indices[i] - initialBratImages + 1);
            }
            img.addEventListener('click', handleImageClick);
            imageGrid.appendChild(img);
        }

        document.getElementById('verifyButton').style.display = 'block'; // Always show the verify button
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    function assignImage(img) {
        let bratDecision = Math.random() < 0.33;
        let imagePath, isBrat;

        if (bratDecision && displayedBratImages.length < numberOfBratImages) { // Assign brat images
            do {
                isBrat = Math.floor(Math.random() * numberOfBratImages) + 1; // Select a brat image index
            } while (displayedBratImages.includes(isBrat) && displayedBratImages.length < numberOfBratImages);
            imagePath = `${imageBasePath}isbrat${isBrat}.png`;
            displayedBratImages.push(isBrat);
            img.dataset.isBrat = 'true';
        } else if (displayedNonBratImages.length < numberOfNonBratImages) { // Assign non-brat images
            do {
                isBrat = Math.floor(Math.random() * numberOfNonBratImages) + 1; // Select a non-brat image index
            } while (displayedNonBratImages.includes(isBrat) && displayedNonBratImages.length < numberOfNonBratImages);
            imagePath = `${imageBasePath}notbrat${isBrat}.png`;
            displayedNonBratImages.push(isBrat);
            img.dataset.isBrat = 'false';
            img.dataset.errorMessage = notBratDescription[isBrat-1];
        } else { // Fallback if all images have been displayed
            imagePath = `${imageBasePath}notbrat1.png`;
            img.dataset.isBrat = 'false';
        }

        img.src = imagePath;
        img.removeEventListener('click', handleImageClick); // Remove previous event listener
        img.addEventListener('click', handleImageClick);

        return img;
    }

    function handleImageClick(event) {
        const img = event.target;
        if (img.dataset.isBrat === 'false') {
          logEvent('FailedAttempt', { pageName: 'homepage', reason: 'Clicked on non-brat', errorMessage: img.dataset.errorMessage });
          showError(img.dataset.errorMessage);
        } else {

          img.classList.add('fade-out');


            // Wait for the animation to complete before replacing the image
            setTimeout(() => {
                img.classList.remove('fade-out');
                loadNewImage(img);
            }, 500); // 1s duration for the fade-out animation

        }
    }

    function loadNewImage(img) {
        // Check if all brat images have been displayed
        if (displayedBratImages.length === numberOfBratImages) {
            img.src = `${imageBasePath}notbrat1.png`; // Default to notbrat1.png
            img.dataset.isBrat = 'false'; // Mark it as non-brat to avoid confusion
        } else {
            assignImage(img); // Assign a new image
        }
    }

    function checkCompletion() {
        logEvent('VerifyClicked', undefined);
        const images = document.querySelectorAll('#imageGrid img');
        const anyBratsLeft = Array.from(images).some(img => img.dataset.isBrat === 'true');
        if (!anyBratsLeft) {
            charliSound.play();
            const token = generateToken();
            const confettiContainer = document.querySelector('.confetti');
            confettiContainer.style.zIndex = 100000;

            for (let i = 0; i < 100; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.classList.add('confetti-piece-brat');
                confettiPiece.style.left = `${Math.random() * 100}%`;
                confettiPiece.style.animationDelay = `${Math.random() * 5}s`;
                confettiPiece.style.animationDuration = `${Math.random() * 2 + 3}s`;
                confettiContainer.appendChild(confettiPiece);
            }
            sessionStorage.setItem('termsToken', token); // Store the token in session storage
            console.log(`terms.html?token=${token}`);
            setTimeout(() => {
              window.location.href = `terms.html?token=${token}`; // Redirect to terms and conditions page
            }, 3000);
        } else {
            logEvent('FailedAttempt', { pageName: 'homepage', reason: 'Stil brats left' });
            showError("There was still brat, which you'd know if you weren't a computer program running on loop trying to destroy our servers. Hope you get a virus. You got algo we got rhythm. Goodbye.") // Error if any brat is left
        }
    }

    function generateToken() {
        return Math.random().toString(36).substr(2); // Generate a simple random token
    }


    function getRandomPosition(element) {
        const x = window.innerWidth - element.clientWidth;
        const y = window.innerHeight - element.clientHeight;
        const randomX = Math.random() * x;
        const randomY = Math.random() * y;
        return [randomX, randomY];
    }

    function moveButton() {
        const button = document.getElementById('signupButton');
        const [newX, newY] = getRandomPosition(button);
        button.style.left = `${newX}px`;
        button.style.top = `${newY}px`;
    }


    document.getElementById('verifyButton').addEventListener('click', function() {
        checkCompletion();
    });

    document.getElementById('continueButton').addEventListener('click', function() {
        window.location.reload(); // Reload the entire page
    });



    const typewriterTexts = [
           "welcome to the inconvenience store ",
           "the home of everything you never wanted ",
           "click to continue. no more help.",
            "you have been warned "
       ];

       const typewriterContainer = document.getElementById('overlay');


       let index = 0;
       let textIndex = 0;
       let currentText = "";
       let isDeleting = false;
       const typingSpeed =50; // Typing speed in milliseconds
       const deletingSpeed = 25; // Deleting speed in milliseconds
       const delayBetweenTexts = 500; // Delay between texts in milliseconds

       function type() {
           if (index < typewriterTexts.length) {
               const fullText = typewriterTexts[index];
               if (isDeleting) {
                   currentText = fullText.substring(0, textIndex - 1);
                   textIndex--;
                   if (textIndex == -1) {
                       isDeleting = false;
                       index++;
                       setTimeout(type, delayBetweenTexts);
                       return;
                   }
               } else {
                   currentText = fullText.substring(0, textIndex + 1);
                   textIndex++;
                   if (currentText === fullText) {

                     if (index === typewriterTexts.length - 1) {
                        isGrowing = true;
                        typewriterContainer.querySelectorAll('.introtext')[index].classList.add('grow');
                    } else {                       isDeleting = true;
                       setTimeout(type, delayBetweenTexts);
                       return;
                     }
                   }
               }
               typewriterContainer.querySelectorAll('.introtext')[0].textContent = currentText;
               setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
           }
       }

       // Initialize text content for all introtext elements
       const introtextElements = typewriterContainer.querySelectorAll('.rush');
       introtextElements.forEach(element => {
           element.textContent = "";
       });

       type();




    let buttonHasStartedMoving = false;
    const signUpButton = document.getElementById('signupButton');
    signupButton.addEventListener('click', function() {
        let randomNum = Math.floor(Math.random() * 7);
        if((attemptsVar == 3 || (randomNum == 2 && attemptsVar > 4)) && buttonHasStartedMoving == false) {
          bennySound.play();
          buttonHasStartedMoving = true;
          setInterval(moveButton, 500);
          signupButton.textContent = 'catch me if you can teehee';
          logEvent('SoundPlayed', { pageName: 'homepage', sound: 'bennyHill' });
        } else {
          bennySound.pause();
          document.getElementById('captchaModal').style.display = 'block';
          loadImages();
        }

    });


    window.addEventListener( "pageshow", function ( event ) {
      var historyTraversal = event.persisted ||
                             ( typeof window.performance != "undefined" &&
                                  window.performance.navigation.type === 2 );

      if ( historyTraversal ) {
        // Handle page restore.
        window.location.reload();
      }
    });


});
