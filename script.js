/**
 * Hauptfunktion zum Abrufen und Anzeigen der Repositories
 */
async function fetchRepos() {
    const container = document.getElementById('repo-container');
    const USERNAME = 'oxx0r'; // Dein Benutzername

    try {
        // Schritt 1: Alle öffentlichen Repos abrufen
        // Wir hängen ?per_page=100 an, um möglichst viele auf einmal zu bekommen
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) throw new Error('Fehler beim Abrufen der Repos');
        
        const repos = await response.json();
        container.innerHTML = ''; // Lade-Anzeige entfernen

        // Schritt 2: Repos durchlaufen
        for (const repo of repos) {
            // Wir ignorieren Forks, um nur eigene Projekte zu zeigen (optional)
            if (repo.fork) continue;

            const card = document.createElement('div');
            card.className = 'repo-card';

            // Platzhalter für den Download-Button
            let downloadBtn = '';

            // Schritt 3: Prüfen, ob das Repo Releases hat
            // GitHub bietet leider kein "has_release" Flag in der Repo-Liste an,
            // daher fragen wir den Release-Endpunkt direkt ab.
            try {
                const relResponse = await fetch(`https://api.github.com/repos/${USERNAME}/${repo.name}/releases/latest`);
                if (relResponse.ok) {
                    const release = await relResponse.json();
                    downloadBtn = `
                        <div class="release-info">
                            <span class="tag">Version: ${release.tag_name}</span>
                            <a href="${release.html_url}" target="_blank" class="btn-download">Latest Release</a>
                        </div>`;
                }
            } catch (e) {
                // Wenn kein Release da ist, bleibt der Button einfach leer
            }

            // Schritt 4: Card-Inhalt erstellen
            card.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${repo.description || 'Keine Beschreibung verfügbar.'}</p>
                <div class="stats">
                    ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 🛠 ${repo.language || 'Plain'}
                </div>
                ${downloadBtn}
                <hr>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        container.innerHTML = `<p style="color:red;">Fehler: ${error.message}</p>`;
    }
}

fetchRepos();