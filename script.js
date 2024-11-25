// script.js

// Data
let places = [
    {
        id: 1,
        name: 'Central Library',
        description: 'A quiet place with a vast collection of books.',
        location: 'North Campus',
        noiseLevel: 'Quiet',
        crowdedness: 'Medium',
        proximityToFood: 'Far',
        indoorOutdoor: 'Indoor',
        reviews: [],
        rating: 0
    },
    {
        id: 2,
        name: 'Campus Cafe',
        description: 'A cozy cafe with coffee and snacks.',
        location: 'South Campus',
        noiseLevel: 'Loud',
        crowdedness: 'High',
        proximityToFood: 'Close',
        indoorOutdoor: 'Indoor',
        reviews: [],
        rating: 0
    },
    {
        id: 3,
        name: 'Botanical Garden',
        description: 'An outdoor area surrounded by nature.',
        location: 'East Campus',
        noiseLevel: 'Quiet',
        crowdedness: 'Low',
        proximityToFood: 'Medium',
        indoorOutdoor: 'Outdoor',
        reviews: [],
        rating: 0
    }
];

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let visited = JSON.parse(localStorage.getItem('visited')) || [];

function saveData() {
    localStorage.setItem('places', JSON.stringify(places));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('visited', JSON.stringify(visited));
}

function loadData() {
    let storedPlaces = JSON.parse(localStorage.getItem('places'));
    if (storedPlaces) {
        places = storedPlaces;
    }
}

function showPage(page) {
    let content = document.getElementById('content');
    content.innerHTML = '';
    if (page === 'home') {
        showHomePage();
    } else if (page === 'favorites') {
        showFavoritesPage();
    } else if (page === 'visited') {
        showVisitedPage();
    } else if (page === 'addPlace') {
        showAddPlacePage();
    }
}

function showHomePage() {
    let content = document.getElementById('content');
    let searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search by name or location">
        <select id="filterNoise">
            <option value="">Noise Level</option>
            <option value="Quiet">Quiet</option>
            <option value="Medium">Medium</option>
            <option value="Loud">Loud</option>
        </select>
        <select id="filterCrowdedness">
            <option value="">Crowdedness</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>
        <button class="btn" onclick="applyFilters()">Search</button>
    `;
    content.appendChild(searchBar);
    displayPlaces(places);
}

function displayPlaces(placeList) {
    let content = document.getElementById('content');
    placeList.forEach(place => {
        let card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.description}</p>
        `;
        // Favorite Button
        let favBtn = document.createElement('button');
        favBtn.className = 'icon-btn favorite-btn';
        favBtn.innerHTML = favorites.includes(place.id) ? '❤' : '♡';
        favBtn.onclick = () => toggleFavorite(place.id);
        card.appendChild(favBtn);

        // Visited Button
        let visitBtn = document.createElement('button');
        visitBtn.className = 'icon-btn visited-btn';
        visitBtn.innerHTML = visited.includes(place.id) ? '✓' : '✗';
        visitBtn.onclick = () => toggleVisited(place.id);
        card.appendChild(visitBtn);

        // View Details Button
        let detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn';
        detailsBtn.textContent = 'View Details';
        detailsBtn.onclick = () => viewPlace(place.id);
        card.appendChild(detailsBtn);

        content.appendChild(card);
    });
}

function viewPlace(id) {
    let place = places.find(p => p.id === id);
    let content = document.getElementById('content');
    content.innerHTML = '';
    let card = document.createElement('div');
    card.className = 'place-card';
    card.innerHTML = `
        <h2>${place.name}</h2>
        <p>${place.description}</p>
        <p><strong>Location:</strong> ${place.location}</p>
        <p><strong>Noise Level:</strong> ${place.noiseLevel}</p>
        <p><strong>Crowdedness:</strong> ${place.crowdedness}</p>
        <p><strong>Proximity to Food:</strong> ${place.proximityToFood}</p>
        <p><strong>Type:</strong> ${place.indoorOutdoor}</p>
        <button class="btn" onclick="toggleFavorite(${place.id})">${favorites.includes(place.id) ? 'Unfavorite' : 'Add to Favorites'}</button>
        <button class="btn" onclick="toggleVisited(${place.id})">${visited.includes(place.id) ? 'Unmark Visited' : 'Mark as Visited'}</button>
        <h3>Reviews</h3>
        <div id="reviews">
            ${place.reviews.map(review => `<p>${review}</p>`).join('')}
        </div>
        <textarea id="reviewText" placeholder="Add a review"></textarea>
        <button class="btn" onclick="addReview(${place.id})">Submit Review</button>
    `;
    content.appendChild(card);
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fid => fid !== id);
    } else {
        favorites.push(id);
    }
    saveData();
    showPage('home');
}

