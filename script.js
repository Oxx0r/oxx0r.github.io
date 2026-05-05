/**
 * Lädt die vor-generierten Repository-Daten aus der repos.json
 */
async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        // Wir rufen die statische JSON-Datei ab, kein API-Aufruf nötig!
        const response = await fetch('repos.json');
        
        if (!response.ok) {
            throw new Error('Die Repository-Daten wurden noch nicht generiert.');
        }
        
        const repos = await response.json();

        if (repos.length === 0) {
            container.innerHTML = '<div class="status-msg">Keine Projekte gefunden.</div>';
            return;
        }

        container.innerHTML = ''; // Ladeanzeige entfernen

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';

            // Bild-Logik: Nutzt das von Python gefundene Bild
            const imgHtml = repo.cover_image 
                ? `<img src="${repo.cover_image}" class="repo-cover" alt="${repo.name}">` 
                : `<div class="repo-cover" style="display:flex; align-items:center; justify-content:center; background:#010409; color:#30363d;"><span>Kein Bild</span></div>`;

            // Release-Button
            const downloadBtn = repo.latest_release_url 
                ? `<div class="button-wrapper"><a href="${repo.latest_release_url}" target="_blank" class="btn-download">Latest Release</a></div>` 
                : '';

            card.innerHTML = `
                ${imgHtml}
                <div class="repo-content">
                    <a href="${repo.html_url}" target="_blank" class="repo-title-link">${repo.name}</a>
                    <p class="repo-description">${repo.description || 'Keine Beschreibung vorhanden.'}</p>
                    ${downloadBtn}
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = `<div class="status-msg" style="color:#f85149;">Hinweis: ${error.message}</div>`;
        console.error(error);
    }
}

// Start der Anwendung
fetchRepos();