const coordinates = {
    "Surabaya": { x: -7.250445, y: 112.768845 },
    "Malang": { x: -7.966620, y: 112.632632 },
    "Probolinggo": { x: -7.754669, y: 113.215913 },
    "Tuban": { x: -6.967195, y: 112.038849 },
    "Madiun": { x: -7.631573, y: 111.529809 },
    "Sumenep": { x: -7.004613, y: 113.849285 },
};

// Fungsi untuk menghitung jarak antara dua kota
function distance(city1, city2) {
    const xDist = city1.x - city2.x;
    const yDist = city1.y - city2.y;
    return Math.sqrt(xDist * xDist + yDist * yDist);
}

// Fungsi untuk menghitung fitness dari solusi perjalanan
function performanceFunction(...indexes) {
    const cityNames = Object.keys(coordinates);
    let totalDistance = 0;
    let prevCity = coordinates[cityNames[indexes[0]]];

    for (let i = 1; i < indexes.length; i++) {
        const currentCity = coordinates[cityNames[indexes[i]]];
        totalDistance += distance(prevCity, currentCity);
        prevCity = currentCity;
    }
    totalDistance += distance(prevCity, coordinates[cityNames[indexes[0]]]);
    return -totalDistance;// **FITNESS mendekati 0 (BERARTI LEBIH BAIK)**
}

export { performanceFunction, coordinates };
