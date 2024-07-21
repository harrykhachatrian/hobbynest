document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const hobbyCreditCost = document.getElementById('hobby-credit-cost');
    const classDatesTable = document.getElementById('class-dates').getElementsByTagName('tbody')[0];
    const editHobbyButton = document.getElementById('edit-hobby-button');
    const editHobbyForm = document.getElementById('edit-hobby-form');
    const saveHobbyButton = document.getElementById('save-hobby-button');

    function formatDateTime(dateStr, timeStr) {
        const date = new Date(dateStr + 'T' + timeStr);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        return {
            date: date.toLocaleDateString('en-US', options),
            time: date.toLocaleTimeString('en-US', timeOptions)
        };
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
                hobbyCreditCost.textContent = hobby.creditCost; // Display credit cost

                classDatesTable.innerHTML = '';
                hobby.dates.forEach(dateInfo => {
                    dateInfo.times.forEach(time => {
                        const tr = document.createElement('tr');
                        const { date, time: formattedTime } = formatDateTime(dateInfo.date, time);
                        const dateTd = document.createElement('td');
                        const timeTd = document.createElement('td');
                        dateTd.textContent = date;
                        timeTd.textContent = formattedTime;
                        tr.appendChild(dateTd);
                        tr.appendChild(timeTd);
                        classDatesTable.appendChild(tr);
                    });
                });

                // Populate edit form fields
                document.getElementById('edit-description').value = hobby.description;
                document.getElementById('edit-location').value = hobby.location;
                document.getElementById('edit-contact').value = hobby.contact;
                document.getElementById('edit-duration').value = hobby.duration;
                document.getElementById('edit-credit-cost').value = hobby.creditCost; // Edit credit cost
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
            creditCost: document.getElementById('edit-credit-cost').value, // Save updated credit cost
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
