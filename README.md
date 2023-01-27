# notBlink

To run !Blink, first clone this repository (for hackathon: branch: dev-rudro, chunk, frontend_rework, dev, snapshot)
<br><h2>Tasks done for hackathon:</h2>
<br>1. Sending video footage (evidences) as chunk data instead of complete blob, making it eligible to run under poor network bandwidth
<br>2. Offline sync of footage by caching in case of data disconnection
<br>3. Management of overflooding notifications
<br>4. Face recognition
<br>5. Web conferencing

<br><h2>Run the node backend: </h2><br>
-cd server <br>
<br>-npm i
<br>-node app.js
<br><h2>Run peerjs:</h2>
<br>-npm i peer -g
<br>-peerjs --port 3001
<br>
<br><h2>Run the django backend:</h2>
<br>-cd Blink_Django_Backend/face_recognition_api_master
<br>-python manage.py run server

<br><h2>Run the frontend:</h2>
<br>-cd frontend
<br>-npm i
<br>-ng serve -o
<br>
<br><h2>Tasks done for hackathon:</h2>
<br>1. Sending video footage (evidences) as chunk data instead of complete blob, making it eligible to run under poor network bandwidth
<br>2. Offline sync of footage by caching in case of data disconnection
<br>3. Management of overflooding notifications
<br>4. Face recognition
<br>5. Web conferencing
