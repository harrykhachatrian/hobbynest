document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const hobbyCreditCost = document.getElementById('hobby-credit-cost');
    const classDatesList = document.getElementById('class-dates');
    const userCreditsElement = document.getElementById('user-credits');
    const userId = 1;

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
            timeLi.textContent = `at ${formatDateTime(dateInfo.date, time).time}`;
            timeLi.style.paddingLeft = '20px';

            const registerButton = document.createElement('button');
            registerButton.textContent = 'Register';
            registerButton.classList.add('register-button');
            registerButton.dataset.date = dateInfo.date;
            registerButton.dataset.time = time;
            registerButton.dataset.cost = hobbyCreditCost.textContent;

            timeLi.appendChild(registerButton);
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
                hobbyCreditCost.textContent = hobby.creditCost;

                classDatesList.innerHTML = '';
                hobby.dates.forEach(dateInfo => {
                    const formattedDate = formatDateTime(dateInfo.date, '09:00').date;
                    const dropdownItem = createDropdown({ ...dateInfo, dateFormatted: formattedDate });
                    classDatesList.appendChild(dropdownItem);
                });

                document.querySelectorAll('.register-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const date = this.dataset.date;
                        const time = this.dataset.time;
                        const cost = parseInt(this.dataset.cost);

                        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/register`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ hobbyId, date, time, creditCost: cost })
                        })
                        .then(response => response.json())
                        .then(user => {
                            if (user.error) {
                                if (user.error === 'Insufficient credits.') {
                                    if (confirm('You do not have enough credits to register for this class, would you like to purchase additional credits?')) {
                                        window.location.href = 'profile.html';
                                    }
                                } else {
                                    alert(user.error);
                                }
                            } else {
                                alert('Class registered successfully!');
                                loadUserCredits();
                                loadRegisteredClasses();
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    });
                });
            });
    }

    function loadUserCredits() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                userCreditsElement.textContent = user.credits;
            });
    }

    function loadRegisteredClasses() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                const registeredClassesList = document.getElementById('registered-classes-list');
                registeredClassesList.innerHTML = '';
                user.registeredClasses.forEach(rc => {
                    const li = document.createElement('li');
                    li.textContent = `Hobby ID: ${rc.hobbyId}, Date: ${rc.date}, Time: ${rc.time}`;
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.addEventListener('click', function() {
                        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/cancel`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ hobbyId: rc.hobbyId, date: rc.date, time: rc.time, creditCost: hobbyCreditCost.textContent })
                        })
                        .then(response => response.json())
                        .then(user => {
                            alert('Class cancelled successfully!');
                            loadUserCredits();
                            loadRegisteredClasses();
                        })
                        .catch(error => console.error('Error:', error));
                    });
                    li.appendChild(cancelButton);
                    registeredClassesList.appendChild(li);
                });
            });
    }

    loadHobbyDetails();
    loadUserCredits();
    loadRegisteredClasses();
});
