// 10 возачи (декларирани со var)
var drivers = [
    {
        name: "Max Verstappen",
        team: "Red Bull",
        speed: 95,
        skill: 94,
        tires: "Soft",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Lando Norris",
        team: "McLaren",
        speed: 93,
        skill: 92,
        tires: "Soft",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Charles Leclerc",
        team: "Ferrari",
        speed: 92,
        skill: 93,
        tires: "Hard",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Lewis Hamilton",
        team: "Ferrari",
        speed: 90,
        skill: 94,
        tires: "Hard",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Oscar Piastri",
        team: "McLaren",
        speed: 91,
        skill: 91,
        tires: "Soft",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "George Russell",
        team: "Mercedes",
        speed: 89,
        skill: 90,
        tires: "Hard",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Fernando Alonso",
        team: "Aston Martin",
        speed: 87,
        skill: 93,
        tires: "Hard",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Carlos Sainz",
        team: "Williams",
        speed: 88,
        skill: 89,
        tires: "Hard",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Yuki Tsunoda",
        team: "RB",
        speed: 85,
        skill: 86,
        tires: "Soft",
        time: 0,
        status: "На старт",
        pitDone: false
    },
    {
        name: "Alexander Albon",
        team: "Williams",
        speed: 84,
        skill: 87,
        tires: "Soft",
        time: 0,
        status: "На старт",
        pitDone: false
    }
];

// Креирање копија од почетните возачи со обична for петња
var initialDrivers = new Array(drivers.length);
for (var i = 0; i < drivers.length; i++) {
    initialDrivers[i] = {
        name: drivers[i].name,
        team: drivers[i].team,
        speed: drivers[i].speed,
        skill: drivers[i].skill,
        tires: drivers[i].tires,
        time: drivers[i].time,
        status: drivers[i].status,
        pitDone: drivers[i].pitDone
    };
}

var raceInterval = null;
var raceHistory = [];

// Барање: 2 типа на гуми со различни перформанси
var tiresPerformance = {
    Soft: 1.08,
    Hard: 0.95
};

var driversBody = document.getElementById("drivers-body");
var currentLap = 0;

// Функција за прикажување и рангирање на возачите
function displayDrivers() {
    driversBody.innerHTML = "";

    var sortedDrivers = new Array(drivers.length);
    for (var i = 0; i < drivers.length; i++) {
        sortedDrivers[i] = drivers[i];
    }

    sortedDrivers.sort(function(a, b) {
        if (a.status === "Излезе од трката" && b.status !== "Излезе од трката") {
            return 1;
        }
        if (b.status === "Излезе од трката" && a.status !== "Излезе од трката") {
            return -1;
        }
        return a.time - b.time;
    });

    for (var i = 0; i < sortedDrivers.length; i++) {
        var driver = sortedDrivers[i];
        var row = document.createElement("tr");

        row.innerHTML = "<td>" + (i + 1) + "</td>" +
            "<td>" + driver.name + "</td>" +
            "<td>" + driver.team + "</td>" +
            "<td>" + driver.speed + "</td>" +
            "<td>" + driver.skill + "</td>" +
            "<td>" + driver.tires + "</td>" +
            "<td>" + driver.time.toFixed(2) + "</td>" +
            "<td>" + driver.status + "</td>";

        driversBody.appendChild(row);
    }
}

// Пресметување време за круг
function calculateLapTime(driver, safetyCarActive) {
    var tirePerformance = tiresPerformance[driver.tires];
    var baseTime = 100;
    var speedEffect = driver.speed * 0.2;
    var skillEffect = driver.skill * 0.1;
    var randomEffect = Math.random() * 2;

    var lapTime = (baseTime - speedEffect - skillEffect - randomEffect) / tirePerformance;
    
    // Ако е излезено безбедносно возило, времето се зголемува (се вози поспоро)
    if (safetyCarActive) {
        lapTime += 15;
    }

    return lapTime;
}

// Возење нормален круг
function driveLap(driver, safetyCarActive) {
    var lapTime = calculateLapTime(driver, safetyCarActive);
    driver.time += lapTime;
    driver.status = safetyCarActive ? "За безбедносно возило" : "Извозен круг";
    saveEvent(driver, safetyCarActive ? "Вози зад Безбедносно возило (Safety Car)" : "Нормално го заврши кругот");
}

// Зачувување на почетниот статус
function saveStartingGrid() {
    for (var i = 0; i < drivers.length; i++) {
        saveEvent(drivers[i], "На старт");
    }
}

var startButton = document.getElementById("start-race");
var currentLapElement = document.getElementById("current-lap");

// Функција за изведување на еден круг
function runLap() {
    currentLap++;
    currentLapElement.textContent = currentLap;

    // Шанса за излегување на безбедносно возило во овој круг (пр. 25 отсто шанса)
    var safetyCarActive = Math.random() < 0.25;

    if (safetyCarActive) {
        saveGlobalEvent("Излезе Безбедносно возило (Safety Car) на патеката!");
    }
     
    for (var i = 0; i < drivers.length; i++) {
        var driver = drivers[i];

        if (driver.status === "Излезе од трката") {
            continue;
        }

        // Шанса за испаѓање од трката
        if (Math.random() < 0.02) {
            retireDriver(driver);
        }
        // Шанса за извртување на патека
        else if (Math.random() < 0.04) {
            spinOut(driver);
        }
        // Барање: Мора барем еднаш да влезе во пит-стоп (на пр. во 5-ти круг)
        else if (currentLap === 5 && !driver.pitDone) {
            pitStop(driver);
        }
        // Стандардно возење на круг
        else {
            driveLap(driver, safetyCarActive);
        }
    }
    
    saveLapResults();
    displayDrivers();
    displayHistory();
    
    if (currentLap === 10) {
        startButton.disabled = true;
        showWinner();
    }
}

