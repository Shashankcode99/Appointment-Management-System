# Appointment-Management-System

# Initial Command
  - npm i

# Create a firebase account 
   - Link : https://firebase.google.com/
 
# Setup DB json file
 - Go to Project Setting -> Service Accounts
 - Copy the json file
 - paste it in the root of you project
 - chnage the path location as per your project (inside db.js)

# Endpoint List
 - LOGIN - http://localhost:8080/api/login
 - REGISTER - http://localhost:8080/api/register
 - GET ALL  - http://localhost:8080/api/appointments
 - GET BY ID  - http://localhost:8080/api/appointments/:id
 - POST  - http://localhost:8080/api/appointments
 - PUT  - http://localhost:8080/api/appointments/:id
 - DELETE  - http://localhost:8080/api/appointments/:id

# Setup script in the package,json file
 - "start": "nodemon app.js"

# To start the server run command
 - npm run start
