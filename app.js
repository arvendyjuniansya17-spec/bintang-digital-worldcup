const container =
document.getElementById("groupsContainer");

for(const group in groups){

const div =
document.createElement("div");

div.className = "group";

let html =
`<h2>GRUP ${group}</h2>`;

groups[group].forEach(team=>{

html +=
`
<div class="team">
${team}
</div>
`;

});

div.innerHTML = html;

container.appendChild(div);

}
const matchContainer =
document.getElementById("matchesContainer");

for(const group in matches){

const title =
document.createElement("h2");

title.innerHTML =
`Grup ${group}`;

matchContainer.appendChild(title);

matches[group].forEach((match,index)=>{

const card =
document.createElement("div");

card.className =
"match-card";

const key =
`${group}-${index}`;

const saved =
JSON.parse(
localStorage.getItem(key)
);

if(saved){

match.score1 =
saved.score1;

match.score2 =
saved.score2;

}

card.innerHTML =

`
<div class="match-row">

<span>${match.home}</span>

<input
type="number"
id="${key}-1"
value="${match.score1}"
>

<span>VS</span>

<input
type="number"
id="${key}-2"
value="${match.score2}"
>

<span>${match.away}</span>

</div>

<button
class="save-btn"
onclick="saveMatch('${group}',${index})">
Simpan Prediksi
</button>

`;

matchContainer.appendChild(card);

});

}
let currentSlot = null;
let selectedTeams = [];
function saveMatch(group,index){

const score1 =
document.getElementById(
`${group}-${index}-1`
).value;

const score2 =
document.getElementById(
`${group}-${index}-2`
).value;

localStorage.setItem(

`${group}-${index}`,

JSON.stringify({
score1,
score2
})

);

generateStandings();

alert("Prediksi berhasil disimpan");

}function generateStandings(){

const standingsContainer =
document.getElementById("standingsContainer");

standingsContainer.innerHTML = "";

for(const group in groups){

let table = {};

groups[group].forEach(team=>{

table[team]={
team,
mp:0,
w:0,
d:0,
l:0,
gf:0,
ga:0,
gd:0,
pts:0
};

});

if(matches[group]){

matches[group].forEach((match,index)=>{

const saved =
JSON.parse(
localStorage.getItem(`${group}-${index}`)
);

if(!saved) return;

const s1 =
parseInt(saved.score1);

const s2 =
parseInt(saved.score2);

if(isNaN(s1) || isNaN(s2))
return;

let home =
table[match.home];

let away =
table[match.away];

home.mp++;
away.mp++;

home.gf += s1;
home.ga += s2;

away.gf += s2;
away.ga += s1;

if(s1 > s2){

home.w++;
home.pts += 3;

away.l++;

}

else if(s1 < s2){

away.w++;
away.pts += 3;

home.l++;

}

else{

home.d++;
away.d++;

home.pts++;
away.pts++;

}

});

}

Object.values(table).forEach(team=>{

team.gd =
team.gf - team.ga;

});

let sorted =
Object.values(table)
.sort((a,b)=>

b.pts - a.pts ||
b.gd - a.gd ||
b.gf - a.gf

);

let html =

`
<h3 class="group-title">
Grup ${group}
</h3>

<table class="standings-table">

<tr>

<th>#</th>
<th>Tim</th>
<th>M</th>
<th>W</th>
<th>D</th>
<th>L</th>
<th>GF</th>
<th>GA</th>
<th>GD</th>
<th>P</th>

</tr>
`;

sorted.forEach((team,pos)=>{

html +=

`
<tr>

<td>${pos+1}</td>

<td>${team.team}</td>

<td>${team.mp}</td>

<td>${team.w}</td>

<td>${team.d}</td>

<td>${team.l}</td>

<td>${team.gf}</td>

<td>${team.ga}</td>

<td>${team.gd}</td>

<td>${team.pts}</td>

</tr>
`;

});

html += "</table>";

standingsContainer.innerHTML += html;

}

}
generateStandings();
function getGroupRankings(){

let rankings = {};

for(const group in groups){

let table = {};

groups[group].forEach(team=>{

table[team]={
team,
pts:0,
gf:0,
ga:0,
gd:0
};

});

if(matches[group]){

matches[group].forEach((match,index)=>{

const saved =
JSON.parse(
localStorage.getItem(`${group}-${index}`)
);

if(!saved) return;

const s1 = parseInt(saved.score1);
const s2 = parseInt(saved.score2);

if(isNaN(s1) || isNaN(s2))
return;

let home = table[match.home];
let away = table[match.away];

home.gf += s1;
home.ga += s2;

away.gf += s2;
away.ga += s1;

if(s1 > s2){

home.pts += 3;

}
else if(s1 < s2){

away.pts += 3;

}
else{

home.pts += 1;
away.pts += 1;

}

});

}

Object.values(table).forEach(team=>{

team.gd = team.gf - team.ga;

});

rankings[group] =
Object.values(table)
.sort((a,b)=>

b.pts-a.pts ||
b.gd-a.gd ||
b.gf-a.gf

);

}

return rankings;

}
function generateRound32(){

const container =
document.getElementById("round32Container");

container.innerHTML = "";

const rankings = getGroupRankings();

const winners = [];
const runners = [];

const bestThird =
getBestThirdTeams();

for(const group in rankings){

winners.push(
rankings[group][0]?.team || "TBD"
);

runners.push(
rankings[group][1]?.team || "TBD"
);

}

const thirdTeams =
bestThird.map(t => t.team);

const pairings = [

[winners[0], runners[1]],
[winners[1], runners[0]],

[winners[2], runners[3]],
[winners[3], runners[2]],

[winners[4], runners[5]],
[winners[5], runners[4]],

[winners[6], runners[7]],
[winners[7], runners[6]],

[winners[8], runners[9]],
[winners[9], runners[8]],

[winners[10], runners[11]],
[winners[11], runners[10]],

[thirdTeams[0] || "TBD", thirdTeams[7] || "TBD"],
[thirdTeams[1] || "TBD", thirdTeams[6] || "TBD"],
[thirdTeams[2] || "TBD", thirdTeams[5] || "TBD"],
[thirdTeams[3] || "TBD", thirdTeams[4] || "TBD"]

];

pairings.forEach((match,index)=>{

const key = `r32-${index}`;

const saved =
JSON.parse(localStorage.getItem(key));

const s1 = saved?.s1 || "";
const s2 = saved?.s2 || "";

container.innerHTML += `
<div class="knockout-card">

<h4>Round 32 - Match ${index+1}</h4>

<p>${match[0]} VS ${match[1]}</p>

<div class="knockout-input">

<input type="number"
id="${key}-1"
value="${s1}">

<span>VS</span>

<input type="number"
id="${key}-2"
value="${s2}">

<button
class="save-btn"
onclick="saveR32(${index}, '${match[0]}', '${match[1]}')">

Simpan

</button>

</div>

</div>
`;

});

}function getBestThirdTeams(){
const rankings =
getGroupRankings();

let thirdTeams = [];

for(const group in rankings){

if(rankings[group][2]){

thirdTeams.push({

group: group,
team: rankings[group][2].team,
pts: rankings[group][2].pts,
gd: rankings[group][2].gd,
gf: rankings[group][2].gf

});

}

}

thirdTeams.sort((a,b)=>

b.pts - a.pts ||
b.gd - a.gd ||
b.gf - a.gf

);

return thirdTeams.slice(0,8);

}
function saveR32(index, team1, team2){

const s1 = document.getElementById(`r32-${index}-1`).value;

const s2 = document.getElementById(`r32-${index}-2`).value;

localStorage.setItem(`r32-${index}`, JSON.stringify({ s1, s2, winner: parseInt(s1) > parseInt(s2) ? team1 : team2 }));

generateRound16();


alert("Hasil Round of 32 disimpan");

}
function generateRound16(){

const container =
document.getElementById("round16Container");

container.innerHTML = "";

let winners = [];

for(let i=0;i<16;i++){

const saved =
JSON.parse(localStorage.getItem(`r32-${i}`));

if(saved?.winner){

winners.push(saved.winner);

}

}

for(let i=0;i<winners.length;i+=2){

if(!winners[i+1]) break;

const key = `r16-${i/2}`;

container.innerHTML += `
<div class="knockout-card">

<h4>Round 16 Match ${i/2+1}</h4>

${winners[i]} VS ${winners[i+1]}

<div class="knockout-input">

<input type="number" id="${key}-1">

<span>VS</span>

<input type="number" id="${key}-2">

<button
class="save-btn"
onclick="saveR16(${i/2},'${winners[i]}','${winners[i+1]}')">

Simpan

</button>

</div>

</div>
`;

}

}
function saveR16(index, team1, team2){

const s1 =
parseInt(document.getElementById(`r16-${index}-1`).value);

const s2 =
parseInt(document.getElementById(`r16-${index}-2`).value);

if(isNaN(s1) || isNaN(s2)){
alert("Isi skor terlebih dahulu");
return;
}

localStorage.setItem(
`r16-${index}`,
JSON.stringify({
s1,
s2,
winner: s1 > s2 ? team1 : team2
})
);

generateQuarterFinal();
generateSemiFinal();
generateFinal();
generateVisualBracket();

alert("Round 16 disimpan");

}function generateQuarterFinal(){

const container =
document.getElementById(
"quarterFinalContainer"
);

container.innerHTML = "";

let winners = [];

for(let i=0;i<8;i++){

const saved =
JSON.parse(
localStorage.getItem(`r16-${i}`)
);

if(saved?.winner){

winners.push(
saved.winner
);

}

}

for(let i=0;i<winners.length;i+=2){

if(!winners[i+1]) break;

const key = `qf-${i/2}`;

container.innerHTML += `
<div class="knockout-card">

<h4>
Quarter Final ${i/2+1}
</h4>

${winners[i]}
VS
${winners[i+1]}

<div class="knockout-input">

<input type="number" id="${key}-1">

<span>VS</span>

<input type="number" id="${key}-2">

<button
class="save-btn"
onclick="saveQuarterFinal(${i/2},'${winners[i]}','${winners[i+1]}')">

Simpan

</button>

</div>

</div>
`;
}
}

