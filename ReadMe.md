# Plant Disease Detection Mobile App

This repository contains the code for an AI-driven mobile application designed to detect plant diseases. Follow the instructions below to set up and run the application on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Viewing on a Mobile Device](#viewing-on-a-mobile-device)

## Prerequisites

Before you begin, ensure you have these installed:

- Node.js and npm (Node Package Manager)
- Python 3.x
- Git
- Expo CLI (if you plan to view on a mobile device)

## Installation

To get started, clone the repository to your local machine:

```bash
git clone <repository_url>
```

Navigate into the main application directory:

```bash
cd PlantDiseaseApp
```

Install the necessary Node.js dependencies for the frontend:

```bash
npm install
```

Now, navigate to the backend directory to install its dependencies:

```bash
cd backend/src/
npm install express
```

## Running the Application

### 1. Place the AI Model

Download the `vgg16_finetuned_model.h5` file and place it in the following directory:
Link: https://www.kaggle.com/models/aminechouaieb/vgg16_finetuned/
```
PlantDiseaseApp/backend/models/
```

### 2. Start the Flask Backend Server

From the `PlantDiseaseApp/backend/models` directory, run the Flask server:

```bash
python model_api.py
```

### 3. Start the Node.js Server

From the `PlantDiseaseApp/backend/src/` directory, run the Node.js server:

```bash
node server.js
```

### 4. Start the React Native Expo App

Navigate back to the root of the `PlantDiseaseApp` directory:

```bash
cd ../..
```

Then, start the Expo application:

```bash
npm start
```

This will open a new tab in your browser with the Expo Dev Tools. You can use this to run the app in a simulator or on a physical device.

## Viewing on a Mobile Device

To view the application on your physical mobile device:

1. Download and install the **Expo Go** app from your device's app store (available on both Android and iOS).
2. Open the Expo Go app and scan the QR code displayed in the Expo Dev Tools (which opened when you ran `npm start`).

The app should now load on your device.


