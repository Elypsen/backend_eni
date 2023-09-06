# Installation

Avec ou sans Docker, vous devez créer votre propre `.env` en vous basant sur le fichier `.env.dist`

## Avec Docker

Si vous êtes sur Windows, installer Docker n'est pas très simple.
Heureusement, @Elypsen a fait un petit guide pour vous aider à l'installer. Vous pouvez le trouver [ici](docs/docker-windows-walkthrough.md).

La procédure de @Elypsen est uniquement pour Windows. Si vous êtes sur Linux ou Mac, vous pouvez passer cette étape.

Une fois la procédure de @Elypsen terminée, vous pouvez installer Docker en vous rendant sur le site officiel : https://docs.docker.com/get-docker/

Modifier le fichier `.env` pour mettre les bonnes valeurs pour les variables suivantes :

```sh
MONGO_URI=mongodb://db/express_brains
```

Créer le volume pour la base de donnée en tapant la commande `docker volume create mongo_db`

Executer la commande `docker-compose  up --build --force-recreate` pour démarrer le projet.

Pour finir, il faut créer la base de donnée avec des données de test.

Executer la commande `docker-compose exec app node flush_mongoose.js`

Le projet sera alors disponible sur http://localhost:3000 et l'API REST sur http://localhost:3000/docs 🎉

## Sans Docker

🚨Ce projet est compatible avec la version 16 de Node. Vous pouvez utiliser `nvm` pour utiliser la bonne version.

Une fois que le `npm install` a fonctionné, il faut créer la base de donnée.
Pour ça, vous devez démarrer mongodb. Si vous n'avez pas modifié le port ( 27017 ) et pas défini d'utilisateur, vous avez juste à lancer le script "flush_mongoose.js" en tapant la commande `node flush_mongoose.js` dans votre terminal.

Vous devriez avoir la sortie console suivante :

```shell
Database flushing...
Database cleared
Database seeding...
```

Une fois fait, vous pouvez démarrer le projet en faisant un `npm start`.

Le projet sera alors disponible sur http://localhost:3000 et l'API REST sur http://localhost:3000/docs 🎉
