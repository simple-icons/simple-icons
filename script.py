# python script for webscraping the colours then appening all colours to the files
import os
from urllib.request import urlopen as u_req
from bs4 import BeautifulSoup as soup

url = "https://simpleicons.org/"
u_client = u_req(url)
page_html = u_client.read()
u_client.close()

page_soup = soup(page_html, "html.parser")
icons_light = page_soup.findAll("li", {"class": "grid-item--light"})
icons_dark = page_soup.findAll("li", {"class": "grid-item--dark"})
icons = icons_light + icons_dark

for file in os.listdir("./icons"):
    with open(os.path.join("./icons", file), "r") as f:
        file_name = f"/icons/{file}"
        file_content = f.read()
        for icon in icons:
            if icon.a.get("href").lower() == file_name:
                file_split = file_content.split("xmlns")
                if len(file_split) != 2:
                    print(len(file_split), file)
                with open(os.path.join("./icons", file), "w") as madness:
                    madness.write(f"{file_split[0]}fill=\"{icon.p.getText()}\" xmlns{file_split[1]}")