/**
 * Konfiguration
 */
const GITHUB_USERNAME = 'oxx0r';
const EXCLUDED_REPO = 'oxx0r.github.io'; // Dein Profil-Repo, das nicht gelistet werden soll

/**
 * Sucht in der README.md nach dem ersten Markdown-Bild-Link
 */
async function getCoverImage(repoName) {
    try {
        // Wir fragen die README über den Raw-Link ab (effizienter als API für den Inhalt)
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
        if (!response.ok) return null;

        const text = await response.text();

        // Regex sucht nach ![alt-text](url)
        const imageMatch = text.match(/!\[.*\]\((.*?)\)/);
        
        if (imageMatch && imageMatch[1]) {
            let url = imageMatch[1];
            // Falls es ein relativer Pfad ist, machen wir ihn absolut
            if (!url.startsWith('http')) {
                url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/${url}`;
            }
            return url;
        }
    } catch (error) {
        console.warn(`Kein Bild für ${repoName} gefunden.`);
    }
    return null;
}

/**
 * Holt alle Repos und baut die Karten
 */
async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        // 1. Repos abrufen
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        if (!response.ok) throw new Error('GitHub API Limit erreicht oder Nutzer nicht gefunden.');
        
        let repos = await response.json();

        // 2. Filter: Keine Forks, kein Profil-Repo
        repos = repos.filter(repo => !repo.fork && repo.name !== EXCLUDED_REPO);

        // 3. Sortieren: Alphabetisch A-Z
        repos.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        container.innerHTML = ''; // Ladeanzeige entfernen

        // 4. Jedes Repo verarbeiten
        for (const repo of repos) {
            const card = document.createElement('div');
            card.className = 'repo-card';

            // Bild und Release parallel anfragen (optional zur Performance-Steigerung)
            const coverUrl = await getCoverImage(repo.name);
            
            // HTML für das Bild (nur wenn vorhanden)
            const imgHtml = coverUrl 
                ? `<img src="${coverUrl}" class="repo-cover" alt="${repo.name} Cover">` 
                : `<div class="repo-cover" style="display:flex; align-items:center; justify-content:center; color:#30363d;">Kein Cover</div>`;

            // Release check
            let downloadHtml = '';
            try {
                const relResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/releases/latest`);
                if (relResponse.ok) {
                    const release = await relResponse.json();
                    downloadHtml = `<a href="${release.html_url}" target="_blank" class="btn-download">Latest Release</a>`;
                }
            } catch (e) { /* Kein Release gefunden */ }

            // Karte zusammenbauen
            card.innerHTML = `
                ${imgHtml}
                <div class="repo-content">
                    <a href="${repo.html_url}" target="_blank" class="repo-title-link">${repo.name}</a>
                    <p class="repo-description">${repo.description || 'Keine Beschreibung hinterlegt.'}</p>
                    
                    <div class="button-wrapper">
                        ${downloadHtml}
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        }
    } catch (error) {
        container.innerHTML = `<div class="status-msg" style="color: #f85149;">Fehler: ${error.message}</div>`;
    }
}

// Start
fetchRepos();