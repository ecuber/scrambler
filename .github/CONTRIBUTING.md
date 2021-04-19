# Setting up for contributing/hosting locally
The tech stack for Scrambler is Typescript/Node.js, discord.js, and MongoDB. To contribute, there are some basic setup steps necessary to keep things consistent with the repository.

## Installing dependencies
We recommend running all of the provided installation commands to ensure consistent configuration.

If you don't have yarn, run 
```
$ npm install -g yarn
```

Then, install the required packages
```
$ yarn global add typescript nodemon ts-node
```

After installation, from the project root run
``` 
$ yarn install
```
to install project dependencies.

## Bot user
You will need to create a bot user account to test from. See https://discord.com/developers/ for more info on making a bot account.

Save the token somewhere, you'll need it in a moment.

## MongoDB
Scrambler runs on MongoDB, and as such you will need to create a mongodb database to develop from. You may pick either the local installation or the remote alternative, either one works. 


### Local installation
The first step is installing MongoDB Community Edition locally (you may also create a remote instance using Atlas, which will be touched on later).
Please see their [documentation](https://docs.mongodb.com/manual/installation/) for help installing. If you already have used Mongo locally you should be able to safely skip this step.

Remember that the default URI to the local DB is localhost:27017. 

### Atlas (remote DB)
If you prefer not to create a local database, you will still need somewhere to store bot data. An alternative is creating a cloud DB instance using any MongoDB service, but the first-party Atlas service has a good free tier and is actually where the production server runs.
To do this, create an account at this link https://www.mongodb.com/cloud/atlas

Once you create your account, make a new project called "Scrambler" on a "Shared Cluster" (which is free forever). 
1. Name the Cluster "Scrambler" and configure the other options as you see fit (but definitely make sure everything is free-- that configuration will be more than enough)
2. After your cluster has been privisioned, go to the Clusters page of the Atlas website and under Scrambler click "CONNECT". 
3.  You'll want to whitelist your current IP address, create an Admin user and set a password for them.
4. Create a DB admin user.
    * Pick "Application" as the connection method and record the connection string it provides.



### Compass
The easiest way to get develop with Mongo is by installing MongoDB Compass which provides a lovely GUI and easy DB access. 
Compass is also installed by default when you install MongoDB locally, but if you need to install it separately please see https://www.mongodb.com/products/compass

#### Local DB
Compass knows the default DB credentials, so just clicking the Connect button will automatically connect you to the DB. You may also put `localhost:27017` in the box, then click connect.

#### Remote DB
Connect to your Atlas MongoDB by pasting the connection string should look something like this `mongodb+srv://<username>:<password>@scrambler.xsb55.mongodb.net/Scrambler?&w=majority&retryWrites=true`. Ensure you use the correct credentials.


## Creating development environment variables
Now that we're all set up, we can create the environment variables. To do so, make a new file in the project root called `.env`. In the file, add these contents
```
TOKEN=paste your test bot's token here
MONGO_URI=paste the link to your mongodb here
```

At this point, we should be all set up! Run this command to run the program to your bot user.
```
$ yarn start
```

To create a production build, run 
```
$ yarn build
```
and then to run it, do
```
$ yarn serve
```


## Contributing notes
### Code style
Scrambler is using the [**standard**](https://standardjs.com/rules.html) code style ruleset. We highly recommend using ESLint's default formatting and syntax highlighting so as to minimize friction when making pull requests.
### Using Nodemon
Nodemon is a great development tool that automatically rebuilds the typescript and reloads the running process everytime you save changes to a file in the src/ directory. Definitely take advantage of this setup when you work on anything! 
### Pull requests
Please give a (brief) description of the changes you've made when making pull requests to the repository. If making breaking changes please describe the new functionality and how I can test them so I can approve the request. For major changes discuss them with ecuber (Elijah) before working too much to ensure there isn't any conflict.