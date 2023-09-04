# Installation

Vous devez créer votre propre `.env` en vous basant sur le fichier `.env.dist`

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
