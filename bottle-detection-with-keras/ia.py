import numpy as np
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers.core import Dense
from keras.models import model_from_json
import numpy as np
import os
import cv2
from shutil import copyfile
from tkinter import *
from tkinter import messagebox
from tkinter import filedialog as fd
from colorthief import ColorThief
from keras.optimizers import Adam
from keras.callbacks import EarlyStopping


url = "C:/Users/Ramon/Documents/Politécnica/Decimo/SOA/Corte 3/bottle-detection-with-keras/1.jpg"


def select():
    ima = fd.askopenfilename()
    copyfile(ima, url)


def getData():
    ruta = "dataset/"
    archivos = os.listdir(ruta)
    labels = []
    caracteristicas = []
    for archivo in archivos:
        datos = []
        # print(archivo)
        img = cv2.imread(ruta+archivo)
        color_thief = ColorThief(ruta+archivo)
        # get the dominant color
        color_dominante = color_thief.get_color(quality=1)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (7, 7), 255)

        t, dst = cv2.threshold(
            blur, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_TRIANGLE)

        canny = cv2.Canny(dst, 50, 150)

        (contornos, _) = cv2.findContours(canny.copy(),
                                          cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        cv2.drawContours(img, contornos, -1, (0, 0, 255), 2, cv2.LINE_AA)

        (x, y, w, h) = cv2.boundingRect(contornos[-1])

        imagen = cv2.rectangle(img.copy(), (x, y), (x+w, y+h), (0, 255, 0), 2)

        areaCanny = cv2.contourArea(contornos[-1])
        perimetroCanny = cv2.arcLength(contornos[-1], True)
        area = w * h
        perimetro = (2*h+2*w)

        datos.append(areaCanny)
        datos.append(perimetroCanny)
        datos.append(area)
        datos.append(perimetro)
        datos.append(color_dominante[0])  # R
        datos.append(color_dominante[1])  # G
        datos.append(color_dominante[2])  # B
        if(archivo.find("latacoca") >= 0):
            labels.append([1, 0])
        elif(archivo.find("latapepsi") >= 0):
            labels.append([0, 1])
        caracteristicas.append(datos)
    c = np.array(caracteristicas)
    a = np.array(labels)
    return c, a


def targetData():
    datos = []
    caracteristicas = []
    img = cv2.imread('1.jpg')

    color_thief = ColorThief("1.jpg")
    color_dominante = color_thief.get_color(quality=1)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 255)

    t, dst = cv2.threshold(
        blur, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_TRIANGLE)

    canny = cv2.Canny(dst, 50, 150)

    (contornos, _) = cv2.findContours(canny.copy(),
                                      cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    cv2.drawContours(img, contornos, -1, (0, 0, 255), 2, cv2.LINE_AA)

    (x, y, w, h) = cv2.boundingRect(contornos[-1])

    imagen = cv2.rectangle(img.copy(), (x, y), (x+w, y+h), (0, 255, 0), 2)

    areaCanny = cv2.contourArea(contornos[-1])
    perimetroCanny = cv2.arcLength(contornos[-1], True)
    area = w * h
    perimetro = (2*h+2*w)

    datos.append(areaCanny)
    datos.append(perimetroCanny)
    datos.append(area)
    datos.append(perimetro)
    datos.append(color_dominante[0])  # R
    datos.append(color_dominante[1])  # G
    datos.append(color_dominante[2])  # B

    caracteristicas.append(datos)
    c = np.array(caracteristicas)
#    cv2.imshow("Blanco y Negro", gray)
#    cv2.imshow("Suavizado", blur)
#    cv2.imshow("Contornos", canny)
#    cv2.imshow("Imagen final", imagen)
    return c


def entrenar():

    training_data, target_data = getData()

    model = Sequential()
    model.add(Dense(32, input_dim=7, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(512, activation='relu'))
    model.add(Dense(2, activation='sigmoid'))

    adam = Adam(learning_rate=0.001)

    model.compile(loss='binary_crossentropy',
                  optimizer=adam, metrics=['accuracy'])

    historia_entrenamiento = model.fit(
        training_data, target_data, epochs=10000, validation_split=0.25)

    model.summary()

    historia_entrenamiento_perdidas = np.array(
        historia_entrenamiento.history["loss"])

    sumatoria_perdida = np.sum(historia_entrenamiento_perdidas)

    # EVALUAMOS MODELO
    scores = model.evaluate(training_data, target_data)

    print("Sumatoria: ", sumatoria_perdida)

    print("\n%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))
    print(model.predict(targetData()).round())


  # CASTEAMOS MODELO A JSON
    model_json = model.to_json()
    with open("model.json", "w") as json_file:
        json_file.write(model_json)
    # CASTEAMOS PESOS A HDF5
    model.save_weights("model.h5")
    print("Modelo GUARDADO!")

    plt.plot(historia_entrenamiento.history['loss'])
    plt.title('model loss')
    plt.ylabel('loss')
    plt.xlabel('epoch')
    plt.legend(['train'], loc='upper left')
    plt.show()
def test():

    select()

    training_data, target_data = getData()

    # CARGAMOS EL JSON Y CARGAMOS EL MODELO
    json_file = open('model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)

    # CARGAMOS LOS PESOS EN EL MODELO
    loaded_model.load_weights("model.h5")
    print("Model CARGADO!")

    loaded_model.compile(loss='categorical_crossentropy',
                         optimizer='adam',
                         metrics=['accuracy'])

    scores = loaded_model.evaluate(training_data, target_data)

    print("\n%s: %.2f%%" % (loaded_model.metrics_names[1], scores[1]*100))
    prediccion = loaded_model.predict(targetData())
    print(loaded_model.predict(targetData()))
    if prediccion[0][0] >= 0.50 and prediccion[0][1] <= 0.49:
        print("Lata Coca-Cola 355ml")
        text.set("Lata Coca-Cola 355ml")
    elif prediccion[0][0] <= 0.49 and prediccion[0][1] >= 0.50:
        print("Lata Pepsi 355ml")
        text.set("Lata Pepsi 355ml")
    else:
        print("NO Estoy seguro de la predicción")
        text.set("NO Estoy seguro de la predicción")


raiz = Tk()

text = StringVar()

raiz.title("Red Neuronal")

raiz.geometry("150x150")

botonEntrenar = Button(raiz, text="Entrenar", command=entrenar,
                       font=("ARIAL", 12)).place(x=45, y=43)

botonTestear = Button(raiz, text="Testear", command=test,
                      font=("ARIAL", 12)).place(x=45, y=80)

texto = Label(raiz, textvariable=text).pack()

raiz.mainloop()


# [ [12 3 4], [12 8 7], [4 8 9] ] #training

# [ [1 0], [1 0], [0 1] ] #target
