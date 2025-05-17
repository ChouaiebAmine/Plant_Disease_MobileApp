from flask import Flask, request, jsonify
import tensorflow as tf
import keras
import numpy as np
from PIL import Image
import io
import base64
import os
from tensorflow.keras.applications.vgg16 import preprocess_input
app = Flask(__name__)



# labels
CLASS_LABELS = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy'
]

#treatment recommendations 
DISEASE_TREATMENTS = {
  'Apple___Apple_scab': [
    'Remove and destroy fallen leaves to reduce fungal spores',
    'Apply fungicides during the growing season, starting at bud break',
    'Prune trees to improve air circulation',
    'Plant scab-resistant apple varieties when possible'
  ],
  'Apple___Black_rot': [
    'Prune out dead or diseased branches',
    'Remove mummified fruits from the tree and ground',
    'Apply fungicides from bud break until harvest',
    'Maintain good sanitation in the orchard'
  ],
  'Apple___Cedar_apple_rust': [
    'Remove nearby cedar trees if possible (the alternate host)',
    'Apply fungicides starting at bud break',
    'Plant rust-resistant apple varieties',
    'Remove galls from cedar trees within a quarter-mile radius'
  ],
  'Cherry_(including_sour)___Powdery_mildew': [
    'Apply fungicides at the first sign of disease',
    'Prune trees to improve air circulation',
    'Avoid excessive nitrogen fertilization',
    'Remove and destroy infected plant parts'
  ],
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': [
    'Rotate crops with non-host plants',
    'Plant resistant hybrids',
    'Apply foliar fungicides',
    'Practice good field sanitation by plowing under crop residue'
  ],
  'Corn_(maize)___Common_rust_': [
    'Plant rust-resistant corn hybrids',
    'Apply fungicides early in the season',
    'Monitor fields regularly for early detection',
    'Avoid late planting dates'
  ],
  'Corn_(maize)___Northern_Leaf_Blight': [
    'Plant resistant hybrids',
    'Rotate crops with non-host plants',
    'Apply fungicides when disease first appears',
    'Practice good field sanitation'
  ],
  'Grape___Black_rot': [
    'Remove mummified berries and infected leaves',
    'Apply fungicides from bud break until veraison',
    'Prune to improve air circulation',
    'Maintain good canopy management'
  ],
  'Grape___Esca_(Black_Measles)': [
    'Remove and destroy infected vines',
    'Avoid pruning during wet weather',
    'Protect pruning wounds with fungicides or sealants',
    'Maintain vine vigor with proper nutrition and irrigation'
  ],
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': [
    'Apply fungicides preventatively',
    'Improve air circulation through proper pruning',
    'Remove infected leaves and destroy them',
    'Avoid overhead irrigation'
  ],
  'Orange___Haunglongbing_(Citrus_greening)': [
    'Remove and destroy infected trees',
    'Control the Asian citrus psyllid vector with insecticides',
    'Plant disease-free nursery stock',
    'Maintain tree health with proper nutrition'
  ],
  'Peach___Bacterial_spot': [
    'Apply copper-based bactericides early in the growing season',
    'Prune during dry weather to improve air circulation',
    'Plant resistant varieties',
    'Avoid overhead irrigation'
  ],
  'Pepper,_bell___Bacterial_spot': [
    'Use disease-free seeds and transplants',
    'Apply copper-based bactericides',
    'Rotate crops with non-host plants',
    'Avoid working with plants when they are wet'
  ],
  'Potato___Early_blight': [
    'Apply fungicides preventatively',
    'Practice crop rotation',
    'Remove volunteer potato plants',
    'Ensure adequate plant nutrition'
  ],
  'Potato___Late_blight': [
    'Apply fungicides before symptoms appear',
    'Plant resistant varieties',
    'Destroy cull piles and volunteer plants',
    'Harvest tubers after vines have died and the soil is dry'
  ],
  'Squash___Powdery_mildew': [
    'Apply fungicides at the first sign of disease',
    'Plant resistant varieties',
    'Provide good air circulation',
    'Avoid overhead irrigation'
  ],
  'Strawberry___Leaf_scorch': [
    'Remove infected leaves',
    'Apply fungicides preventatively',
    'Ensure good air circulation',
    'Avoid overhead irrigation'
  ],
  'Tomato___Bacterial_spot': [
    'Use disease-free seeds and transplants',
    'Apply copper-based bactericides',
    'Rotate crops with non-host plants',
    'Avoid working with plants when they are wet'
  ],
  'Tomato___Early_blight': [
    'Remove lower infected leaves',
    'Apply fungicides preventatively',
    'Mulch around plants',
    'Ensure adequate plant spacing'
  ],
  'Tomato___Late_blight': [
    'Apply fungicides before symptoms appear',
    'Remove and destroy infected plants',
    'Avoid overhead irrigation',
    'Plant resistant varieties'
  ],
  'Tomato___Leaf_Mold': [
    'Improve air circulation',
    'Reduce humidity in greenhouses',
    'Apply fungicides preventatively',
    'Remove and destroy infected leaves'
  ],
  'Tomato___Septoria_leaf_spot': [
    'Remove infected leaves',
    'Apply fungicides preventatively',
    'Practice crop rotation',
    'Mulch around plants to prevent soil splash'
  ],
  'Tomato___Spider_mites Two-spotted_spider_mite': [
    'Apply miticides or insecticidal soap',
    'Increase humidity around plants',
    'Introduce predatory mites',
    'Regularly spray plants with water to dislodge mites'
  ],
  'Tomato___Target_Spot': [
    'Apply fungicides preventatively',
    'Improve air circulation',
    'Remove infected leaves',
    'Avoid overhead irrigation'
  ],
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': [
    'Control whitefly vectors with insecticides',
    'Use reflective mulches to repel whiteflies',
    'Plant resistant varieties',
    'Remove and destroy infected plants'
  ],
  'Tomato___Tomato_mosaic_virus': [
    'Remove and destroy infected plants',
    'Wash hands and tools after handling infected plants',
    'Control aphid vectors',
    'Plant resistant varieties'
  ]
}

