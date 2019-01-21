# WebAppSkeleton
Skeleton for creating a Single Page App (client & server). This project is meant to be a lean and highly customizable starting point for rapid prototyping.

*Includes:*
* React with hooks
* Redux
* Express
* Babel
* Webpack
* Jest

*Snippets for integrating:*
* Postgres
* Sequelize
* Web sockets (client & server)
* User Authentication (client & server)
* Misc utilities and libraries

## Starting a project

1. Create a new empty github repo for your project
2. Clone that repo locally and `cd` into it
3. Set WebAppSkeleton as a remote upstream source (to be able to pull updates from it):
`git remote add upstream git@github.com:brandonjyee/WebAppSkeleton.git`
or `git remote add upstream https://github.com/brandonjyee/WebAppSkeleton.git`
You can verify with: `git remote -v`
4. `git pull upstream master` to pull the source from WebAppSkeleton
5. `git push origin master` to push up to your new repo

## Test that it's working

1. `npm i` to install all the npm packages
2. Run `npm run start-dev` and go to `localhost:8080` in your browser to see that the default page loads
