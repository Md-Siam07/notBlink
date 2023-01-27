# notBlink

To run !Blink, first clone this repository (for hackathon: branch: dev-rudro, chunk, frontend_rework, dev, snapshot)
Run the node backend:
-cd server
-npm i
-node app.js
Run peerjs:
-npm i peer -g
-peerjs --port 3001

Run the django backend:
-cd Blink_Django_Backend/face_recognition_api_master
-python manage.py run server

Run the frontend:
-cd frontend
-npm i
-ng serve -o

#Tasks done for hackathon:
1. Sending video footage (evidences) as chunk data instead of complete blob, making it eligible to run under poor network bandwidth
2. Offline sync of footage by caching in case of data disconnection
3. Management of overflooding notifications
4. Face recognition
5. Web conferencing
