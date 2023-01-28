from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from user_face.models import User
from user_face.serializers import UserSerializer
# Create your views here.


from face_recognition import load_image_file, face_locations, face_encodings, face_distance
#from .models import User
#from .serializers import UserSerializer
from numpy import fromstring
import base64
from rest_framework.decorators import api_view

@csrf_exempt
@api_view(('POST',))
def recognize(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        faceId = data['faceId']
        cur_encodings = data['img']
        cur_user = User.objects.filter(id=faceId).first()
        #user = UserSerializer.serialize(cur_user)
        #print(user)
        #det_img        = load_image_file(img_file)
        #cur_encodings   = face_encodings(cur_encodings)
        decoded_data=base64.b64decode((cur_encodings))
        #write the decoded data back to original format in  file
        img_file = open('image.jpeg', 'wb')
        img_file.write(decoded_data)
        img_file.close()

        det_img         = load_image_file('image.jpeg')
        cur_encodings      = face_encodings(det_img)
        face_encoding   = cur_user.face_encoding[1:-1]
        face_encoding   = fromstring(face_encoding, dtype=float, sep=' ')
        known_face_encodings    = [
                face_encoding
        ]
        faces           = []
        TOLERANCE       = 0.55
        for encoding in cur_encodings:
            face_distances  = face_distance(known_face_encodings, encoding)
            for dis in face_distances:
                if dis<=TOLERANCE:
                    faces.append=(faceId)
                else:
                    faces.append('unknown')
        return Response({
            'num of faces': len(cur_encodings),
            'examinee_present': faceId in faces,
            'faces': faces,
        })
    