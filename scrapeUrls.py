import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE_URL = "https://www.familysearch.org/en/wiki"

def crawlSite(startingUrl):
    visited = set()
    toVisit = [startingUrl]

    while toVisit:
        url = toVisit.pop()
        if url in visited:
            continue

        visited.add(url)
        print(f"Visiting {url}:")

        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        for aTag in soup.find_all('a', href=True):
            href = aTag['href']
            if href.startswith('/en/wiki'):
                fullUrl = urljoin(BASE_URL, href)
                if fullUrl not in visited:
                    toVisit.append(fullUrl)

    return visited

print(crawlSite(BASE_URL))