// Стартување на трката
function startRace() {
    currentLap = 0;
    currentLapElement.textContent = currentLap;
    startButton.disabled = true;

    runLap();

    raceInterval = setInterval(function() {
        if (currentLap >= 10) {
            clearInterval(raceInterval);
            raceInterval = null;
        } else {
            runLap();
        }
    }, 1000);
}

// Прикажување победник
function showWinner() {
    var resultsBody = document.getElementById("results-body");
    resultsBody.innerHTML = "";

    var finishedDrivers = [];
    var retiredDrivers = [];

    for (var i = 0; i < drivers.length; i++) {
        if (drivers[i].status !== "Излезе од трката") {
            finishedDrivers.push(drivers[i]);
        } else {
            retiredDrivers.push(drivers[i]);
        }
    }

    finishedDrivers.sort(function(a, b) {
        return a.time - b.time;
    });

    retiredDrivers.sort(function(a, b) {
        return a.time - b.time;
    });

    var finalResults = [];
    for (var i = 0; i < finishedDrivers.length; i++) {
        finalResults.push(finishedDrivers[i]);
    }
    for (var i = 0; i < retiredDrivers.length; i++) {
        finalResults.push(retiredDrivers[i]);
    }

    if (finishedDrivers.length > 0) {
        document.getElementById("winner-name").textContent = finishedDrivers[0].name;
    }
    else {
        document.getElementById("winner-name").textContent = "Нема победник";
    }

    for (var i = 0; i < finalResults.length; i++) {
        var driver = finalResults[i];
        var row = document.createElement("tr");
        var position = i + 1;

        row.innerHTML = "<td>" + position + "</td>" +
            "<td>" + driver.name + "</td>" +
            "<td>" + driver.team + "</td>" +
            "<td>" + driver.time.toFixed(2) + "</td>" +
            "<td>" + driver.status + "</td>";

        resultsBody.appendChild(row);
    }
}

startButton.addEventListener("click", startRace);

// Пит-стоп функција (промена на гуми меѓу 2 типа)
function pitStop(driver) {
    driver.time += 20; // Губење време во бокс

    if (driver.tires === "Soft") {
        driver.tires = "Hard";
    } else {
        driver.tires = "Soft";
    }

    driver.pitDone = true;
    driver.status = "Пит-стоп";
    saveEvent(driver, "Влезе во пит-стоп, смени гуми во " + driver.tires);
}

// Извртување на патеката
function spinOut(driver) {
    driver.time += 6;
    driver.status = "Извртување";
    saveEvent(driver, "Се изврте на патеката");
}

// Излегување од трката (дефект/несреќа)
function retireDriver(driver) {
    driver.status = "Излезе од трката";
    saveEvent(driver, "Излезе од трката (Абдицираше)");
}

// Зачувување на поединечен настан на возач
function saveEvent(driver, eventDesc) {
    raceHistory.push({
        driver: driver.name,
        lap: currentLap,
        event: eventDesc
    });
}

// Зачувување на општ настан (како Safety Car)
function saveGlobalEvent(eventDesc) {
    raceHistory.push({
        driver: "Трка / Дирекција",
        lap: currentLap,
        event: eventDesc
    });
}

// Прикажување на историјата во табелата
function displayHistory() {
    var statusBody = document.getElementById("status-body");
    statusBody.innerHTML = "";

    for (var i = 0; i < raceHistory.length; i++) {
        var event = raceHistory[i];
        var row = document.createElement("tr");

        row.innerHTML = "<td>" + event.driver + "</td>" +
            "<td>" + event.lap + "</td>" +
            "<td>" + event.event + "</td>";

        statusBody.appendChild(row);
    }
}

// Ресетирање на трката
function resetRace() {
    if (raceInterval !== null) {
        clearInterval(raceInterval);
        raceInterval = null;
    }

    currentLap = 0;

    for (var i = 0; i < drivers.length; i++) {
        drivers[i].name = initialDrivers[i].name;
        drivers[i].team = initialDrivers[i].team;
        drivers[i].speed = initialDrivers[i].speed;
        drivers[i].skill = initialDrivers[i].skill;
        drivers[i].tires = initialDrivers[i].tires;
        drivers[i].time = initialDrivers[i].time;
        drivers[i].status = initialDrivers[i].status;
        drivers[i].pitDone = initialDrivers[i].pitDone;
    }

    raceHistory.length = 0;
    currentLapElement.textContent = currentLap;
    startButton.disabled = false;

    displayDrivers();
    displayHistory();

    document.getElementById("winner-name").textContent = "-";
    document.getElementById("results-body").innerHTML = "";
}

document.getElementById("reset-race").addEventListener("click", resetRace);

function saveLapResults() {
    for (var i = 0; i < drivers.length; i++) {
        raceHistory.push({
            driver: drivers[i].name,
            lap: currentLap,
            event: "Завршен круг (Вкупно време: " + drivers[i].time.toFixed(2) + "s)",
            time: drivers[i].time,
            tires: drivers[i].tires,
            status: drivers[i].status
        });
    }
}

// Иницијално вчитување на почетната состојба
displayDrivers();
saveStartingGrid();
displayHistory();