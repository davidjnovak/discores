const inputScores = document.getElementById('inputScores');
const addScores = document.getElementById('addScores');
const clearScores = document.getElementById('clearScores');
const tableBody = document.getElementById('tableBody');
const tableHead = document.getElementById('tableHead');

addScores.addEventListener('click', () => {
    const inputData = inputScores.value.trim();

    if (!inputData) {
        alert('Please enter your scores before addting.');
        return;
    }
    const newJsonData = convertToJSON(inputData);
    const currentJsonData = loadFromLocalStorage();
    const updatedJsonData = currentJsonData.concat(newJsonData);
    saveToLocalStorage(updatedJsonData);
    displayData(updatedJsonData);
});

clearScores.addEventListener('click', () => {
    inputScores.value = '';
    tableBody.innerHTML = '';
    localStorage.removeItem('discGolfScores');
});

function saveToLocalStorage(jsonData) {
    localStorage.setItem('discGolfScores', JSON.stringify(jsonData));
}

function loadFromLocalStorage() {
    const jsonData = localStorage.getItem('discGolfScores');
    return jsonData ? JSON.parse(jsonData) : [];
}

function createTableHeader() {
    const headerRow = document.createElement('tr');

    // Create an empty cell for the top-left corner
    headerRow.appendChild(document.createElement('th'));

    for (let i = 1; i <= 18; i++) {
        const holeCell = document.createElement('th');
        holeCell.innerText = i;
        holeCell.classList.add('hole-number');
        holeCell.addEventListener('click', () => {
            const average = calculateHoleAverage(i);
            alert(`Average score for hole ${i}: ${average.toFixed(2)}`);
        });
        headerRow.appendChild(holeCell);
    }

    tableHead.appendChild(headerRow);
}

function calculateHoleAverage(hole) {
    const jsonData = loadFromLocalStorage();
    let totalScore = 0;
    let count = 0;

    jsonData.forEach(score => {
        if (score[hole]) {
            totalScore += score[hole];
            count++;
        }
    });

    return count > 0 ? totalScore / count : 0;
}

function convertToJSON(inputData) {
    const lines = inputData.split('\n');
    const jsonData = [];

    let currentScore = {};
    for (const line of lines) {
        if (line.startsWith('Disk')) {
            continue;
        }

        if (line.includes('/')) {
            if (Object.keys(currentScore).length > 0) {
                jsonData.push(currentScore);
            }
            currentScore = { date: line };
        } else {
            const [hole, score] = line.split('.').map(s => s.trim());
            currentScore[hole] = parseInt(score);
        }
    }

    if (Object.keys(currentScore).length > 0) {
        jsonData.push(currentScore);
    }

    return jsonData;
}

function displayData(jsonData) {
    tableBody.innerHTML = '';

    jsonData.forEach(score => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.innerText = score.date;
        dateCell.classList.add('date');
        dateCell.addEventListener('click', () => {
            const scores = Object.entries(score)
                .filter(([key, value]) => key !== 'date')
                .map(([key, value]) => value);
        
            const totalScore = scores.reduce((a, b) => a + b, 0);
            const holesPlayed = scores.length;
            const finalScore = totalScore - (holesPlayed * 3);
        
            alert(`Total score for ${score.date}: ${finalScore}`);
        });
        row.appendChild(dateCell);

        for (let i = 1; i <= 18; i++) {
            const scoreCell = document.createElement('td');
            scoreCell.innerText = score[i] || '';
            row.appendChild(scoreCell);
        }

        tableBody.appendChild(row);
    });
}

// Create table header and load data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createTableHeader();
    const jsonData = loadFromLocalStorage();
    displayData(jsonData);
});