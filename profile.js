document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Assuming a single user for simplicity
    const userProfileForm = document.getElementById('user-profile-form');
    const interestsList = document.getElementById('interests-list');
    const newInterestInput = document.getElementById('new-interest');
    const addInterestButton = document.getElementById('add-interest-button');
    const upcomingClassesList = document.getElementById('upcoming-classes-list');

    function loadUserProfile() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                document.getElementById('credits').value = user.credits;
                loadInterests(user.interests);
                loadUpcomingClasses(user.exploredHobbies);
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

    function loadUpcomingClasses(exploredHobbies) {
        upcomingClassesList.innerHTML = '';
        exploredHobbies.forEach(hobbyId => {
            fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`)
                .then(response => response.json())
                .then(hobby => {
                    const li = document.createElement('li');
                    li.textContent = `${hobby.name} - ${hobby.dates.map(dateInfo => `${dateInfo.date}: ${dateInfo.times.join(', ')}`).join(', ')}`;
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.onclick = function() {
                        // Remove from exploredHobbies
                        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                exploredHobbies: exploredHobbies.filter(id => id !== hobbyId)
                            })
                        }).then(response => response.json())
                          .then(user => {
                              loadUpcomingClasses(user.exploredHobbies);
                          });
                    };
                    li.appendChild(cancelButton);
                    upcomingClassesList.appendChild(li);
                });
        });
    }

    userProfileForm.addEventListener('submit', function(event) {
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

    loadUserProfile();
});
