let am = new AccountManager(localStorage);
let activeUser = am.getActiveUser();
let carSel = document.getElementById("car");
let sigSel = document.getElementById("signals");
let sigPendingSel = document.getElementById("signalsPending");
let sigAccSel = document.getElementById("signalsAccepted");
let sigClosedSel = document.getElementById("signalsClosed");
let teamSel = document.getElementById("volunteers");
let teamPenSel = document.getElementById("volunteersPendingSignal");
let teamSigSel = document.getElementById("signalTeam");

window.onload = () => {
    let isEnter = (am.checkForEnterUser() == 'true');
    let ranks = ["Djena(Script)", "Ivana", "Vanya Velikova"]
    let role = activeUser.role;
    let achievements = activeUser.achievements;


    if (isEnter) {
        if (activeUser.achievements.length == 0) {
            activeUser.rank = "Citizen";
        } else if (achievements.length >= 1 && achievements.length <= 4) {
            activeUser.rank = "Exemplary citizen";
        } else if (achievements.length >= 5 && achievements.length <= 8) {
            activeUser.rank = "Ecologist";
        } else if (achievements.length >= 9 && achievements.length <= 12) {
            activeUser.rank = "Mega ecologist";
        } else if (achievements.length >= 13 && achievements.length <= 16) {
            activeUser.rank = "Super ecologist";
        } else if (achievements.length >= 17 && achievements.length <= 19) {
            activeUser.rank = "Super ecologist with cheese";
        } else if (achievements.length == 20) {
            activeUser.rank =  ranks[Math.floor(Math.random()*ranks.length)];
        }

        if (activeUser.role == 3) {
            activeUser.rank = "Admin";
        }
        
        for (let index = 0; index < achievements.length; index++) {
            switch (achievements[index]) {
                case 1:
                    achievements[index] = "Meet Pepper";
                    break;
                case 2:
                    achievements[index] = "Pick Up That Can";
                    break;
                case 3:
                    achievements[index] = "That was close";
                    break;
                case 4:
                    achievements[index] = "Went for a walk";
                    break;
                case 5:
                    achievements[index] = "Super Monitoring";
                    break;
                case 6:
                    achievements[index] = "Time Traveller";
                    break;
                case 7:
                    achievements[index] = "Recycleman";
                    break;
                case 8:
                    achievements[index] = "What are you doing?";
                    break;
                case 9:
                    achievements[index] = "Sweet Dreams";
                    break;
                case 10:
                    achievements[index] = "When you just can't fix a bug";
                    break;
                case 11:
                    achievements[index] = "The Start";
                    break;
                case 12:
                    achievements[index] = "The Push";
                    break;
                case 13:
                    achievements[index] = "On a long adventure";
                    break;
                case 14:
                    achievements[index] = "What a great video";
                    break;
                case 15:
                    achievements[index] = "What is this?";
                    break;
                case 16:
                    achievements[index] = "The Secret Class";
                    break;
                case 17:
                    achievements[index] = "Merry Christmas (Every day can be christmas)";
                    break;
                case 18:
                    achievements[index] = "Deja Vu";
                    break;
                case 19:
                    achievements[index] = "Coffee is the best served bitter and strong";
                    break;
                case 20:
                    achievements[index] = "The truth about Kondoriano";
                    break;
                default:
                    break;
            }
        }
        document.getElementById("fname").innerHTML = "First Name: " + activeUser.fname;
        document.getElementById("lname").innerHTML = "Last Name: " + activeUser.lname;
        document.getElementById("rank").innerHTML = "Rank: " + activeUser.rank;
        document.getElementById("achievements").innerHTML = "Achievements: " + achievements.join(", ");

        switch (Number(role)) {
            case 0:
                role = "User";
                break;
            case 1:
                role = "Volunteer";
                break;
            case 2:

                role = "Dispatcher";
                break;
            case 3:
                role = "Admin";
                break;
        }

        document.getElementById("role").innerHTML = "Role: " + role;
        document.getElementById("region").innerHTML = "Region: " + activeUser.region;

        //If user is firefighter
        if (activeUser.role == 1) {
            initFirefighter();
            document.getElementById("firefighterTeamManagment").style.display = "block";
        } else {
            document.getElementById("firefighterTeamManagment").style.display = "none";
        }

        //If user is dispatcher
        if (activeUser.role == 2) {
            document.getElementById("signalDiv").style.display = "block";
            document.getElementById("dispatcherTabs").style.display = "block";

            getNames();
            initMapForSignal();

            if (am.getSignals() != null) {
                forEachOption(sigSel, am.getSignalsWithoutVolunteerSelected(), "Изберете сигнал");
                forEachOption(sigPendingSel, am.getSignalsWithVolunteerSelected(), "Изберете сигнал");
                forEachOption(sigAccSel, am.getAcceptedSignals(), "Изберете сигнал");
                forEachOption(sigClosedSel, am.getClosedSignals(), "Изберете сигнал");
            }

            reloadSel();

            let ids = ["displaySignal", "displayPendingSignal", "displayAcceptedSignal", "displayClosedSignal"];

            for (const id of ids) {
                document.getElementById(id).style.display = "none";
            }
        } else {
            document.getElementById("signalDiv").style.display = "none";
            document.getElementById("sendSignalDiv").style.display = "none";
            document.getElementById("dispatcherTabs").style.display = "none";
        }

        let ids = ["registerEmployee", "adminTabs"];

        //If user is admin
        if (activeUser.role == 3) {
            document.getElementById("deleteAll").style.display = "inline";
            document.getElementById("deleteAcc").style.display = "none";

            for (const id of ids) {
                document.getElementById(id).style.display = "block";
            }
            
            //document.getElementById("registerCar").parentElement.classList.add("is-hidden");
            //document.getElementById("registerTeam").parentElement.classList.add("is-hidden");
            //forEachCar(carSel);
        } else {
            document.getElementById("deleteAll").style.display = "none";
            document.getElementById("deleteAcc").style.display = "inline";
            for (const id of ids) {
                document.getElementById(id).style.display = "none";
            }
        }
    } else {
        window.location.href = "../index.html";
    }

    // Initialize all input of type date
    var calendars = bulmaCalendar.attach('[type="date"]', {
        dateFormat: 'DD/MM/YYYY',
        lang: 'bg',
        minDate: new Date(),
        weekStart: 1
    })
}

