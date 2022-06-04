# Server

## How to run locally

### Database

-   Navigate to [MongoDB website](https://account.mongodb.com/).
-   Create a free account or log in.
-   Create a free cluster ([see how](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/)).
-   Add a new password authenticated database user in the `Database Access` tab ([see how](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/#add-database-users)). Copy user credentials. They will be needed in the next section.
-   Click `Connect` button next to your deployed cluster name.
-   Select `Connect your application`. Link looking similar to the one below should be displayed:

```
mongodb+srv://<username>:<password>@<mongo_cluster_path>?retryWrites=true&w=majority
```

-   Copy `<mongo_cluster_path>` from displayed link (part between `@` and `?`). It will be needed in the next section.

### Environment variables

Create a file named:

```
.env
```

Add two lines to the created file:

```
PORT=8080
CLIENT_URL=http://localhost:4200
```

Add three lines with values from the previous section to the created file:

```
MONGO_USER=<username>
MONGO_PASSWORD=<password>
MONGO_PATH=<mongo_cluster_path>
```

Save the file.

### Building and running the project

Install dependencies by running in your terminal:

```
npm install
```

Build and run the project by running in your terminal:

```
npm run prod
```
