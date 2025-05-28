
document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");

  if (!name) {
    document.getElementById("memberName").textContent = "No team member selected.";
    return;
  }

  document.getElementById("memberName").textContent = "Profile: " + name;

  const stations = JSON.parse(localStorage.getItem("workstations") || "[]");
  const constraints = JSON.parse(localStorage.getItem("constraints") || "[]");
  const schedule = JSON.parse(localStorage.getItem("schedule") || "{}");
  const teamMemberData = JSON.parse(localStorage.getItem("teamMemberData") || "{}");

  const memberEntry = teamMemberData[name] || {};
  const quarterAssignments = memberEntry.quarters || {};

  // Display known stations
  const knownStations = [];
  for (let q in schedule) {
    for (let station in schedule[q]) {
      if (schedule[q][station] === name && !knownStations.includes(station)) {
        knownStations.push(station);
      }
    }
  }
  document.getElementById("knownStations").textContent = knownStations.length > 0 ? knownStations.join(", ") : "No stations found.";

  // Display quarterly assignments
  const quarters = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];
  const assignments = quarters.map(q => {
    const line = quarterAssignments[q] || "Unassigned";
    return q + ": " + line;
  });
  document.getElementById("lineAssignments").textContent = assignments.join("\n");
});
