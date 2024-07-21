document.addEventListener('DOMContentLoaded', function() {
    const userView = document.getElementById('user-view');
    const supplierView = document.getElementById('supplier-view');
    const viewUserButton = document.getElementById('view-user');
    const viewSupplierButton = document.getElementById('view-supplier');
    const addHobbyButton = document.getElementById('add-hobby-button');
    const addHobbyForm = document.getElementById('add-hobby-form');
    const newHobbyForm = document.getElementById('new-hobby-form');
    const searchButton = document.getElementById('search-button');
    const notificationElement = document.getElementById('notification');

    let userId = 1; // Assuming a single user for simplicity. In a real app, manage user sessions.

    function formatHobbyName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    // Fetch and display hobbies for user view
    function loadHobbies() {
        const hobbyList = document.getElementById('hobby-list');
        hobbyList.style.display = 'none'; // Hide hobby list initially
    }

    function searchHobbies() {
        const query = document.getElementById('search-bar').value.trim().toLowerCase();
        if (query === '') {
            alert('Please enter a search term.');
            return;
        }

        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: query })
        })
        .then(response => response.json())
        .then(data => {
            const hobbyList = document.getElementById('hobby-list');
            hobbyList.innerHTML = '';
            if (data.length === 0) {
                hobbyList.style.display = 'none';
                alert(`No hobbies found for "${query}".`);
                return;
            }
            hobbyList.style.display = 'block';
            data.forEach(hobby => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `hobby-details.html?id=${hobby.id}`;
                a.textContent = hobby.name;
                li.appendChild(a);
                hobbyList.appendChild(li);
            });
        });
    }

    // Fetch and display trending hobbies
    function loadTrendingHobbies() {
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/trending-hobbies')
            .then(response => response.json())
            .then(data => {
                const trendingHobbyList = document.getElementById('trending-hobby-list');
                trendingHobbyList.innerHTML = '';
                data.forEach(hobby => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `hobby-details.html?id=${hobby.id}`;
                    a.textContent = hobby.name;
                    li.appendChild(a);
                    trendingHobbyList.appendChild(li);
                });
            });
    }

    // Fetch and display hidden gems
    function loadHiddenGems() {
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hidden-gems')
            .then(response => response.json())
            .then(data => {
                const hiddenGemsList = document.getElementById('hidden-gems-list');
                hiddenGemsList.innerHTML = '';
                data.forEach(hobby => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `hobby-details.html?id=${hobby.id}`;
                    a.textContent = hobby.name;
                    li.appendChild(a);
                    hiddenGemsList.appendChild(li);
                });
            });
    }

    function handleSearch() {
        const query = formatHobbyName(document.getElementById('search-bar').value);
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: query })
        })
        .then(response => response.json())
        .then(hobby => {
            window.location.href = `hobby-details.html?id=${hobby.id}`;
            loadTrendingHobbies();
            loadHiddenGems();
        })
        .catch(() => {
            if (confirm(`Sorry, ${query} is not yet offered, do you want to add it to your wishlist?`)) {
                fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hobbyName: query })
                }).then(response => response.json())
                  .then(user => {
                      loadWishlist(user.wishlist);
                  });
            }
        });
    }

    function loadWishlist(wishlist) {
        const wishlistElement = document.getElementById('wishlist');
        wishlistElement.innerHTML = '';
        wishlist.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.style.marginLeft = '10px'; // Add margin directly in JavaScript if needed
            removeButton.onclick = function() {
                fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/wishlist`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hobbyName: item })
                }).then(response => response.json())
                  .then(user => {
                      loadWishlist(user.wishlist);
                  });
            };
            li.appendChild(removeButton);
            wishlistElement.appendChild(li);
        });
    }

    function fetchAndLoadWishlist() {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                loadWishlist(user.wishlist);
                if (user.notification) {
                    displayNotification(user.notification);
                    // Clear the notification after displaying it
                    user.notification = null;
                    fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    });
                }
            });
    }

    function loadSupplierWishlist() {
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/wishlist')
            .then(response => response.json())
            .then(data => {
                const supplierWishlist = document.getElementById('supplier-wishlist');
                supplierWishlist.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item} is in the wishlist, are you able to and willing to offer this as a hobby?`;
                    const acceptButton = document.createElement('button');
                    acceptButton.textContent = 'Yes';
                    acceptButton.onclick = function() {
                        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/wishlist/accept', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ hobbyName: item })
                        }).then(response => response.json())
                          .then(() => {
                              loadSupplierWishlist();
                              alert(`${item} is now offered`);
                          });
                    };
                    const declineButton = document.createElement('button');
                    declineButton.textContent = 'No';
                    declineButton.onclick = function() {
                        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/wishlist/decline', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ hobbyName: item })
                        }).then(() => {
                            loadSupplierWishlist();
                        });
                    };
                    li.appendChild(acceptButton);
                    li.appendChild(declineButton);
                    supplierWishlist.appendChild(li);
                });
            });
    }

    function displayNotification(message) {
        notificationElement.textContent = message;
        notificationElement.style.display = 'block';
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 5000); // Display for 5 seconds
    }

    document.getElementById('search-bar').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const hobbies = document.querySelectorAll('#hobby-list li a');
        hobbies.forEach(hobby => {
            const name = hobby.textContent.toLowerCase();
            hobby.parentElement.style.display = name.includes(query) ? '' : 'none';
        });
    });

    searchButton.addEventListener('click', searchHobbies);

    document.getElementById('hobby-list').addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const hobbyId = event.target.dataset.id;
            window.location.href = `hobby-details.html?id=${hobbyId}`;
        }
    });

    viewUserButton.addEventListener('click', function() {
        userView.style.display = 'block';
        supplierView.style.display = 'none';
        loadHobbies();
        loadTrendingHobbies();
        loadHiddenGems();
        fetchAndLoadWishlist();
    });

    viewSupplierButton.addEventListener('click', function() {
        userView.style.display = 'none';
        supplierView.style.display = 'block';
        loadSupplierHobbies();
        loadSupplierWishlist();
    });

    addHobbyButton.addEventListener('click', function() {
        addHobbyForm.style.display = 'block';
    });

    newHobbyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(newHobbyForm);
        const newHobby = {
            name: formatHobbyName(formData.get('name')),
            description: formData.get('description'),
            location: formData.get('location'),
            contact: formData.get('contact')
        };

        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newHobby)
        }).then(response => response.json())
          .then(data => {
              console.log('New hobby added:', data);
              newHobbyForm.reset();
              addHobbyForm.style.display = 'none';
              loadSupplierHobbies();
          });
    });

    function loadSupplierHobbies() {
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies')
            .then(response => response.json())
            .then(data => {
                const supplierHobbyList = document.getElementById('supplier-hobby-list');
                supplierHobbyList.innerHTML = '';
                data.forEach(hobby => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `supplier-hobby-details.html?id=${hobby.id}`;
                    a.textContent = hobby.name;
                    li.appendChild(a);
                    supplierHobbyList.appendChild(li);
                });
            });
    }

    function showSupplierHobbyDetails(hobbyId) {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`)
            .then(response => response.json())
            .then(hobbyInfo => {
                const hobbyDetailsElement = document.getElementById('hobby-details');
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
                document.getElementById('hobbies').style.display = 'none';
                hobbyDetailsElement.style.display = 'block';

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
                          hobbyDetailsElement.style.display = 'none';
                          loadSupplierHobbies();
                      });
                });
            });
    }

    document.getElementById('supplier-hobby-list').addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const hobbyId = event.target.dataset.id;
            showSupplierHobbyDetails(hobbyId);
        }
    });

    loadHobbies();
    loadTrendingHobbies();
    loadHiddenGems();
    fetchAndLoadWishlist();
});
