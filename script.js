// ==========================================
// 1) GLOBALE VARIABELEN & APPAARATUUR
// ==========================================

// Ophalen of aanmaken van teams in de browser. 
// Elk team heeft nu een 'scores' object waarin per sport de stand wordt bijgehouden (bijv: {"Voetbal": 0, "Tennis": 2})
let teams = JSON.parse(localStorage.getItem("teams") || "[{\"name\":\"Team 1\",\"scores\":{},\"actief\":true},{\"name\":\"Team 2\",\"scores\":{},\"actief\":true}]");

// Ophalen of aanmaken van sporten (start standaard met Sport 1 en Sport 2)
let sporten = JSON.parse(localStorage.getItem("sporten") || "[\"Sport 1\", \"Sport 2\"]");

// De actieve sport die momenteel geselecteerd is
let huidigeSport = localStorage.getItem("huidigeSport") || "Sport 1";


// ==========================================
// 2) ALGEMENE FUNCTIES (MENU)
// ==========================================

function toggleMenu() {
    let sidebar = document.getElementById("mySidebar");
    if (sidebar) {
        sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
    }
}


// ==========================================
// 3) PAGINA: teams.html (Teams Beheren)
// ==========================================

function saveTeamsToStorage() {
    localStorage.setItem("teams", JSON.stringify(teams));
}

function addTeam(){
    teams.push({name:"Team " + (teams.length + 1), scores:{}, actief: true});
    saveTeamsToStorage();
    renderTeamsLijst();
}

function deleteTeam(index) {
    if(confirm("Weet je zeker dat je dit team wilt verwijderen?")) {
        teams.splice(index, 1);
        saveTeamsToStorage();
        renderTeamsLijst();
    }
}

function renderTeamsLijst(){
    let div = document.getElementById("teamsLijstDiv");
    if(!div) return;
    div.innerHTML = "";

    teams.forEach((t, i) => {
        div.innerHTML += `
        <div class="team-item" style="margin: 10px 0; padding: 15px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; max-width: 500px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <input value="${t.name}" onchange="teams[${i}].name=this.value; saveTeamsToStorage();" style="padding:8px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; width: 70%;">
            <button onclick="deleteTeam(${i})" style="background: #ff3b30; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">❌</button>
        </div>
        `;
    });
}


// ==========================================
// 4) PAGINA: sporten.html (Sporten Beheren)
// ==========================================

function saveSportenToStorage() {
    localStorage.setItem("sporten", JSON.stringify(sporten));
}

function addSport(){
    sporten.push("Sport " + (sporten.length + 1));
    saveSportenToStorage();
    renderSportenLijst();
}

function deleteSport(index) {
    if(confirm("Weet je zeker dat je deze sport wilt verwijderen?")) {
        sporten.splice(index, 1);
        saveSportenToStorage();
        renderSportenLijst();
    }
}

function renderSportenLijst(){
    let div = document.getElementById("sportenLijstDiv");
    if(!div) return;
    div.innerHTML = "";

    sporten.forEach((sport, i) => {
        div.innerHTML += `
        <div class="sport-item" style="margin: 10px 0; padding: 15px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; max-width: 500px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <input value="${sport}" onchange="sporten[${i}]=this.value; saveSportenToStorage();" style="padding:8px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; width: 70%;">
            <button onclick="deleteSport(${i})" style="background: #ff3b30; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">❌</button>
        </div>
        `;
    });
}


// ==========================================
// 5) PAGINA: wedstrijd.html (Live Wedstrijd)
// ==========================================

function updateLiveSport(waarde) {
    huidigeSport = waarde;
    localStorage.setItem("huidigeSport", waarde);
    // Herlaad de invoer zodat de scores van de nieuw gekozen sport getoond worden
    renderWedstrijdInvoer();
}

function vulSportenKeuzemenu() {
    let selectMenu = document.getElementById("sport");
    if (!selectMenu) return;
    
    selectMenu.innerHTML = "";
    sporten.forEach(sport => {
        let optie = document.createElement("option");
        optie.value = sport;
        optie.innerText = sport;
        
        if (sport === huidigeSport) {
            optie.selected = true;
        }
        selectMenu.appendChild(optie);
    });
}

function renderWedstrijdInvoer(){
    let div = document.getElementById("wedstrijdPuntenDiv");
    if(!div) return;
    div.innerHTML = "";

    teams.forEach((t, i) => {
        if (t.actief === undefined) t.actief = true;
        if (!t.scores) t.scores = {};
        
        // Haal de specifieke score op voor de huidige geselecteerde sport (standaard 0)
        let actueleScore = t.scores[huidigeSport] || 0;

        div.innerHTML += `
        <div class="team-row ${t.actief ? '' : 'team-muted'}">
            <label style="font-size: 14px; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                <input type="checkbox" ${t.actief ? 'checked' : ''} onchange="toggleTeamActief(${i}, this.checked)">
                Meedoen
            </label>

            <span style="font-weight: bold; font-size: 18px; min-width: 150px; display:inline-block; margin-left: 10px;">🏆 ${t.name}</span>
            <span style="font-weight:bold; min-width: 40px; text-align:center; font-size: 24px; color: #ff5722;">${actueleScore}</span>
            
            <button onclick="changeScore(${i},1)" ${t.actief ? '' : 'disabled'} style="padding: 10px 14px; font-size:16px; cursor:pointer;">+1</button>
            <button onclick="changeScore(${i},2)" ${t.actief ? '' : 'disabled'} style="padding: 10px 14px; font-size:16px; cursor:pointer;">+2</button>
            <button onclick="changeScore(${i},3)" ${t.actief ? '' : 'disabled'} style="padding: 10px 14px; font-size:16px; cursor:pointer;">+3</button>
            <button onclick="changeScore(${i},-1)" ${t.actief ? '' : 'disabled'} style="padding: 10px 14px; font-size:16px; cursor:pointer;">-1</button>
        </div>
        `;
    });
}

