/**
 * Lädt die automatisiert erstellten Projektdaten und rendert sie im Grid.
 */
async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        // Schritt 1: Laden der lokalen JSON-Datei (erstellt durch GitHub Action)
        const response = await fetch('repos.json');
        
        if (!response.ok) {
            throw new Error('Projekt-Daten konnten nicht geladen werden.');
        }
        
        const repos = await response.json();

        // Falls das Skript keine Repos findet (z.B. Filter in Python zu streng)
        if (repos.length === 0) {
            container.innerHTML = '<p class="status-msg">Momentan sind keine Projekte verfügbar.</p>';
            return;
        }

        // Schritt 2: Container leeren (entfernt Lade-Animationen oder Platzhalter)
        container.innerHTML = ''; 

        // Schritt 3: Jedes Projekt in HTML umwandeln
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';

            // Bild-Handling: Fallback, falls die Action kein Bild im README gefunden hat
            const imgHtml = repo.cover_image 
                ? `<img src="${repo.cover_image}" class="repo-cover" alt="Vorschau von ${repo.name}" loading="lazy">` 
                : `<div class="repo-cover empty-img"><span>Kein Vorschaubild</span></div>`;

            // Release-Button: Wird nur eingebaut, wenn ein Release existiert
            const downloadBtn = repo.latest_release_url 
                ? `<div class="button-wrapper">
                     <a href="${repo.latest_release_url}" target="_blank" class="btn-download">Latest Release</a>
                   </div>` 
                : '';

            // Karten-Struktur zusammenbauen
            card.innerHTML = `
                ${imgHtml}
                <div class="repo-content">
                    <a href="${repo.html_url}" target="_blank" class="repo-title-link">${repo.name}</a>
                    <p class="repo-description">${repo.description || 'Ein spannendes Projekt auf GitHub.'}</p>
                    ${downloadBtn}
                </div>
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Fehler beim Portfolio-Laden:", error);
        container.innerHTML = `<p class="status-msg" style="color: #f85149;">Fehler: ${error.message}</p>`;
    }
}

// Startet den Ladevorgang, sobald das Skript geladen wurde
fetchRepos();