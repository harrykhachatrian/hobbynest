document.addEventListener('DOMContentLoaded', function() {
    const hobbyId = new URLSearchParams(window.location.search).get('id');
    const hobbyName = document.getElementById('hobby-name');
    const hobbyDescription = document.getElementById('hobby-description');
    const hobbyLocation = document.getElementById('hobby-location');
    const hobbyContact = document.getElementById('hobby-contact');
    const hobbyDuration = document.getElementById('hobby-duration');
    const hobbyCreditCost = document.getElementById('hobby-credit-cost');
    const classDatesBody = document.getElementById('class-dates-body');
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

                classDatesBody.innerHTML = '';
                hobby.dates.forEach(dateInfo => {
                    dateInfo.times.forEach(time => {
                        const { date, time: formattedTime } = formatDateTime(dateInfo.date, time);
                        const tr = document.createElement('tr');
                        const dateTd = document.createElement('td');
                        const timeTd = document.createElement('td');
                        const actionTd = document.createElement('td');
                        const registerButton = document.createElement('button');

                        dateTd.textContent = date;
                        timeTd.textContent = formattedTime;
                        registerButton.textContent = 'Register';
                        registerButton.classList.add('register-button');
                        registerButton.dataset.date = dateInfo.date;
                        registerButton.dataset.time = time;
                        registerButton.dataset.cost = hobby.creditCost;

                        actionTd.appendChild(registerButton);
                        tr.appendChild(dateTd);
                        tr.appendChild(timeTd);
                        tr.appendChild(actionTd);
                        classDatesBody.appendChild(tr);
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
                    const li = document.createElement('li');
                    li.textContent = `Hobby ID: ${rc.hobbyId}, Date: ${rc.date}, Time: ${rc.time}`;
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.addEventListener('click', function() {
                        getHobbyCreditCost(rc.hobbyId).then(creditCost => {
                            fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/cancel`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ hobbyId: rc.hobbyId, date: rc.date, time: rc.time, creditCost })
                            })
                            .then(response => response.json())
                            .then(user => {
                                alert('Class cancelled successfully!');
                                loadUserCredits();
                                loadRegisteredClasses();
                            })
                            .catch(error => console.error('Error:', error));
                        });
                    });
                    li.appendChild(cancelButton);
                    registeredClassesList.appendChild(li);
                });
            });
    }

    function getHobbyCreditCost(hobbyId) {
        return fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`)
            .then(response => response.json())
            .then(hobby => hobby.creditCost);
    }

    loadHobbyDetails();
    loadUserCredits();
    loadRegisteredClasses();
});