function toggleTeamActief(index, isChecked) {
    teams[index].actief = isChecked;
    // Als een team niet meedoet, zetten we de score voor déze sport terug op 0
    if(!isChecked) {
        if (!teams[index].scores) teams[index].scores = {};
        teams[index].scores[huidigeSport] = 0;
    }
    saveTeamsToStorage();
    renderWedstrijdInvoer();
}

function changeScore(i, val){
    if (!teams[i].scores) teams[i].scores = {};
    if (!teams[i].scores[huidigeSport]) teams[i].scores[huidigeSport] = 0;

    teams[i].scores[huidigeSport] += val;
    if(teams[i].scores[huidigeSport] < 0) teams[i].scores[huidigeSport] = 0;
    
    saveTeamsToStorage();
    renderWedstrijdInvoer();
}

function saveMatch(){
    let dateEl = document.getElementById("date");
    let date = dateEl ? dateEl.value : new Date().toLocaleDateString();

    let history = JSON.parse(localStorage.getItem("history") || "[]");

    // Alleen teams filteren die VASTGEVINKT staan als meedoend
    let actieveTeams = teams.filter(t => t.actief === true).map(t => {
        return {
            name: t.name,
            score: t.scores[huidigeSport] || 0
        };
    });

    if(actieveTeams.length === 0) {
        alert("Er moeten wel teams meedoen om een wedstrijd op te slaan!");
        return;
    }

    history.push({
        date: date,
        sport: huidigeSport,
        teams: actieveTeams
    });

    localStorage.setItem("history", JSON.stringify(history));
    
    // Na het opslaan zetten we de scores van de zojuist gespeelde sport terug naar 0 voor een volgende keer
    teams.forEach(t => {
        if(t.scores) t.scores[huidigeSport] = 0;
        t.actief = true; // Iedereen staat weer standaard aan voor de volgende match
    });
    saveTeamsToStorage();

    alert("Wedstrijd succesvol opgeslagen!");
    window.location.href = "geschiedenis.html";
}


// ==========================================
// 6) PAGINA: scorebord.html (Live weergave)
// ==========================================

function renderScorebord() {
    let div = document.getElementById("scoreboardDisplay");
    let titel = document.getElementById("liveSportTitel");
    if(!div) return;

    let liveTeams = JSON.parse(localStorage.getItem("teams") || "[]");
    let liveSport = localStorage.getItem("huidigeSport") || "Sport 1";
    
    titel.innerText = "Huidige discipline: " + liveSport;
    div.innerHTML = "";

    liveTeams.forEach(t => {
        // BELANGRIJK: Als t.actief valse is (vinkje staat uit), dan komt het team er NIET in te staan!
        if (t.actief !== false) {
            let actueleScore = (t.scores && t.scores[liveSport]) ? t.scores[liveSport] : 0;
            div.innerHTML += `
            <div class="score-card">
                <h3>${t.name}</h3>
                <div class="score-display">${actueleScore}</div>
            </div>
            `;
        }
    });
}


// ==========================================
// 7) PAGINA: geschiedenis.html
// ==========================================

function loadHistory(){
    let div = document.getElementById("historyList");
    if(!div) return;
    
    let history = JSON.parse(localStorage.getItem("history") || "[]");
    div.innerHTML = "";

    if(history.length === 0) {
        div.innerHTML = "<p>Nog geen opgeslagen wedstrijden.</p>";
        return;
    }

    history.forEach((h, index)=>{
        div.innerHTML = `
        <div class="item" style="background: white; color: black; padding: 15px; margin: 10px 0; border-radius: 8px; position: relative; max-width: 500px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <b>📅 ${h.date} - 🏅 ${h.sport}</b>
            <button onclick="deleteMatch(${index})" style="position: absolute; right: 15px; top: 15px; background: #ff3b30; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">❌ Verwijder</button>
            <br><br>
            ${h.teams.map(t=>`🏆 ${t.name}: ${t.score}`).join("<br>")}
        </div>
        ` + div.innerHTML;
    });
}

function deleteMatch(index) {
    if(confirm("Weet je zeker dat je deze wedstrijd wilt verwijderen?")) {
        let history = JSON.parse(localStorage.getItem("history") || "[]");
        history.splice(index, 1);
        localStorage.setItem("history", JSON.stringify(history));
        loadHistory();
    }
}


// ==========================================
// 8) PAGINA INITIALISATIE
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    let dateInput = document.getElementById("date");
    if (dateInput) {
        let today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }
    
    vulSportenKeuzemenu();
});