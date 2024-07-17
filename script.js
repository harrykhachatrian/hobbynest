document.addEventListener('DOMContentLoaded', function() {
    fetch('https://your-backend-url.herokuapp.com/hobbies')
        .then(response => response.json())
        .then(data => {
            const hobbyList = document.getElementById('hobby-list');
            data.forEach(hobby => {
                const li = document.createElement('li');
                li.textContent = hobby.name;
                li.dataset.id = hobby.id;
                hobbyList.appendChild(li);
            });
        });
});

function showHobbyDetails(hobbyId) {
    fetch(`https://your-backend-url.herokuapp.com/hobbies/${hobbyId}`)
        .then(response => response.json())
        .then(hobbyInfo => {
            document.getElementById('hobby-info').innerHTML = `
                <h3>${hobbyInfo.name}</h3>
                <p>${hobbyInfo.description}</p>
                <p>Location: ${hobbyInfo.location}</p>
                <p>Contact: ${hobbyInfo.contact}</p>
            `;
            document.getElementById('hobbies').style.display = 'none';
            document.getElementById('hobby-details').style.display = 'block';
        });
}

document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const hobbies = document.querySelectorAll('#hobby-list li');
    hobbies.forEach(hobby => {
        const name = hobby.textContent.toLowerCase();
        hobby.style.display = name.includes(query) ? '' : 'none';
    });
});

document.getElementById('hobby-list').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const hobbyId = event.target.dataset.id;
        showHobbyDetails(hobbyId);
    }
});

document.getElementById('back-button').addEventListener('click', function() {
    document.getElementById('hobbies').style.display = 'block';
    document.getElementById('hobby-details').style.display = 'none';
});
