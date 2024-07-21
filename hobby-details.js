document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const classDates = document.getElementById('class-dates');

    function formatDateTime(dateStr, timeStr) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const date = new Date(`${dateStr}T${timeStr}`);
        const day = daysOfWeek[date.getDay()];
        const month = monthsOfYear[date.getMonth()];
        const dayOfMonth = date.getDate();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        
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
            });
    }

    loadHobbyDetails();
});
