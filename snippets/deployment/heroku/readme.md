https://devcenter.heroku.com/articles/heroku-cli

### Configuring the project

1. There must be a `package.json` file in the root directory. Heroku will automatically run `npm start` (in the absence of a Procfile), so you must make sure that that script doesn't run any system-level packages like using `nodemon`.
** To troubleshoot package dependencies, on local command line, type `rm -rf node_modules; npm i --production`. Then try running the app locally by typing `heroku local web`. If a dependency is missing from your `package.json` then you'll see an error that says which module cannot be found.
2. In `package.json`, specify the version of node: `"engines": { "node": "10.x" }`
3. In `package.json`, add a script for heroku to build the project and generate the `bundle.js` file: `"scripts": { "heroku-postbuild": "webpack -p" }`
4. If you have any config vars (like in secrets.js), you'll have to set them on heroku in a different way (b/c you don't want to check in the secrets.js file)
https://devcenter.heroku.com/articles/config-vars
Set a config var:
`heroku config:set GITHUB_USERNAME=joesmith S3_KEY=8N029N81 S3_SECRET=9s83109d3+583493190`
Get a config var:
`heroku config:get GITHUB_USERNAME`
Remove a config var:
`heroku config:unset GITHUB_USERNAME`

For Node, you can access these variables via `process.env.VARNAME`

### Set up Heroku CLI

1. Need Git installed
2. For ubuntu16+: `sudo snap install --classic heroku`
Or `curl https://cli-assets.heroku.com/install.sh | sh` . Useful for Docker containers
These versions will auto-update. But can also do a third way that doesn't auto update by using apt-get.

3. Verify installation. `heroku --version`

### Prep

1.  Set up the [Heroku command line tools](https://devcenter.heroku.com/articles/heroku-cli)
2.  `heroku login` . Login info will be stored in `~.netrc` file.
Sign up for a free heroku account if you haven't already
3.  Add a git remote for heroku:

* **If you're creating a new app...**

  1. cd to the project directory
  2.  `heroku create` or `heroku create your-app-name` if you have a name in mind.
  Verify a heroku target was created: `git remote -v`
  ** If you want to change your app name, run `heroku apps:rename newname`
  3. `git push heroku master` . If successful, app is now deployed
  Run `heroku ps:scale web=1` to verify that at least one instance of the app is running.
  Go to the provided URL in your browser. Ex: `https://guarded-harbor-65788.herokuapp.com/`
  Or you can do `heroku open` which will open the url of the app
  4.  `heroku addons:create heroku-postgresql:hobby-dev` to add ("provision") a postgres database to your heroku dyno

  For more info about using Postgres on heroku see: https://devcenter.heroku.com/articles/heroku-postgresql

  https://devcenter.heroku.com/articles/getting-started-with-nodejs

* **If you already have a Heroku app...**

  1.  `heroku git:remote your-app-name` You'll need to be a collaborator on the app.

### When you're ready to deploy

https://devcenter.heroku.com/categories/deployment

#### Option A: Automatic Deployment via Continuous Integration

(_**NOTE**: This step assumes that you already have Travis-CI testing your code._)

CI is not about testing per se – it's about _continuously integrating_ your changes into the live application, instead of periodically _releasing_ new versions. CI tools can not only test your code, but then automatically deploy your app. Boilermaker comes with a `.travis.yml` configuration almost ready for deployment; follow these steps to complete the job.

1.  Run `git checkout master && git pull && git checkout -b f/travis-deploy` (or use some other new branch name).
2.  Un-comment the bottom part of `.travis.yml` (the `before_deploy` and `deploy` sections)
3.  Add your Heroku app name to `deploy.app`, where it says "YOUR HEROKU APP NAME HERE". For example, if your domain is `cool-salty-conifer.herokuapp.com`, your app name is `cool-salty-conifer`.
4.  Install the Travis CLI tools by following [the instructions here](https://github.com/travis-ci/travis.rb#installation).
5.  Run `travis encrypt $(heroku auth:token) --org` to encrypt your Heroku API key. _**Warning:** do not run the `--add` command suggested by Travis, that will rewrite part of our existing config!_
6.  Copy-paste your encrypted API key into the `.travis.yml` file under `deploy.api_key.secure`, where it says "YOUR ENCRYPTED API KEY HERE".
7.  `git add -A && git commit -m 'travis: activate deployment' && git push -u origin f/travis-deploy`
8.  Make a PR for the new branch, get it approved, and merge it into master.

That's it! From now on, whenever `master` is updated on GitHub, Travis will automatically push the app to Heroku for you.

#### Option B: Manual Deployment from your Local Machine

Some developers may prefer to control deployment rather than rely on automation. Your local copy of the application can be pushed up to Heroku at will, using Boilermaker's handy deployment script:

1.  Make sure that all your work is fully committed and pushed to your master branch on Github.
2.  If you currently have an existing branch called "deploy", delete it now (`git branch -d deploy`). We're going to use a dummy branch with the name "deploy" (see below), so if you have one lying around, the script below will error
3.  `npm run deploy` - this will cause the following commands to happen in order:

* `git checkout -b deploy`: checks out a new branch called "deploy". Note that the name "deploy" here isn't magical, but it needs to match the name of the branch we specify when we push to our heroku remote.
* `webpack -p`: webpack will run in "production mode"
* `git add -f public/bundle.js public/bundle.js.map`: "force" add the otherwise gitignored build files
* `git commit --allow-empty -m 'Deploying'`: create a commit, even if nothing changed
* `git push --force heroku deploy:master`: push your local "deploy" branch to the "master" branch on heroku
* `git checkout master`: return to your master branch
* `git branch -D deploy`: remove the deploy branch

Now, you should be deployed!

Why do all of these steps? The big reason is because we don't want our production server to be cluttered up with dev dependencies like webpack, but at the same time we don't want our development git-tracking to be cluttered with production build files like bundle.js! By doing these steps, we make sure our development and production environments both stay nice and clean!
