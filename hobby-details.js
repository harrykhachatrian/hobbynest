document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const hobbyCreditCost = document.getElementById('hobby-credit-cost'); // New field for credit cost
    const classDatesList = document.getElementById('class-dates');

    function formatDateTime(dateStr, timeStr) {
        const date = new Date(dateStr + 'T' + timeStr);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        return {
            date: date.toLocaleDateString('en-US', options),
            time: date.toLocaleTimeString('en-US', timeOptions)
        };
    }

    function createDropdown(dateInfo) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = dateInfo.dateFormatted;
        button.classList.add('dropdown-button');
        li.appendChild(button);

        const ul = document.createElement('ul');
        ul.classList.add('dropdown-content');
        ul.style.display = 'none';

        dateInfo.times.forEach(time => {
            const timeLi = document.createElement('li');
            const { time: formattedTime } = formatDateTime(dateInfo.date, time);
            timeLi.textContent = formattedTime;
            timeLi.style.paddingLeft = '20px'; // Indent the times
            ul.appendChild(timeLi);
        });

        li.appendChild(ul);
        button.addEventListener('click', function() {
            ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
        });

        return li;
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

                classDatesList.innerHTML = '';
                hobby.dates.forEach(dateInfo => {
                    const formattedDate = formatDateTime(dateInfo.date, '09:00').date;
                    const dropdownItem = createDropdown({ ...dateInfo, dateFormatted: formattedDate });
                    classDatesList.appendChild(dropdownItem);
                });
            });
    }

    loadHobbyDetails();
});
