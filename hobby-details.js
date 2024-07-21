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
                    const dateLi = document.createElement('li');
                    const button = document.createElement('button');
                    button.textContent = dateInfo.date;
                    button.classList.add('dropdown-button');

                    const ul = document.createElement('ul');
                    ul.classList.add('dropdown-content');
                    ul.style.display = 'none';

                    dateInfo.times.forEach(time => {
                        const { date, time: formattedTime } = formatDateTime(dateInfo.date, time);
                        const li = document.createElement('li');
                        li.textContent = `${formattedTime} `;
                        const registerButton = document.createElement('button');
                        registerButton.textContent = 'Register';
                        registerButton.classList.add('register-button');
                        registerButton.dataset.date = dateInfo.date;
                        registerButton.dataset.time = time;
                        registerButton.dataset.cost = hobby.creditCost;
                        li.appendChild(registerButton);
                        ul.appendChild(li);
                    });

                    dateLi.appendChild(button);
                    dateLi.appendChild(ul);
                    classDatesList.appendChild(dateLi);

                    button.addEventListener('click', function() {
                        ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
                    });
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
                                alert(user.error);
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
                    fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${rc.hobbyId}`)
                        .then(response => response.json())
                        .then(hobby => {
                            const li = document.createElement('li');
                            li.textContent = `${hobby.name} - ${rc.date} at ${rc.time}`;
                            const cancelButton = document.createElement('button');
                            cancelButton.textContent = 'Cancel';
                            cancelButton.addEventListener('click', function() {
                                fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/cancel`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ hobbyId: rc.hobbyId, date: rc.date, time: rc.time, creditCost: hobby.creditCost })
                                }).then(response => response.json())
                                .then(user => {
                                    alert('Class cancelled successfully');
                                    loadUserCredits();
                                    loadRegisteredClasses();
                                });
                            });
                            li.appendChild(cancelButton);
                            registeredClassesList.appendChild(li);
                        });
                });
            });
    }

    loadHobbyDetails();
    loadUserCredits();
    loadRegisteredClasses();
});