# Angular and GitHub Pages

## Overview
Want to host your Angular website? Thanks to GitHub it's super easy. By the end of this guide you will know how to how to host your own Angular website, for free!

---

## Pre requesties
1. A GitHub account
2. An Angular website, that is in being stored in a GitHub repository

---

## How

### Setting up Angular project

Do this
`ng build --prod --output-path docs --base-href "/chatAngular/"`
`ng build --prod --output-path docs --base-href "/"`

Result
a docs folder, with index.html

post processing
add 404.html

use web server for chrome, serve docs folder, it should work locally.
no push to to git hub repo.

---

### Enable GitHub Pages
To use GitHub pages with your Angular repo we need to enable it. Go to your repo, and then the settings tab.

![A GitHub Repo](images\angular-repo-github-code-page.jpg)

In the settings tab, scroll down to the section, *GitHub Pages*

![GitHub Pages Settings](images\angular-repo-github-pages-settings-turn-on.jpg)

In the source section we need to pick the folder that will be used to publish the angular website. We ill choose the /docs folder. Click save and GitHub actions will try to publish your website from this folder. If you don't have a docs folder yet, or an index.html file in the docs folder, the website will not deploy.

![GitHub Pages Settings](images\angular-repo-github-pages-settings.jpg)

Your website should now be deployed, and a link shown to you. I would recommend enforcing https, to ensure you get given a padlock, by Chrome, otherwise it will be shown as insecure.


---

### Knowing your website address 
The repo name you choose in GitHub will determine your websites name. So if you had a repo names *myBlog*, anbd you username was *bealesd*, your repo url would like this

     https://github.com/bealesd/myBlog

Your deployed website url is then generated automatically from this. It would be

     https://bealesd.github.io/myBlog

If you look at figure 1 (below), this summarizes how your repo url is linked to your website url.
<br /> 
<br /> 
#### Figure 1 - naming conventions
    https://github.com/{{username}}/{{repoName}}

    https://{{username}}.github.io/{{repoName}}/


---

### I want a website at my root

---

index
404

##has it actually worked
-check url updates
-can you enter it directly

ng build --prod --output-path docs --base-href "/chatAngular/"
`ng build --prod --output-path docs --base-href "/"`