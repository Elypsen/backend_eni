Procédure de @Elypsen

AVANT TOUTE CHOSE, REDEMARREZ A CHAQUE FOIS QUE L'UNE DES ETAPES VOUS DEMANDERA DE LE FAIRE (ca va faire beaucoup de redemarrage :p )

- activer les sous systeme de windows pour les linux et plateforme de machine virtuelle => activer ou désactiver des fonctionnalité windows
  (vers le bas de la liste)

- assurez vous que la virtualisation dans le bios est activée

- powershell(admin) : wsl --install -d <Distribution> (remplacer distribution par la distribution linux de votre choix)

- si probleme avec le noyau de mise a jour wsl2 : https://learn.microsoft.com/fr-fr/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package

- créé vos identifiants linux

- powershell : wsl -l -v => devrait afficher la distribution que vous avez choisis en version 2

- https://docs.docker.com/desktop/install/windows-install/ : clickez sur le petit bouton pour dl l'installer

- double clique sur l'installer et priere pour ne pas avoir d'erreur :D

apres que ce dernier installer ai fini de travailler vous serez prompt de redémarrer, apres ce redemarrage démarrer docker desktop et créé un compte si vous le desirez :D pret à l'emploi normalement.