/**
 * Function that initalise firefighter systems
 */
function initFirefighter() {
    if (am.getUserWithId(activeUser.id).signal != null) {
        signal = am.getSignalsWithId(am.getUserWithId(activeUser.id).signal)
        document.getElementById("signalP").innerHTML = "Сигнал: " + signal.id;
        document.getElementById("signalNameP").innerHTML = "Заглавие: " + signal.title;
        document.getElementById("signalTypeP").innerHTML = "Тип: " + signal.type;
        document.getElementById("signalDesP").innerHTML = "Описание: " + signal.description;
        initMap(signal.coordinatesX, signal.coordinatesY, "fireMapSignal");

        if (signal.isClosed) {
            document.getElementById("startWorkingButton").style.display = "none";
            document.getElementById("endWorkingButton").style.display = "none";
        } else {
            if (signal.start == null) {
                document.getElementById("startWorkingButton").style.display = "block";
                document.getElementById("endWorkingButton").style.display = "none";
            } else {
                document.getElementById("startWorkingButton").style.display = "none";
                document.getElementById("endWorkingButton").style.display = "block";
            }
        }
    } else {
        document.getElementById("signalP").innerHTML = "Сигнал: няма";
        document.getElementById("signalWorkButtons").style.display = "none";
        document.getElementById("fireMapSignal").classList.remove('map');
    }
}

