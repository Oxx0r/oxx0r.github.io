// Konfiguration
const GITHUB_USERNAME = 'Oxx0r'; // HIER anpassen!

async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        // 1. Repositories abrufen (sortiert nach letztem Update)
        const repoResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
        const repos = await repoResponse.json();
        
        container.innerHTML = ''; // Lade-Text entfernen

        for (const repo of repos) {
            // Wir erstellen ein Element für jedes Repo
            const card = document.createElement('div');
            card.className = 'repo-card';
            
            // 2. Latest Release für dieses Repo abrufen
            const releaseResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/releases/latest`);
            let downloadHtml = '<p class="no-release">Kein Release verfügbar</p>';

            if (releaseResponse.ok) {
                const release = await releaseResponse.json();
                // Link zum Browser-Download-Asset oder zur Release-Seite
                downloadHtml = `<a href="${release.html_url}" target="_blank" class="btn-download">Download Latest (${release.tag_name})</a>`;
            }

            // 3. HTML zusammenbauen
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Keine Beschreibung vorhanden.'}</p>
                ${downloadHtml}
            `;
            
            container.appendChild(card);
        }
    } catch (error) {
        container.innerHTML = '<p>Fehler beim Laden der Daten.</p>';
        console.error("API Fehler:", error);
    }
}

// Funktion beim Start ausführen
fetchRepos();