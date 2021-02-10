## Build

### SPA

ng build --prod --output-path docs --base-href "/"

### Static
 0. ng add @scullyio/init
 1. delete docs folder
 2. npm run build:scully
 3. npm run scully
 4. or npm run scully -- --scanRoutes

 N.B copy index.html as 404.html, keep robots.txt and sitemap.txt