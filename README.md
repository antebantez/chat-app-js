## Startguide för chat-app-js


* Börja med att lägga till en .env fil i roten av chat-backend mappen och klistra in följande:

* Fyll sedan i dina egna postgresql inloggningsuppgifter

-----------------------------------

DATABASE_HOST = 'localhost'
DATABASE_USER = 'postgres'
DATABASE_PORT = 5432
DATABASE_PASSWORD = ''
DATABASE_NAME = 'chat_app'

BACKEND_HTTP_PORT = 8000
FRONTEND_HTTP_PORT = 3000

COOKIE_SALT = supersecretsaltstringJAJAJJAJAJAJAJAJAJAJAJJAJAJAJAJJA
PASSWORD_SALT = supersecretpasswordsaltJAJAJAJAJAJAJJA

API_HOST = 'localhost'
API_URL = '/api'


------------------------------------

* Sedan kör 'npm install' i både chat-backend och chat-frontend mappen

* Jag har inte fixat concurrently så FE och BE måste köras igång separat från varsin konsol

* Backend körs igång med 'node server' filen som ligger i chat-backend/server/

* Frontend kör du igång med 'npm run dev' direkt från chat-frontend mappen

-------------------------------------

* För att skapa databasen, kopiera fulla pathen till sql-filen som ligger i chat-backend/db/chatSQL.sql

* #### i postgres-terminal loggar du in och kör \i <path till sql-filen>

* #### Om du använder grafiskt gränssnitt för postgres öppna en sql-editor:
 
  * Kör första queryn för att skapa databasen
 
  * Connecta manuellt till databasen / set as default
 
  * kör resten av sql scriptet

--------------------------------------

* Vill du ha en admin user så får du registrera som vanligt genom FE eller Postman
  och sen ändra rollen med:

  * update users set user_role = 'admin' where user_name = 'admin';
