document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const classDatesTable = document.getElementById('class-dates').getElementsByTagName('tbody')[0];

    function formatDateTime(dateStr, timeStr) {
        const date = new Date(dateStr + 'T' + timeStr);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        return {
            date: date.toLocaleDateString('en-US', options),
            time: date.toLocaleTimeString('en-US', timeOptions)
        };
    }

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
<<<<<<< HEAD

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
=======
                classDates.innerHTML = '';

                hobby.dates.forEach(dateInfo => {
                    dateInfo.times.forEach(time => {
                        const li = document.createElement('li');
                        li.textContent = formatDateTime(dateInfo.date, time);
                        classDates.appendChild(li);
>>>>>>> a82a57c1dfe88cdd5caa9bef3ffb6cc084b8038d
                    });
                });
            });
    }

    loadHobbyDetails();
});
