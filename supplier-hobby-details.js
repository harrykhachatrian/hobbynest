document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const classDates = document.getElementById('class-dates');
    const editHobbyButton = document.getElementById('edit-hobby-button');
    const editHobbyForm = document.getElementById('edit-hobby-form');
    const saveHobbyButton = document.getElementById('save-hobby-button');

    function formatDateTime(dateStr, timeStr) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const date = new Date(`${dateStr}T${timeStr}`);
        const day = daysOfWeek[date.getDay()];
        const month = monthsOfYear[date.getMonth()];
        const dayOfMonth = date.getDate();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `${day}, ${month} ${dayOfMonth} at ${time}`;
    }

    function loadHobbyDetails() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`)
            .then(response => response.json())
            .then(hobby => {
                hobbyName.textContent = hobby.name;
                hobbyDescription.textContent = hobby.description;
                hobbyLocation.textContent = hobby.location;
                hobbyContact.textContent = hobby.contact;
                hobbyDuration.textContent = hobby.duration;
                classDates.innerHTML = '';

                hobby.dates.forEach(dateInfo => {
                    dateInfo.times.forEach(time => {
                        const li = document.createElement('li');
                        li.textContent = formatDateTime(dateInfo.date, time);
                        classDates.appendChild(li);
                    });
                });

                document.getElementById('edit-description').value = hobby.description;
                document.getElementById('edit-location').value = hobby.location;
                document.getElementById('edit-contact').value = hobby.contact;
                document.getElementById('edit-duration').value = hobby.duration;
                document.getElementById('edit-dates').value = hobby.dates.map(dateInfo => `${dateInfo.date}: ${dateInfo.times.join(', ')}`).join('\n');
            });
    }

    editHobbyButton.addEventListener('click', function() {
        editHobbyForm.style.display = 'block';
    });

    saveHobbyButton.addEventListener('click', function() {
        const updatedHobby = {
            description: document.getElementById('edit-description').value,
            location: document.getElementById('edit-location').value,
            contact: document.getElementById('edit-contact').value,
            duration: document.getElementById('edit-duration').value,
            dates: document.getElementById('edit-dates').value.split('\n').map(line => {
                const [date, times] = line.split(': ');
                return {
                    date,
                    times: times.split(', ')
                };
            })
        };

        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedHobby)
        }).then(response => response.json())
          .then(() => {
              alert('Hobby updated successfully');
              editHobbyForm.style.display = 'none';
              loadHobbyDetails();
          });
    });

    loadHobbyDetails();
});
