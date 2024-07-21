document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Assuming a single user for simplicity. In a real app, manage user sessions.
    
    function loadProfile() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('user-name').value = user.name;
                document.getElementById('user-email').value = user.email;
                document.getElementById('credits-count').textContent = user.credits;
                loadUpcomingClasses(user.upcomingClasses);
            });
    }

    function loadUpcomingClasses(classes) {
        const classesList = document.getElementById('upcoming-classes-list');
        classesList.innerHTML = '';
        classes.forEach(classItem => {
            const li = document.createElement('li');
            li.textContent = `${classItem.name} on ${classItem.date}`;
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.marginLeft = '10px'; // Add margin directly in JavaScript if needed
            cancelButton.onclick = function() {
                cancelClass(classItem.id);
            };
            li.appendChild(cancelButton);
            classesList.appendChild(li);
        });
    }

    function updateProfile(event) {
        event.preventDefault();
        const updatedUser = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value
        };

        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        }).then(response => response.json())
          .then(data => {
              console.log('Profile updated:', data);
              alert('Profile updated successfully');
          });
    }

    function addCredits() {
        const creditsToAdd = prompt('How many credits do you want to add?', '10');
        if (creditsToAdd) {
            fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credits: parseInt(creditsToAdd) })
            }).then(response => response.json())
              .then(data => {
                  console.log('Credits added:', data);
                  document.getElementById('credits-count').textContent = data.credits;
              });
        }
    }

    function cancelClass(classId) {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/classes/${classId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                alert('Class canceled successfully');
                loadProfile(); // Refresh the profile data
            } else {
                alert('Failed to cancel class');
            }
        });
    }

    document.getElementById('profile-form').addEventListener('submit', updateProfile);
    document.getElementById('add-credits-button').addEventListener('click', addCredits);

    loadProfile(); // Initial load
});
