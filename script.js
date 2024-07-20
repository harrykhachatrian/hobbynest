document.addEventListener('DOMContentLoaded', function() {
    const userView = document.getElementById('user-view');
    const supplierView = document.getElementById('supplier-view');
    const viewUserButton = document.getElementById('view-user');
    const viewSupplierButton = document.getElementById('view-supplier');
    const addHobbyButton = document.getElementById('add-hobby-button');
    const addHobbyForm = document.getElementById('add-hobby-form');
    const newHobbyForm = document.getElementById('new-hobby-form');
    const searchButton = document.getElementById('search-button');

    let userId = 1; // Assuming a single user for simplicity. In a real app, manage user sessions.

    // Fetch and display hobbies for user view
    function loadHobbies() {
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies')
            .then(response => response.json())
            .then(data => {
                const hobbyList = document.getElementById('hobby-list');
                hobbyList.innerHTML = '';
                data.forEach(hobby => {
                    const li = document.createElement('li');
                    li.textContent = hobby.name;
                    li.dataset.id = hobby.id;
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
                    li.textContent = hobby.name;
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
                    li.textContent = hobby.name;
                    hiddenGemsList.appendChild(li);
                });
            });
    }

    // Fetch hobby details and track exploration
    function showHobbyDetails(hobbyId) {
        fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/${hobbyId}`)
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
                
                // Track hobby exploration
                fetch(`https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/users/${userId}/explore`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hobbyId })
                });
            });
    }

    function handleSearch() {
        const query = document.getElementById('search-bar').value.toLowerCase();
        fetch('https://hobbynest-backend-8fa9b1d265bc.herokuapp.com/hobbies/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: query })
        })
        .then(response => response.json())
        .then(hobby => {
            showHobbyDetails(hobby.id);
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

    searchButton.addEventListener('click', handleSearch);

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
    });

    addHobbyButton.addEventListener('click', function() {
        addHobbyForm.style.display = 'block';
    });

    newHobbyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(newHobbyForm);
        const newHobby = {
            name: formData.get('name'),
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
                    li.textContent = `${hobby.name} - ${hobby.description}`;
                    supplierHobbyList.appendChild(li);
                });
            });
    }

    loadHobbies();
    loadTrendingHobbies();
    loadHiddenGems();
    fetchAndLoadWishlist();
});
