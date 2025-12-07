const LINE_CONFIGS = [
    { key: 'frontLine_', label: 'Front Line' },
    { key: 'rearLine_', label: 'Rear Line' },
    { key: 'centerSection_', label: 'Center Section' }
];

function readTeamMembersForLine(config) {
    const raw = localStorage.getItem(config.key + 'teamMembers');
    let parsed = [];
    if (raw) {
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            parsed = [];
        }
    }

    return Array.isArray(parsed)
        ? parsed.map(member => formatMember(member, config))
        : [];
}

function formatMember(member, config) {
    const stationMap = new Map();

    if (Array.isArray(member.stations)) {
        member.stations.forEach(station => stationMap.set(station, 'full'));
    }

    if (Array.isArray(member.partialStations)) {
        member.partialStations.forEach(station => {
            if (!stationMap.has(station)) {
                stationMap.set(station, 'partial');
            }
        });
    }

    const stations = Array.from(stationMap.entries()).map(([name, type]) => ({ name, type }));

    return {
        name: member.name || 'Unknown',
        lineLabel: config.label,
        lineKey: config.key,
        stations
    };
}

function collectAllTeamMembers() {
    return LINE_CONFIGS.flatMap(config => readTeamMembersForLine(config));
}

function renderTeamMembers() {
    const tbody = document.getElementById('teamMembersBody');
    const emptyState = document.getElementById('emptyState');
    const filter = document.getElementById('lineFilter').value;

    const members = collectAllTeamMembers();
    const filtered = filter === 'all' ? members : members.filter(member => member.lineKey === filter);

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(member => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = member.name;
        nameCell.setAttribute('data-label', 'Name');

        const lineCell = document.createElement('td');
        lineCell.setAttribute('data-label', 'Line');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = member.lineLabel;
        lineCell.appendChild(badge);

        const stationsCell = document.createElement('td');
        stationsCell.setAttribute('data-label', 'Stations');
        const stationsWrapper = document.createElement('div');
        stationsWrapper.className = 'stations';

        if (member.stations.length === 0) {
            const empty = document.createElement('span');
            empty.textContent = 'No stations added';
            stationsWrapper.appendChild(empty);
        } else {
            member.stations.forEach(({ name, type }) => {
                const stationTag = document.createElement('span');
                stationTag.textContent = type === 'partial' ? `${name} (Partial)` : name;
                if (type === 'partial') {
                    stationTag.classList.add('partial');
                }
                stationsWrapper.appendChild(stationTag);
            });
        }

        stationsCell.appendChild(stationsWrapper);

        row.appendChild(nameCell);
        row.appendChild(lineCell);
        row.appendChild(stationsCell);

        tbody.appendChild(row);
    });
}

function bindControls() {
    const filter = document.getElementById('lineFilter');
    const refresh = document.getElementById('refreshButton');

    filter.addEventListener('change', renderTeamMembers);
    refresh.addEventListener('click', renderTeamMembers);
}

window.addEventListener('DOMContentLoaded', () => {
    bindControls();
    renderTeamMembers();
});
