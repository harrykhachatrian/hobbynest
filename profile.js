document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Assuming a single user for simplicity
    const profileView = document.getElementById('profile-view');
    const editProfileForm = document.getElementById('edit-profile-form');
    const viewName = document.getElementById('view-name');
    const viewEmail = document.getElementById('view-email');
    const viewCredits = document.getElementById('view-credits');
    const editProfileButton = document.getElementById('edit-profile-button');
    const saveProfileButton = document.getElementById('save-profile-button');
    const addCreditsButton = document.getElementById('add-credits-button');
    const interestsList = document.getElementById('interests-list');
    const newInterestInput = document.getElementById('new-interest');
    const addInterestButton = document.getElementById('add-interest-button');
    const upcomingClassesList = document.getElementById('upcoming-classes-list');

    function loadUserProfile() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                viewName.textContent = user.name;
                viewEmail.textContent = user.email;
                viewCredits.textContent = user.credits;
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                loadInterests(user.interests);
                loadUpcomingClasses(user.registeredClasses);
            });
    }

    function loadInterests(interests) {
        interestsList.innerHTML = '';
        interests.forEach(interest => {
            const li = document.createElement('li');
            li.textContent = interest;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = function() {
                fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/interests`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ interest })
                }).then(response => response.json())
                  .then(user => {
                      loadInterests(user.interests);
                  });
            };
            li.appendChild(removeButton);
            interestsList.appendChild(li);
        });
    }

    function loadUpcomingClasses(registeredClasses) {
        upcomingClassesList.innerHTML = '';
        registeredClasses.forEach(rc => {
            fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${rc.hobbyId}`)
                .then(response => response.json())
                .then(hobby => {
                    const li = document.createElement('li');
                    li.textContent = `${hobby.name} - Date: ${rc.date}, Time: ${rc.time}`;
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.onclick = function() {
                        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/cancel`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ hobbyId: rc.hobbyId, date: rc.date, time: rc.time, creditCost: hobby.creditCost })
                        }).then(response => response.json())
                          .then(user => {
                              alert('Class cancelled successfully!');
                              loadUserProfile();
                          });
                    };
                    li.appendChild(cancelButton);
                    upcomingClassesList.appendChild(li);
                });
        });
    }

    editProfileButton.addEventListener('click', function() {
        profileView.style.display = 'none';
        editProfileForm.style.display = 'block';
    });

    saveProfileButton.addEventListener('click', function(event) {
        event.preventDefault();
        const updatedUser = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        }).then(response => response.json())
          .then(user => {
              alert('Profile updated successfully');
              loadUserProfile();
              profileView.style.display = 'block';
              editProfileForm.style.display = 'none';
          });
    });

    addInterestButton.addEventListener('click', function() {
        const newInterest = newInterestInput.value.trim();
        if (newInterest === '') {
            alert('Please enter an interest.');
            return;
        }
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/interests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ interest: newInterest })
        }).then(response => response.json())
          .then(user => {
              newInterestInput.value = '';
              loadInterests(user.interests);
          });
    });

    addCreditsButton.addEventListener('click', function() {
        const creditsToAdd = prompt("Add 6 Credits for $50\nAdd 12 Credits for $100\nAdd 18 Credits for $150");
        let creditsAmount;
        switch (creditsToAdd) {
            case '6':
                creditsAmount = 6;
                break;
            case '12':
                creditsAmount = 12;
                break;
            case '18':
                creditsAmount = 18;
                break;
            default:
                alert('Invalid selection.');
                return;
        }
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/credits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credits: creditsAmount })
        }).then(response => response.json())
          .then(user => {
              alert(`Successfully added ${creditsAmount} credits.`);
              loadUserProfile();
          });
    });

    loadUserProfile();
});
