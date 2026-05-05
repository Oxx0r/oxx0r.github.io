/**
 * Konfiguration
 */
const GITHUB_USERNAME = 'oxx0r';
const EXCLUDED_REPO = 'oxx0r.github.io'; 

/**
 * Sucht in der README.md nach dem ersten verfügbaren Bild (Markdown oder HTML)
 */
async function getCoverImage(repoName) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
        if (!response.ok) return null;

        const text = await response.text();

        // 1. Suche nach Markdown Bildern: ![alt](url)
        const mdMatch = text.match(/!\[.*\]\((.*?)\)/);
        if (mdMatch && mdMatch[1]) {
            return fixRelativeUrl(mdMatch[1], repoName);
        }

        // 2. Suche nach HTML Bildern: <img ... src="url" ... />
        // Dieser Regex sucht nach 'src=', gefolgt von Anführungszeichen und fängt den Inhalt ein
        const htmlMatch = text.match(/<img [^>]*src="([^"]*)"/);
        if (htmlMatch && htmlMatch[1]) {
            return fixRelativeUrl(htmlMatch[1], repoName);
        }
        
    } catch (error) {
        console.warn(`Fehler beim Suchen des Bildes für ${repoName}`);
    }
    return null;
}

/**
 * Hilfsfunktion, um relative Pfade in absolute GitHub-URLs umzuwandeln
 */
function fixRelativeUrl(url, repoName) {
    if (!url.startsWith('http')) {
        return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/${url}`;
    }
    return url;
}

/**
 * Holt alle Repos und baut die Karten
 */
async function fetchRepos() {
    const container = document.getElementById('repo-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        if (!response.ok) throw new Error('API Limit erreicht');
        
        let repos = await response.json();

        // Filter: Keine Forks, kein Profil-Repo
        repos = repos.filter(repo => !repo.fork && repo.name !== EXCLUDED_REPO);

        // Sortieren: Alphabetisch
        repos.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        container.innerHTML = ''; 

        for (const repo of repos) {
            const card = document.createElement('div');
            card.className = 'repo-card';

            const coverUrl = await getCoverImage(repo.name);
            
            const imgHtml = coverUrl 
                ? `<img src="${coverUrl}" class="repo-cover" alt="${repo.name} Cover">` 
                : `<div class="repo-cover" style="display:flex; align-items:center; justify-content:center; color:#30363d; background:#010409;"><span>Kein Cover</span></div>`;

            let downloadHtml = '';
            try {
                const relResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/releases/latest`);
                if (relResponse.ok) {
                    const release = await relResponse.json();
                    downloadHtml = `<a href="${release.html_url}" target="_blank" class="btn-download">Latest Release</a>`;
                }
            } catch (e) {}

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
        container.innerHTML = `<div class="status-msg">Fehler: ${error.message}</div>`;
    }
}

fetchRepos();