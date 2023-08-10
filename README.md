# pointandgo-backend
&nbsp;
## LANCER LE PROJET EN LOCAL :
cloner le projet : <br>
```$ git clone URLprojet```  <br>
se déplacer dans le sous-dossier : <br>
```$ cd "nom du dossier"```  <br>
basculer sur la branche dev : <br>
```$ git checkout dev```  <br>
ré-installer npm : <br> 
```$ npm init -y``` <br>
ré-installer les packages :<br>
```$ npm i``` <br>
ne pas oublier de créer un fichier .env avec les API Keys <br>
&nbsp;&nbsp;&nbsp;
## CREER UNE NOUVELLE BRANCHE :
basculer sur la branche dev : <br>
```$ git checkout dev ``` <br>

actualiser sa branche local à partir de la branche distante : <br>
```$ git fetch --all ``` <br>
actualiser sa branche local ET récupérer des données à partir de la branche distante : <br>
```$ git pull ``` <br>

créer une nouvelle branche à partir de la branche "dev" : <br>
```$ git branch "PG-1_prenom"	``` <br>
```$ git checkout "PG-1_prenom"	```<br>
ou <br>
	```$ git checkout -b "PG-1_prenom" ``` <br>
ou <br>
``` $ git checkout -b "PG-1_prenom" origin/dev ``` <br>

## FAIRE UN REBASE de DEV sur sa branche :
basculer sur la branche dev et faire un git pull  <br>
vérifier le bon fonctionnement avec git status  <br>
basculer sur sa branche avec un git checkout  <br>
installer l'extension VS Code "git graph" (de mhutchie)  <br>
cliquer sur "git graph" dans le menu bas de VS Code pour ouvrir l'extention "git graph" dans un onglet  <br>
dans le graphique, faire un clic droit sur "dev" puis cliquer sur "Rebase current branch on Branch..."<br>
vérifier le bon fonctionnement avec git status  <br>
= mes commits sont au-dessus de l'historique et j'ai récupéré les commits de dev  <br>


