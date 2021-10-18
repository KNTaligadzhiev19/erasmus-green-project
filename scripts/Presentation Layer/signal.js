var coordinatesX = null;
var coordinatesY = null;

/**
 * Function to get the names
 * of the user, which is entered
 */
function getNames() {
    let am = new AccountManager(localStorage);
    let isTrue = (am.checkForEnterUser() == 'true');

    if (isTrue) {
        document.getElementById("names").value = JSON.parse(localStorage.getItem("activeUser")).fname + " " + JSON.parse(localStorage.getItem("activeUser")).lname;
    }
}

window.onload = () => {
    getNames();

    var map = new ol.Map({
        target: 'map',
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

    map.on('click', (m) => {
        map.getLayers().getArray()
            .filter(layer => layer.get('name') === 'Marker')
            .forEach(layer => map.removeLayer(layer));

        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point([m.coordinate[0], m.coordinate[1]])
                    })
                ]
            }),
            name: 'Marker'
        });
        map.addLayer(layer);

        coordinatesX = m.coordinate[0];
        coordinatesY = m.coordinate[1];
    });
};

/**
 * Function that gets the input 
 * and send it to the backend.
 * @function getInputSignal
 */
function getInput() {
    let form = document.forms.signalForm;

    let am = new AccountManager(localStorage)

    let output = am.submitSignalForm(
        am.escapeHtml(form.elements.title.value),
        am.escapeHtml(form.elements.names.value),
        am.escapeHtml(form.elements.type.value),
        coordinatesX,
        coordinatesY,
        am.escapeHtml(form.elements.des.value)
    );

    switch (output) {
        case 0:
            form.reset();
            getNames();
            document.getElementById("error").innerHTML = "The signal has been sent!";
            break;
        case 1:
            form.reset();
            getNames();
            document.getElementById("error").innerHTML = "The signal must have a name!";
            break;
        case 2:
            form.reset();
            getNames();
            document.getElementById("error").innerHTML = "Please fill in your names!";
            break;
        case 3:
            form.reset();
            getNames();
            document.getElementById("error").innerHTML = "The signal must have a selected problem!";
            break;
        case 4:
            form.reset();
            getNames();
            document.getElementById("error").innerHTML = "Please select an address from the map!";
            break;
        case 5:
            form.reset();
            getNames();
            document.getElementById("error").innerHTML = "The signal must have a description!";
            break;
        default:
            form.reset();
            getNames();
            console.log("A wild error appeared");
            break;
    }
}