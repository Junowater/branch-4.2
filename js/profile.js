
document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");

  if (!name) {
    document.getElementById("memberName").textContent = "No team member selected.";
    return;
  }

  document.getElementById("memberName").textContent = "Profile: " + name;

  const scheduleKeys = [
    "centerSection_schedule",
    "frontLine_schedule",
    "rearLine_schedule"
  ];

  const knownStationsSet = new Set();

  scheduleKeys.forEach(key => {
    const schedule = JSON.parse(localStorage.getItem(key) || "{}");
    for (let quarter in schedule) {
      const stations = schedule[quarter];
      for (let station in stations) {
        const entries = stations[station];
        if (Array.isArray(entries)) {
          entries.forEach(obj => {
            if (obj.name === name) {
              knownStationsSet.add(station);
            }
          });
        }
      }
    }
  });

  const knownStationsArray = Array.from(knownStationsSet);
  document.getElementById("knownStations").textContent = knownStationsArray.length > 0
    ? knownStationsArray.join(", ")
    : "No stations found.";

  const teamMemberData = JSON.parse(localStorage.getItem("teamMemberData") || "{}");
  const memberEntry = teamMemberData[name] || {};
  const quarterAssignments = memberEntry.quarters || {};

  const quarters = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];
  const assignments = quarters.map(q => {
    const line = quarterAssignments[q] || "Unassigned";
    return q + ": " + line;
  });
  document.getElementById("lineAssignments").textContent = assignments.join("\n");
});
