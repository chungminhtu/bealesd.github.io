## Build

### SPA

ng build --prod --output-path docs --base-href "/"
 N.B copy index.html as 404.html, keep robots.txt and sitemap.txt

### Static
 0. ng add @scullyio/init
 1. delete docs folder
 2. yarn run build:scully
 3. yarn run scully
 4. or yarn run scully -- --scanRoutes

## Adding a new blog
 1. Run ng g c blog/{{blogName}}
 2. Add new BlogModel to blogIndexes in BlogRepo. Fill in metadata, id must be {{blogName}}
 3. Add route to app-routing.module.ts
 4. Update sitemap.txt and sitemap.xml to include new route /blog/{{blogName}}/index.html
 4. When building, do step 4 in Build>Static