function saveQuarterFinal(index, team1, team2){

const s1 =
parseInt(document.getElementById(`qf-${index}-1`).value);

const s2 =
parseInt(document.getElementById(`qf-${index}-2`).value);

if(isNaN(s1) || isNaN(s2)){
alert("Isi skor terlebih dahulu");
return;
}

localStorage.setItem(
`qf-${index}`,
JSON.stringify({
s1,
s2,
winner: s1 > s2 ? team1 : team2
})
);

generateSemiFinal();
generateFinal();
generateVisualBracket();

alert("Quarter Final disimpan");

}function generateSemiFinal(){

const container =
document.getElementById("semiFinalContainer");

container.innerHTML = "";

let winners = [];

for(let i=0;i<4;i++){

const saved =
JSON.parse(localStorage.getItem(`qf-${i}`) || "null");

if(saved?.winner){
winners.push(saved.winner);
}

}

for(let i=0;i<winners.length;i+=2){

if(!winners[i+1]) break;

const key = `sf-${i/2}`;

container.innerHTML += `
<div class="knockout-card">

<h4>Semi Final ${i/2+1}</h4>

<p>${winners[i]} VS ${winners[i+1]}</p>

<div class="knockout-input">

<input type="number" id="${key}-1">

<span>VS</span>

<input type="number" id="${key}-2">

<button
class="save-btn"
onclick="saveSemiFinal(${i/2},'${winners[i]}','${winners[i+1]}')">

Simpan

</button>

</div>

</div>
`;

}

}function saveSemiFinal(index, team1, team2){

const s1 =
parseInt(document.getElementById(`sf-${index}-1`).value);

const s2 =
parseInt(document.getElementById(`sf-${index}-2`).value);

if(isNaN(s1) || isNaN(s2)){
alert("Isi skor terlebih dahulu");
return;
}

localStorage.setItem(
`sf-${index}`,
JSON.stringify({
s1,
s2,
winner: s1 > s2 ? team1 : team2
})
);

generateFinal();
generateVisualBracket();

alert("Semi Final disimpan");

}
function generateFinal(){

const container =
document.getElementById("finalContainer");

container.innerHTML = "";

let winners = [];

for(let i=0;i<2;i++){

const saved =
JSON.parse(localStorage.getItem(`sf-${i}`) || "null");

if(saved?.winner){
winners.push(saved.winner);
}

}

if(winners.length < 2) return;

container.innerHTML = `
<div class="knockout-card">

<h4>FINAL</h4>

<p>${winners[0]} VS ${winners[1]}</p>

<div class="knockout-input">

<input type="number" id="final-1">

<span>VS</span>

<input type="number" id="final-2">

<button
class="save-btn"
onclick="saveFinal('${winners[0]}','${winners[1]}')">

Tentukan Juara

</button>

</div>

</div>
`;

}function saveFinal(team1, team2){

const s1 =
parseInt(document.getElementById("final-1").value);

const s2 =
parseInt(document.getElementById("final-2").value);

if(isNaN(s1) || isNaN(s2)){
alert("Isi skor terlebih dahulu");
return;
}

const winner =
s1 > s2 ? team1 : team2;

localStorage.setItem(
"worldcup-winner",
winner
);

showChampion();
generateVisualBracket();

alert("🏆 JUARA DUNIA: " + winner);

}
function showChampion(){

const winner =
localStorage.getItem("worldcup-winner");

if(!winner) return;

document.getElementById("championContainer").innerHTML = `
<div class="knockout-card">
<h2>🏆 ${winner}</h2>
</div>
`;

}
function generateVisualBracket(){

const left =
document.getElementById("leftBracket");

const right =
document.getElementById("rightBracket");

const center =
document.getElementById("centerFinal");

if(!left || !right || !center) return;

let leftHtml =
`<div class="bracket-side">`;

let rightHtml =
`<div class="bracket-side">`;


// ROUND 32 KIRI

leftHtml += `<div class="bracket-column">`;

for(let i=0;i<8;i++){

const data =
JSON.parse(
localStorage.getItem(`r32-${i}`) || "null"
);

leftHtml += `
<div class="bracket-box">
${data?.winner || "TBD"}
</div>
`;

}

leftHtml += `</div>`;


// ROUND 32 KANAN

rightHtml += `<div class="bracket-column">`;

for(let i=8;i<16;i++){

const data =
JSON.parse(
localStorage.getItem(`r32-${i}`) || "null"
);

rightHtml += `
<div class="bracket-box">
${data?.winner || "TBD"}
</div>
`;

}

rightHtml += `</div>`;


// ROUND 16

leftHtml += `<div class="bracket-column">`;

for(let i=0;i<4;i++){

const data =
JSON.parse(
localStorage.getItem(`r16-${i}`) || "null"
);

leftHtml += `
<div class="bracket-box">
${data?.winner || "TBD"}
</div>
`;

}

leftHtml += `</div>`;

rightHtml += `<div class="bracket-column">`;

for(let i=4;i<8;i++){

const data =
JSON.parse(
localStorage.getItem(`r16-${i}`) || "null"
);

rightHtml += `
<div class="bracket-box">
${data?.winner || "TBD"}
</div>
`;

}

rightHtml += `</div>`;


// QUARTER FINAL

leftHtml += `<div class="bracket-column">`;

for(let i=0;i<2;i++){

const data =
JSON.parse(
localStorage.getItem(`qf-${i}`) || "null"
);

leftHtml += `
<div class="bracket-box">
${data?.winner || "TBD"}
</div>
`;

}

leftHtml += `</div>`;

rightHtml += `<div class="bracket-column">`;

for(let i=2;i<4;i++){

const data =
JSON.parse(
localStorage.getItem(`qf-${i}`) || "null"
);

rightHtml += `
<div class="bracket-box">
${data?.winner || "TBD"}
</div>
`;

}

rightHtml += `</div>`;


// SEMI FINAL

leftHtml += `<div class="bracket-column">`;

const sf0 =
JSON.parse(localStorage.getItem("sf-0") || "null");

leftHtml += `
<div class="bracket-box">
${sf0?.winner || "TBD"}
</div>
`;

leftHtml += `</div>`;


rightHtml += `<div class="bracket-column">`;

const sf1 =
JSON.parse(localStorage.getItem("sf-1") || "null");

rightHtml += `
<div class="bracket-box">
${sf1?.winner || "TBD"}
</div>
`;

rightHtml += `</div>`;

leftHtml += `</div>`;
rightHtml += `</div>`;

left.innerHTML = leftHtml;
right.innerHTML = rightHtml;

const champion =
localStorage.getItem("worldcup-winner");

center.innerHTML = `
<div class="final-box">

🏆

<br><br>

${champion || "FINAL"}

</div>
`;

}function generateManualRound32(){

const container =
document.getElementById("manualRound32");

if(!container) return;

const teams =
getAllTeams();

let html = "";

for(let i=1;i<=16;i++){

html += `

<div class="manual-match">

<h4>Match ${i}</h4>

<select
id="home-${i}"
onchange="validateManualTeams()">

<option value="">
Pilih Tim
</option>

${teams.map(team=>`
<option value="${team}">
${team}
</option>
`).join("")}

</select>

<span class="vs-text">
VS
</span>

<select
id="away-${i}"
onchange="validateManualTeams()">

<option value="">
Pilih Tim
</option>

${teams.map(team=>`
<option value="${team}">
${team}
</option>
`).join("")}

</select>

</div>

`;

}

container.innerHTML = html;

}function getAllTeams(){

let teams = [];

for(const group in groups){

teams.push(...groups[group]);

}

return teams;

}
function saveManualRound32(){

let teams = [];

for(let i=1;i<=16;i++){

const home =
document.getElementById(`home-${i}`).value;

const away =
document.getElementById(`away-${i}`).value;

if(!home || !away){

alert(`Match ${i} belum lengkap`);

return;

}

if(teams.includes(home) ||
teams.includes(away)){

alert("Ada tim yang dipilih lebih dari sekali");

return;

}

teams.push(home);
teams.push(away);

}

localStorage.setItem(
"manual32",
JSON.stringify(teams)
);

generateRound32Manual();

alert("Bracket 32 Besar berhasil disimpan");

}function generateRound32Manual(){

const container =
document.getElementById("round32Container");

container.innerHTML = "";

const teams =
JSON.parse(
localStorage.getItem("manual32")
|| "[]"
);

for(let i=0;i<32;i+=2){

const team1 = teams[i];
const team2 = teams[i+1];

const key = `r32-${i/2}`;

container.innerHTML += `
<div class="knockout-card">

<h4>Round 32 - Match ${(i/2)+1}</h4>

<p>${team1} VS ${team2}</p>

<div class="knockout-input">

<input type="number"
id="${key}-1">

<span>VS</span>

<input type="number"
id="${key}-2">

<button
class="save-btn"
onclick="saveR32(${i/2},'${team1}','${team2}')">

Simpan

</button>

</div>

</div>
`;

}

}
function validateManualTeams(){

const selected = [];

for(let i=1;i<=32;i++){

const select =
document.getElementById(`manual-team-${i}`);

if(!select) continue;

select.classList.remove("manual-error");

if(select.value){

if(selected.includes(select.value)){

select.classList.add("manual-error");

}else{

selected.push(select.value);

}

}

}

}
function generateDragBracket(){

const container =
document.getElementById("dragBracket");

if(!container) return;

const teams =
getAllTeams();

let html =
`<div class="drag-bracket">`;

for(let i=0;i<16;i++){

html += `

<div class="drag-match">

<h4>
Match ${i+1}
</h4>
<div
class="dropzone"
id="home-slot-${i}"
onclick="setSlot('home-slot-${i}')">
Kosong

</div>

<div
class="dropzone"
id="away-slot-${i}"
onclick="setSlot('away-slot-${i}')">
Kosong

</div>

</div>

`;

}

html += "</div>";

container.innerHTML = html;

}
function generateTeamPool(){

const container =
document.getElementById("teamPool");

if(!container) return;

const teams =
getAllTeams();

container.className =
"team-pool";

container.innerHTML =
teams.map(team=>`

<div
class="pool-team"
onclick="selectTeam('${team}')">

<img
src="${getFlag(team)}"
class="flag">

${team}

</div>

`).join("");

}
function setSlot(id){

document
.querySelectorAll(".dropzone")
.forEach(slot=>{

slot.classList.remove("active");

});

currentSlot = id;

document
.getElementById(id)
.classList.add("active");

}function selectTeam(team){

if(!currentSlot) return;

if(selectedTeams.includes(team)){

alert("Tim sudah dipakai");

return;

}

const slot =
document.getElementById(currentSlot);

if(!slot) return;

const oldTeam =
slot.dataset.team;

if(oldTeam){

selectedTeams =
selectedTeams.filter(
t => t !== oldTeam
);

}

slot.dataset.team = team;

slot.innerHTML = `
<img
src="${getFlag(team)}"
class="flag">

${team}
`;

selectedTeams.push(team);

}function saveDragBracket(){

let teams = [];

for(let i=0;i<16;i++){

const home =
document.getElementById(
`home-slot-${i}`
).innerText;

const away =
document.getElementById(
`away-slot-${i}`
).innerText;

if(
home === "Kosong" ||
away === "Kosong"
){

alert(
`Match ${i+1} belum lengkap`
);

return;

}

teams.push(home);
teams.push(away);

}

localStorage.setItem(
"manual32",
JSON.stringify(teams)
);

generateRound32Manual();

alert(
"Bracket berhasil dibuat"
);

}
function resetTournament(){

if(
!confirm(
"Yakin ingin menghapus seluruh prediksi?"
)
){
return;
}

localStorage.clear();

location.reload();

}generateStandings();
generateRound32();
generateRound16();
generateQuarterFinal();
generateSemiFinal();
generateFinal();
showChampion();
generateVisualBracket();

generateManualRound32();
generateDragBracket();
generateTeamPool();