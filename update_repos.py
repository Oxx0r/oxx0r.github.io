import requests
import json
import re
import os

# Konfiguration
USERNAME = "oxx0r"
EXCLUDED_REPO = "oxx0r.github.io"
# Der Token wird sicher aus den GitHub Secrets gelesen
TOKEN = os.getenv("GH_TOKEN")

headers = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

def get_latest_release(repo_name):
    """Holt die URL des neuesten Releases, falls vorhanden."""
    url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/releases/latest"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("html_url")
    return None

def get_cover_image(repo_name):
    """Sucht in der README nach dem ersten Bild (Markdown oder HTML)."""
    for branch in ["main", "master"]:
        url = f"https://raw.githubusercontent.com/{USERNAME}/{repo_name}/{branch}/README.md"
        response = requests.get(url)
        if response.status_code == 200:
            text = response.text
            # Suche nach Markdown Bildern ![alt](url)
            md_match = re.search(r"!\[.*\]\((.*?)\)", text)
            if md_match:
                img_url = md_match.group(1)
                return img_url if img_url.startswith("http") else f"https://raw.githubusercontent.com/{USERNAME}/{repo_name}/{branch}/{img_url.lstrip('/')}"
            
            # Suche nach HTML Bildern <img src="url">
            html_match = re.search(r'<img [^>]*src="([^"]*)"', text)
            if html_match:
                img_url = html_match.group(1)
                return img_url if img_url.startswith("http") else f"https://raw.githubusercontent.com/{USERNAME}/{repo_name}/{branch}/{img_url.lstrip('/')}"
    return None

def main():
    print("Starte Repo-Update...")
    url = f"https://api.github.com/users/{USERNAME}/repos?per_page=100&sort=pushed"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Fehler bei der API: {response.status_code}")
        return

    repos = response.json()
    filtered_repos = []

    for repo in repos:
        # Filter: Keine Forks, nicht das eigene Profil-Repo
        if repo["fork"] or repo["name"] == EXCLUDED_REPO:
            continue
        
        print(f"Verarbeite: {repo['name']}")
        
        repo_data = {
            "name": repo["name"],
            "description": repo["description"],
            "html_url": repo["html_url"],
            "cover_image": get_cover_image(repo["name"]),
            "latest_release_url": get_latest_release(repo["name"])
        }
        filtered_repos.append(repo_data)

    # Alphabetisch sortieren
    filtered_repos.sort(key=lambda x: x["name"].lower())

    # Als JSON speichern
    with open("repos.json", "w", encoding="utf-8") as f:
        json.dump(filtered_repos, f, indent=4, ensure_ascii=False)
    
    print(f"Fertig! {len(filtered_repos)} Repos gespeichert.")

if __name__ == "__main__":
    main()