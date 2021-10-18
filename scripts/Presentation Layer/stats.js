let am = new AccountManager(localStorage);
const speed = 200;

let numberOfSingals;
let numberOfTeams;
let numberOfFires;
let numberOfFloods;
let numberOfRescues;
let numberOfFreeCars;
let numberOfCars;
let coordinatesX;
let coordinatesY;

window.onload = () => {
    getNumbers();

    updateCounter("numberOfSignals", numberOfSingals);
    updateCounter("numberOfTeams", numberOfTeams);
    updateCounter("numberOfFires", numberOfFires);
    updateCounter("numberOfFloods", numberOfFloods);
    updateCounter("numberOfRescues", numberOfRescues);
    updateCounter("numberOfFreeCars", numberOfFreeCars);
    updateCounter("numberOfCars", numberOfCars);


    if (coordinatesX && coordinatesY && !am.isArrayEmpty(coordinatesX) && !am.isArrayEmpty(coordinatesY)) {
        initMap(coordinatesX, coordinatesY, "map");
    } else {
        document.getElementById("map").style.display = "none";
        document.getElementById("popup").style.display = "none";
    }
};

/**
 * Function that get stats
 * for stats page
 */
function getNumbers() {
    numberOfSingals = am.getNumberOfSignals() ?? 0;
    numberOfTeams = JSON.parse(localStorage.signals).filter(signal => signal.type == "Earth").length ?? 0;
    numberOfFires = JSON.parse(localStorage.signals).filter(signal => signal.type == "Trash").length ?? 0;
    numberOfFloods = JSON.parse(localStorage.signals).filter(signal => signal.type == "Water").length ?? 0;
    numberOfRescues = JSON.parse(localStorage.signals).filter(signal => signal.type == "Another").length ?? 0;
    numberOfFreeCars = JSON.parse(localStorage.users).filter(user => user.role == 1).filter(vol => vol.signal == null).length ?? 0;
    numberOfCars = JSON.parse(localStorage.users).filter(user => user.role == 1).length  ?? 0;

    if (numberOfSingals != 0) {
        let signals = am.getAcceptedSignals();
        
        coordinatesX = [];
        coordinatesY = [];

        for (const signal of signals) {
            coordinatesX.push(signal.coordinatesX);
            coordinatesY.push(signal.coordinatesY);
        }
    }
}

/**
 * Function that create animation
 * for counting word
 * @param {number} counterId The id of the html p element
 * @param {number} target The target number
 */
function updateCounter(counterId, target) {
    let element = document.getElementById(counterId);
    target = Number(target);
    let count = +element.innerText;
    let inc = target / speed;

    if (count < target) {
        element.innerText = Math.ceil(count + inc);
        setTimeout(updateCounter, 100, counterId, target);
    } else {
        element.innerText = target;
    }
}

/**
 * Function that initialise map
 * based on openLayer API.
 * @param {string} coordinatesXs The longitude coordinate
 * @param {string} coordinatesYs The latitude coordinate
 * @param {number} id Id of the html div element
 */
function initMap(coordinatesXs, coordinatesYs, id) {
    document.getElementById(id).innerHTML = "";

    let map = new ol.Map({
        target: id,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([27.461014, 42.510578]),
            zoom: 12
        })
    });

    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');

    for (let i = 0; i < coordinatesXs.length; i++) {
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point([coordinatesXs[i], coordinatesYs[i]])
                    })
                ]
            }),
            name: 'Marker'
        });

        map.addLayer(layer)
    }

    let overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    map.addOverlay(overlay);

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map.on('singleclick', function (event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) {
            var coordinate = event.coordinate;

            content.innerHTML = '<b>Active signal</b>';
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });

    setTimeout(function () { map.updateSize(); }, 200);
}