print("Loading model")
model = tf.keras.models.load_model("Plant_Disease_MobileApp/PlantDiseaseApp/backend/models/vgg16_finetuned.h5")
#model.allocate_tensors()
print("Model loaded successfully!")

@app.route('/predict', methods=['POST'])
def predict():
    #check model
    if model is None:
        return jsonify({'error': 'Model could not be loaded. Please check server logs.'}), 500
    
    #get image from request
    if 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        #decode base64 image
        image_data = base64.b64decode(request.json['image'])
        image = Image.open(io.BytesIO(image_data))
        
        #preprocess the image
        image = image.resize((224, 224))
        image_array = np.array(image) 
        
        if image_array.ndim == 2: # Grayscale
          image_array = np.stack((image_array,)*3, axis=-1)
        elif image_array.shape[-1] == 4: # RGBA
          image_array = image_array[..., :3] # Keep only RGB
        # apply VGG preprocessing
        image_array = preprocess_input(image_array) 
        image_array = np.expand_dims(image_array, axis=0)
        
        #make prediction
        predictions = model.predict(image_array)
        
        # Get the predicted class
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = CLASS_LABELS[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])
        
        # Extract plant and disease
        parts = predicted_class.split('___')
        plant = parts[0].replace('_', ' ')
        disease = parts[1].replace('_', ' ') if len(parts) > 1 else ''
        is_healthy = disease.lower() == 'healthy'
        
        # Get treatment recommendations if the plant is not healthy
        treatment = DISEASE_TREATMENTS.get(predicted_class, []) if not is_healthy else []
        
        return jsonify({
            'isHealthy': is_healthy,
            'plant': plant,
            'disease': '' if is_healthy else disease,
            'confidence': confidence,
            'treatment': treatment
        })
    
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    if model is None:
        return jsonify({'status': 'unhealthy', 'message': 'Model failed to load'}), 500
    return jsonify({'status': 'healthy', 'message': 'Model API is running'})

@app.route('/extract-model', methods=['GET'])
def extract_model():
    try:
        if os.path.exists('Plant_Disease_MobileApp/PlantDiseaseApp/backend/models/vgg16_finetuned.h5'):
            # Load the model
            temp_model = tf.keras.models.load_model('Plant_Disease_MobileApp/PlantDiseaseApp/backend/models/vgg16_finetuned.h5', compile=False)
            
            # Save architecture
            model_json = temp_model.to_json()
            with open('model_architecture.json', 'w') as f:
                f.write(model_json)
            
            # Save weights
            temp_model.save_weights('model_weights.h5')
            
            # Save in SavedModel format
            tf.saved_model.save(temp_model, 'saved_model_dir')
            
            return jsonify({
                'success': True,
                'message': 'Model architecture and weights extracted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'vgg16_model.h5 file not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error extracting model: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