/* Old feature
/**
 * Loads cars in the selected elemend
 * @param {DOMElement} selectElement
 
function forEachCar(selectElement) {
    let cars = am.getCars();

    for (i = selectElement.length - 1; i >= 0; i--) {
        selectElement.remove(i);
    }

    selectElement.options[0] = new Option("Изберете кола", "");

    if (cars != null) {
        cars.forEach(element => {
            if (element.inTeam == false) {
                selectElement.options[selectElement.options.length] = new Option(element.model + " " + element.registrationPlate, element.numberOfSeats + " " + element.id);
            }
        });
    }
}*/

/**
 * Loads what function gives
 * in the selected elemend
 * @param {DOMElement} optionSelect 
 * @param {func} func 
 * @param {string} firstOption First option in the select element
 */
function forEachOption(optionSelect, func, firstOption) {
    let options = func;

    for (i = optionSelect.length - 1; i >= 0; i--) {
        optionSelect.remove(i);
    }

    optionSelect.options[0] = new Option(firstOption, "");

    if (options != null) {
        options.forEach(element => {
            if (element.fname == null) {
                optionSelect.options[optionSelect.options.length] = new Option(element.title ?? element.id, element.id);
            } else {
                optionSelect.options[optionSelect.options.length] = new Option(element.fname + " " + element.lname, element.id);
            }
        });
    }
}

/**
 * Function to get the names
 * of the user, which is entered
 */
function getNames() {
    document.getElementById("Signalnames").value = activeUser.fname + " " + activeUser.lname;
}

/**
 * initalise a map for the signal form
 */
function initMapForSignal() {
    document.getElementById("mapSignal").innerHTML = "";

    let map = new ol.Map({
        target: 'mapSignal',
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

    setTimeout(function () { map.updateSize(); }, 200);

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
}

/**
 * Intialise a map into div element
 * @param {string} coordinatesX Longitude
 * @param {string} coordinatesY Latitude
 * @param {string} id Id of the element
 */
function initMap(coordinatesX, coordinatesY, id) {
    document.getElementById(id).innerHTML = "";
    let map = new ol.Map({
        target: id,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point([coordinatesX, coordinatesY])
                        })
                    ]
                }),
                name: 'Marker'
            })
        ],
        view: new ol.View({
            center: [coordinatesX, coordinatesY],
            zoom: 12
        })
    });

    setTimeout(function () { map.updateSize(); }, 200);
}

/**
 * Place firefighter to chose from
 */
function updateCarSel() {
    let form = document.forms.registerTeam;
    let parentDiv = document.getElementById("teamMembers");
    parentDiv.innerHTML = ""
    let firefightersArray = am.getFirefighters();

    for (let i = 1; i <= form.elements.car.value.split(" ")[0]; i++) {
        let newSelect = document.createElement("Select");
        let newLabel = document.createElement("Label");
        let controlDiv = document.createElement("div");
        let selectDiv = document.createElement("div");

        newSelect.setAttribute("name", i);
        newSelect.setAttribute("id", i);
        newLabel.setAttribute("for", i);
        newLabel.classList.add("label");
        controlDiv.classList.add("control");
        selectDiv.classList.add("select")

        newLabel.innerHTML = "Пожарникар " + i + ":";

        parentDiv.appendChild(newLabel);
        parentDiv.appendChild(controlDiv);
        controlDiv.appendChild(selectDiv);
        selectDiv.appendChild(newSelect);

        newSelect.options[0] = new Option("Изберете пожарникар", "");

        parentDiv.appendChild(document.createElement("br"));

        if (firefightersArray == 0) {
            continue;
        }

        for (const firefighter of firefightersArray) {
            if (firefighter.team == null) {
                newSelect.options[newSelect.options.length] = new Option(firefighter.fname + " " + firefighter.lname + " " + firefighter.email, firefighter.id);
            }
        }
    }
}

/**
 * Hide/Unhide element
 * @param {DOM} parentDiv The element
 * @param {string} id 
 */