function toggleVisited(id) {
    if (visited.includes(id)) {
        visited = visited.filter(vid => vid !== id);
    } else {
        visited.push(id);
    }
    saveData();
    showPage('home');
}

function addReview(id) {
    let text = document.getElementById('reviewText').value;
    if (text) {
        let place = places.find(p => p.id === id);
        place.reviews.push(text);
        document.getElementById('reviewText').value = '';
        saveData();
        viewPlace(id);
    } else {
        alert('Please write a review');
    }
}

function showFavoritesPage() {
    let favPlaces = places.filter(place => favorites.includes(place.id));
    if (favPlaces.length === 0) {
        document.getElementById('content').innerHTML = '<p>No favorites yet.</p>';
    } else {
        displayPlaces(favPlaces);
    }
}

function showVisitedPage() {
    let visitedPlaces = places.filter(place => visited.includes(place.id));
    if (visitedPlaces.length === 0) {
        document.getElementById('content').innerHTML = '<p>No visited places yet.</p>';
    } else {
        displayPlaces(visitedPlaces);
    }
}

function applyFilters() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    let filterNoise = document.getElementById('filterNoise').value;
    let filterCrowdedness = document.getElementById('filterCrowdedness').value;

    let filteredPlaces = places.filter(place => {
        let match = true;
        if (searchInput && !place.name.toLowerCase().includes(searchInput) && !place.location.toLowerCase().includes(searchInput)) {
            match = false;
        }
        if (filterNoise && place.noiseLevel !== filterNoise) {
            match = false;
        }
        if (filterCrowdedness && place.crowdedness !== filterCrowdedness) {
            match = false;
        }
        return match;
    });
    document.getElementById('content').innerHTML = '';
    let searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search by name or location" value="${document.getElementById('searchInput').value}">
        <select id="filterNoise">
            <option value="">Noise Level</option>
            <option value="Quiet" ${filterNoise === 'Quiet' ? 'selected' : ''}>Quiet</option>
            <option value="Medium" ${filterNoise === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="Loud" ${filterNoise === 'Loud' ? 'selected' : ''}>Loud</option>
        </select>
        <select id="filterCrowdedness">
            <option value="">Crowdedness</option>
            <option value="Low" ${filterCrowdedness === 'Low' ? 'selected' : ''}>Low</option>
            <option value="Medium" ${filterCrowdedness === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="High" ${filterCrowdedness === 'High' ? 'selected' : ''}>High</option>
        </select>
        <button class="btn" onclick="applyFilters()">Search</button>
    `;
    document.getElementById('content').appendChild(searchBar);
    displayPlaces(filteredPlaces);
}

function showAddPlacePage() {
    let content = document.getElementById('content');
    content.innerHTML = `
        <h2>Add a New Study Place</h2>
        <div class="form-group">
            <input type="text" id="placeName" placeholder="Name">
        </div>
        <div class="form-group">
            <textarea id="placeDescription" placeholder="Description" rows="3"></textarea>
        </div>
        <div class="form-group">
            <input type="text" id="placeLocation" placeholder="Location">
        </div>
        <div class="form-group">
            <select id="placeNoiseLevel">
                <option value="">Noise Level</option>
                <option value="Quiet">Quiet</option>
                <option value="Medium">Medium</option>
                <option value="Loud">Loud</option>
            </select>
        </div>
        <div class="form-group">
            <select id="placeCrowdedness">
                <option value="">Crowdedness</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
        <div class="form-group">
            <select id="placeProximityToFood">
                <option value="">Proximity to Food</option>
                <option value="Close">Close</option>
                <option value="Medium">Medium</option>
                <option value="Far">Far</option>
            </select>
        </div>
        <div class="form-group">
            <select id="placeIndoorOutdoor">
                <option value="">Type</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
            </select>
        </div>
        <button class="btn" onclick="addNewPlace()">Add Place</button>
    `;
}

function addNewPlace() {
    let name = document.getElementById('placeName').value;
    let description = document.getElementById('placeDescription').value;
    let location = document.getElementById('placeLocation').value;
    let noiseLevel = document.getElementById('placeNoiseLevel').value;
    let crowdedness = document.getElementById('placeCrowdedness').value;
    let proximityToFood = document.getElementById('placeProximityToFood').value;
    let indoorOutdoor = document.getElementById('placeIndoorOutdoor').value;

    if (name && description && location && noiseLevel && crowdedness && proximityToFood && indoorOutdoor) {
        let newPlace = {
            id: places.length + 1,
            name,
            description,
            location,
            noiseLevel,
            crowdedness,
            proximityToFood,
            indoorOutdoor,
            reviews: [],
            rating: 0
        };
        places.push(newPlace);
        saveData();
        showPage('home'); // Redirect back to home page
    } else {
        alert('Please fill in all fields');
    }
}

// Initialize
loadData();
showHomePage();
