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
                    <label for="edit-dates">Dates and Times:</label>
                    <textarea id="edit-dates">${hobbyInfo.dates.map(dateInfo => `${dateInfo.date}: ${dateInfo.times.join(', ')}`).join('\n')}</textarea>
                    <button type="submit">Update</button>
                </form>
            `;

            const editHobbyForm = document.getElementById('edit-hobby-form');
            editHobbyForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const updatedHobby = {
                    description: document.getElementById('edit-description').value,
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
        });
});