function chengeParentDivDisplay(parentDiv, id) {
    if (id == "") {
        parentDiv.style.display = "none";
    } else {
        parentDiv.style.display = "block";
    }
}

//carSel.onchange = updateCarSel;

/**
 * Arrow function that loads select element
 */
sigSel.onchange = () => {
    let id = document.forms.signalForm.elements.signals.value;
    let parentDiv = document.getElementById("displaySignal");
    let titleP = document.getElementById("title");
    let namesP = document.getElementById("names");
    let typeP = document.getElementById("type");
    let desP = document.getElementById("des");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "map");
    }

    chengeParentDivDisplay(parentDiv, id);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
    }
}

/**
 * Arrow function that loads select element
 */
sigPendingSel.onchange = () => {
    let id = document.forms.signalPendingForm.elements.signalsPending.value;
    let parentDiv = document.getElementById("displayPendingSignal");
    let titleP = document.getElementById("titlePendingSignal");
    let teamP = document.getElementById("teamPendingSignal");
    let namesP = document.getElementById("namesPendingSignal");
    let typeP = document.getElementById("typePendingSignal");
    let desP = document.getElementById("desPendingSignals");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "mapPendingSignal");
    }

    chengeParentDivDisplay(parentDiv, id);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        teamP.innerHTML = "Отбор: " + signal.team;
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
    }
}

/**
 * Arrow function that loads select element
 */
sigAccSel.onchange = () => {
    let id = document.forms.signalAcceptedForm.elements.signals.value;

    let parentDiv = document.getElementById("displayAcceptedSignal");
    let titleP = document.getElementById("titleAcceptedSignal");
    let teamP = document.getElementById("teamAcceptedSignal");
    let namesP = document.getElementById("namesAcceptedSignal");
    let typeP = document.getElementById("typeAcceptedSignal");
    let desP = document.getElementById("desAcceptedSignals");
    let startP = document.getElementById("startOfWorkingAccSig");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "mapAcceptedSignal");
    }

    chengeParentDivDisplay(parentDiv, id);

    let startDate = new Date(signal.start);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        //teamP.innerHTML = "Отбор: " + signal.team;
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
        startP.innerHTML = "Начало на работа по сигнала: " + startDate.getHours() + ":" + startDate.getMinutes();
    }
}

/**
 * Arrow function that loads select element
 */
sigClosedSel.onchange = () => {
    let id = document.forms.signalClosedForm.elements.signals.value;

    let parentDiv = document.getElementById("displayClosedSignal");
    let titleP = document.getElementById("titleClosedP");
    let namesP = document.getElementById("namesClosedP");
    let typeP = document.getElementById("typeClosedP");
    let desP = document.getElementById("desClosedP");
    let startP = document.getElementById("startOfWorkingClosedP");
    let endP = document.getElementById("endOfWorkingClosedP");
    let timeP = document.getElementById("timeTakenP");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "mapClosedMap");
    }

    chengeParentDivDisplay(parentDiv, id);

    let startDate = new Date(signal.start);
    let endDate = new Date(signal.end);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
        startP.innerHTML = "Начало на работа по сигнала: " + startDate.getHours() + ":" + startDate.getMinutes();
        endP.innerHTML = "Край на работа по сигнала: " + endDate.getHours() + ":" + endDate.getMinutes();
        timeP.innerHTML = "Времетраене: " + signal.timeToComplete;
    }
}

/**
 * reload select elements
 */
function reloadSel() {
    let sels = [teamSel, teamPenSel, teamSigSel];
    
    for (const sel of sels) {
        forEachOption(sel, am.getVolunteersForSignals(), "Chose volunteers");
    }
}

/**
 * reload select elements
 */
function reloadSigSel() {
    if (am.getSignals() != null) {
        forEachOption(sigSel, am.getSignalsWithoutVolunteerSelected(), "Изберете сигнал");
        forEachOption(sigPendingSel, am.getSignalsWithVolunteerSelected(), "Изберете сигнал");
    }
}

