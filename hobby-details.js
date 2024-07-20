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
                <h3>${hobbyInfo.name}</h3>
                <p>${hobbyInfo.description}</p>
                <p>Location: ${hobbyInfo.location}</p>
                <p>Contact: ${hobbyInfo.contact}</p>
                <h4>Available Dates and Times</h4>
                <ul>
                    ${hobbyInfo.dates.map(dateInfo => `
                        <li>${dateInfo.date}: ${dateInfo.times.join(', ')}</li>
                    `).join('')}
                </ul>
            `;
        });
});
