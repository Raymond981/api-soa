from flask import Flask
from flask import jsonify
from flask import request
from keras.models import Sequential
from keras.models import model_from_json
import numpy as np
import base64
import os
import cv2
from werkzeug.utils import secure_filename
from flask_cors import CORS

UPLOAD_FOLDER = ''
app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def targetData():
    datos = []
    caracteristicas = []
    img = cv2.imread('test.jpg')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray,(7,7),255)

    t, dst = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_TRIANGLE)

    canny = cv2.Canny(dst, 50, 150)

    (contornos,_) = cv2.findContours(canny.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    cv2.drawContours(img,contornos,-1,(0,0,255), 2, cv2.LINE_AA)

    (x, y, w, h) = cv2.boundingRect(contornos[-1])

    imagen = cv2.rectangle(img.copy(),(x,y),(x+w,y+h),(0,255,0),2)

    areaCanny = cv2.contourArea(contornos[-1])
    perimetroCanny = cv2.arcLength(contornos[-1],True)
    area = w * h
    perimetro = (2*h+2*w)

    datos.append(areaCanny)
    datos.append(perimetroCanny)
    datos.append(area)
    datos.append(perimetro)

    caracteristicas.append(datos)
    c = np.array(caracteristicas)
    return c

def get_model():
    global loaded_model
    json_file = open('model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)

    # CARGAMOS LOS PESOS EN EL MODELO
    loaded_model.load_weights("model.h5")
    print("Model CARGADO!")

@app.route('/hola', methods=["GET"])
def hola():
    return "hola"

@app.route('/predecir', methods=["POST"])
def predecir():
    global loaded_model
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], "test.jpg"))
    get_model()
    print (loaded_model.predict(targetData()).round())

    return "Done"