/**
 * Process the input from forms and send it to the backend
 * @param {number} input 
 * @param {number} form 
 */
function getInput(input, form = null) {
    switch (input) {
        case 1:
            am.logOut();
            window.location.href = "../index.html";
            break;
        case 2:
            am.deleteAccount();
            window.location.href = "../index.html";
            break;
        case 3:
            am.deleteAllAccount();
            window.location.href = "../index.html";
            break;
        case 4:
            let employeeForm = document.forms.registerEmployee;

            let employeeOutput = am.registerUser(
                am.escapeHtml(employeeForm.elements.fname.value),
                am.escapeHtml(employeeForm.elements.lname.value),
                am.escapeHtml(employeeForm.elements.email.value),
                am.escapeHtml(employeeForm.elements.pass.value),
                2,
                "Burgas"
            );

            let employeeError = document.getElementById("employeeError");

            switch (employeeOutput) {
                case 0:
                    //updateCarSel();
                    employeeError.innerHTML = "Работникът е регестриран успешно!";
                    break;
                case 1:
                    employeeError.innerHTML = "Първото име трябва да започва с главна буква!";
                    break;
                case 2:
                    employeeError.innerHTML = "Фамилното име трябва да започва с главна буква!";
                    break;
                case 3:
                    employeeError.innerHTML = "Паролата трябва да е най-малко 8 символа!";
                    break;
                case 4:
                    employeeError.innerHTML = "Вече има регестриран потребител с такъв e-mail!";
                    break;
                case 5:
                    employeeError.innerHTML = "Въведеният e-mail е невалиден!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 5:
            let carForm = document.forms.registerCar;

            let carOutput = am.registerCar(
                am.escapeHtml(carForm.elements.model.value),
                am.escapeHtml(carForm.elements.registration.value),
                am.escapeHtml(carForm.elements.seats.value),
                "Бургас"
            );

            let carError = document.getElementById("carError");

            switch (carOutput) {
                case 0:
                    forEachCar(carSel);
                    carError.innerHTML = "Колата е регестрирана успешно!";
                    break;
                case 1:
                    carError.innerHTML = "Броят на местата трябва да е по-голям от 0!";
                    break;
                case 2:
                    carError.innerHTML = "Вече има кола регестрирана с този регистрационен номер!";
                    break;
                case 3:
                    carError.innerHTML = "Моля посочете модел!";
                    break;
                case 4:
                    carError.innerHTML = "Моля посочете регистрационен номер!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 6: {
            let teamForm = document.forms.registerTeam;
            let checkboxes = document.querySelectorAll(`input[name=days]:checked`);
            let firefightersArray = [];
            let shifts = [];

            for (let i = 1; i <= teamForm.elements.car.value.split(" ")[0]; i++) {
                if (teamForm.elements[i].value != "") {
                    firefightersArray.push(teamForm.elements[i].value);
                }
            }

            checkboxes.forEach((elements) => {
                shifts.push(elements.value);
            });

            let teamOutput = am.registerTeam(
                firefightersArray,
                am.escapeHtml(teamForm.elements.car.value.split(" ")[1]),
                am.escapeHtml(teamForm.elements.startTime.value),
                am.escapeHtml(teamForm.elements.endTime.value),
                shifts,
                am.escapeHtml(teamForm.elements.holiday.value),
                am.escapeHtml(teamForm.elements.sick.value),
                am.escapeHtml(teamForm.elements.trip.value)
            );

            let teamError = document.getElementById("teamError");

            switch (teamOutput) {
                case 0:
                    forEachCar(carSel);
                    updateCarSel();
                    teamError.innerHTML = "Отборът е регестриран успешно!";
                    break;
                case 1:
                    teamError.innerHTML = "Има работник с повече от една позиция!";
                    break;
                case 2:
                    teamError.innerHTML = "Трябва да изберете поне един пожарникар!";
                    break;
                case 3:
                    teamError.innerHTML = "Трябва да изберете кола за екипа!";
                    break;
                case 4:
                    teamError.innerHTML = "Трябва да изберете час за начало на смяната!";
                    break;
                case 5:
                    teamError.innerHTML = "Трябва да изберете час за край на смяната!!";
                    break;
                case 6:
                    teamError.innerHTML = "Трябва да изберете дни, през които отбора ще е на работа!";
                    break;
                case 7:
                    teamError.innerHTML = "Трябва да изберете дни за отпуска!";
                    break;
                case 8:
                    teamError.innerHTML = "Трябва да изберете дни за болнични!";
                    break;
                case 9:
                    teamError.innerHTML = "Трябва да изберете дни за командировка!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        }
        case 7:
            let signalForm;
            if (form == 1) {
                signalForm = document.forms.signalForm;
            } else if (form == 2) {
                signalForm = document.forms.signalPendingForm
            }

            let signalOutput1 = am.assignVolunteerForSignal(
                am.escapeHtml(signalForm.elements.signals.value),
                am.escapeHtml(signalForm.elements.volunteers.value)
            )

            switch (signalOutput1) {
                case 0:
                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    reloadSigSel()
                    reloadSel();

                    break;
                case 1:
                    document.getElementById("signalError").innerHTML = "Няма избран сигнал!";
                    document.getElementById("signalPendingError").innerHTML = "Няма избран сигнал!";
                    break;
                case 2:
                    document.getElementById("signalError").innerHTML = "Няма избран отбор!";
                    document.getElementById("signalPendingError").innerHTML = "Няма избран отбор!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        case 8:
            let signalForm2;
            if (form == 1) {
                signalForm2 = document.forms.signalForm;
            } else if (form == 2) {
                signalForm2 = document.forms.signalPendingForm
            }

            let signalOutput2 = am.deleteSignal(signalForm2.elements.signals.value);

            switch (signalOutput2) {
                case 0:
                    reloadSigSel();

                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    reloadSel();

                    break;
                case 1:
                    document.getElementById("signalError").innerHTML = "Няма избран сигнал!";
                    document.getElementById("signalPendingError").innerHTML = "Няма избран сигнал!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 11:
            let signalForm5 = document.forms.signalSubmitForm;

            let output = am.submitSignalForm(
                am.escapeHtml(signalForm5.elements.title.value),
                am.escapeHtml(signalForm5.elements.names.value),
                am.escapeHtml(signalForm5.elements.type.value),
                coordinatesX,
                coordinatesY,
                am.escapeHtml(signalForm5.elements.des.value),
                am.escapeHtml(signalForm5.elements.teams.value)
            );

            let error = document.getElementById("error");

            switch (output) {
                case 0:
                    reloadSigSel();

                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    reloadSel();

                    getNames();
                    error.innerHTML = "Сигналът е изпратен!";
                    break;
                case 1:
                    error.innerHTML = "Сигналът трябва да има име!";
                    break;
                case 2:
                    error.innerHTML = "Моля, попълнете вашите имена!";
                    break;
                case 3:
                    error.innerHTML = "Сигналът трябва да има тип!";
                    break;
                case 4:
                    error.innerHTML = "Моля, изберете адрес от картата!";
                    break;
                case 5:
                    error.innerHTML = "Сигналът трябва да има описание!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        case 12:
            let signal = am.getSignalsWithId(am.getUserWithId(activeUser.id).signal)

            if (signal.start == null) {
                if (confirm("Наистина ли искате да започнете да работите?")) {
                    am.startWorking(signal.id);
                }
            } else {
                if (confirm("Наистина ли искат да спрете да работите?")) {
                    am.endWorking(signal.id);
                }
            }
            location.reload();

            break;
        default:
            console.log("A wild error appeared");
            break;
    }
}