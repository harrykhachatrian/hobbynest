document.addEventListener('DOMContentLoaded', function() {
    const hobbyDetailsElement = document.getElementById('hobby-info');

    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        });
        return params;
    }

    const params = getQueryParams();
    const hobbyId = params.id;

    fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`)
        .then(response => response.json())
        .then(hobbyInfo => {
            hobbyDetailsElement.innerHTML = `
                <h3>Edit Hobby: ${hobbyInfo.name}</h3>
                <form id="edit-hobby-form">
                    <label for="edit-description">Description:</label>
                    <input type="text" id="edit-description" value="${hobbyInfo.description}">
                    <label for="edit-location">Location:</label>
                    <input type="text" id="edit-location" value="${hobbyInfo.location}">
                    <label for="edit-contact">Contact:</label>
                    <input type="text" id="edit-contact" value="${hobbyInfo.contact}">
                    <label for="edit-dates">Dates and Times:</label>
                    <textarea id="edit-dates">${hobbyInfo.dates.map(dateInfo => `${dateInfo.date}: ${dateInfo.times.join(', ')}`).join('\n')}</textarea>
                    <button type="submit">Update</button>
                    <button type="button" id="delete-hobby-button">Delete</button>
                </form>
            `;

            const editHobbyForm = document.getElementById('edit-hobby-form');
            editHobbyForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const updatedHobby = {
                    description: document.getElementById('edit-description').value,
                    location: document.getElementById('edit-location').value,
                    contact: document.getElementById('edit-contact').value,
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
                  .then(data => {
                      console.log('Hobby updated:', data);
                      alert('Hobby details updated successfully');
                  });
            });

            const deleteHobbyButton = document.getElementById('delete-hobby-button');
            deleteHobbyButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this hobby?')) {
                    fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`, {
                        method: 'DELETE'
                    }).then(response => {
                        if (response.ok) {
                            alert('Hobby deleted successfully');
                            window.location.href = 'index.html';
                        } else {
                            alert('Failed to delete hobby');
                        }
                    });
                }
            });
        });
});
