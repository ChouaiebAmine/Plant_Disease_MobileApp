# Plant_Disease_Detection
Final Year Project

### API
# How it Works
The mobile app captures or selects a plant image
The Express backend receives the image and sends it to the Python API
The Python API:
1. Loads your VGG16 model
2. Preprocesses the image (resize to 224x224, normalize)
3. Makes a prediction using your model
4. Returns the result with plant name, disease, confidence, and treatment recommendations
5. The Express backend sends the result back to the mobile app
6. The mobile app displays the diagnosis and treatment recommendations

//__ still working on the Readme file __\\
