import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal
} from "react-native"
import colors from "../theme/colors"

const tomatoImage = require("../../public/Plant_Label_Img/Tomato.jpg");
const appleImage = require("../../public/Plant_Label_Img/Apple.jpg");
const cornImage = require("../../public/Plant_Label_Img/Corn.jpg");
const grapeImage = require("../../public/Plant_Label_Img/Grape.jpg");
const potatoImage = require("../../public/Plant_Label_Img/Potato.jpg");
const pepperImage = require("../../public/Plant_Label_Img/Pepper.jpg");
const strawberryImage = require("../../public/Plant_Label_Img/Strawberry.jpg");
const peachImage = require("../../public/Plant_Label_Img/Peach.jpg");
const cherryImage = require("../../public/Plant_Label_Img/Cherry.jpg");
const soybeanImage = require("../../public/Plant_Label_Img/SoyBean.jpg");
const orangeImage = require("../../public/Plant_Label_Img/Orange.jpg");
const blueberryImage = require("../../public/Plant_Label_Img/BlueBerry.jpg");
const raspberryImage = require("../../public/Plant_Label_Img/Raspberry.jpg");
const squashImage = require("../../public/Plant_Label_Img/Squash.jpg");

//treatments
const DISEASE_TREATMENTS = {
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
  ],
  'healthy': [
    'Continue regular maintenance',
    'Water appropriately for the plant type',
    'Fertilize as needed',
    'Monitor for early signs of pests or diseases'
  ]
};

//Plant data
const PLANTS_DATA = [
  {
    id: "1",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: tomatoImage,
    diseases: [
      { name: 'Bacterial_spot', treatmentKey: 'Tomato___Bacterial_spot' },
      { name: 'Early_blight', treatmentKey: 'Tomato___Early_blight' },
      { name: 'Late_blight', treatmentKey: 'Tomato___Late_blight' },
      { name: 'Leaf_Mold', treatmentKey: 'Tomato___Leaf_Mold' },
      { name: 'Septoria_leaf_spot', treatmentKey: 'Tomato___Septoria_leaf_spot' },
      { name: 'Spider_mites Two-spotted_spider_mite', treatmentKey: 'Tomato___Spider_mites Two-spotted_spider_mite' },
      { name: 'Target_Spot', treatmentKey: 'Tomato___Target_Spot' },
      { name: 'Tomato_Yellow_Leaf_Curl_Virus', treatmentKey: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus' },
      { name: 'Tomato_mosaic_virus', treatmentKey: 'Tomato___Tomato_mosaic_virus' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "2",
    name: "Apple",
    scientificName: "Malus domestica",
    image: appleImage,
    diseases: [
      { name: 'Apple_scab', treatmentKey: 'Apple___Apple_scab' },
      { name: 'Black_rot', treatmentKey: 'Apple___Black_rot' },
      { name: 'Cedar_apple_rust', treatmentKey: 'Apple___Cedar_apple_rust' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "3",
    name: "Corn_(maize)",
    scientificName: "Zea mays",
    image: cornImage,
    diseases: [
      { name: 'Cercospora_leaf_spot Gray_leaf_spot', treatmentKey: 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot' },
      { name: 'Common_rust_', treatmentKey: 'Corn_(maize)___Common_rust_' },
      { name: 'Northern_Leaf_Blight', treatmentKey: 'Corn_(maize)___Northern_Leaf_Blight' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "4",
    name: "Grape",
    scientificName: "Vitis vinifera",
    image: grapeImage,
    diseases: [
      { name: 'Black_rot', treatmentKey: 'Grape___Black_rot' },
      { name: 'Esca_(Black_Measles)', treatmentKey: 'Grape___Esca_(Black_Measles)' },
      { name: 'Leaf_blight_(Isariopsis_Leaf_Spot)', treatmentKey: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "5",
    name: "Potato",
    scientificName: "Solanum tuberosum",
    image: potatoImage,
    diseases: [
      { name: 'Early_blight', treatmentKey: 'Potato___Early_blight' },
      { name: 'Late_blight', treatmentKey: 'Potato___Late_blight' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "6",
    name: "Pepper,_bell",
    scientificName: "Capsicum annuum",
    image: pepperImage,
    diseases: [
      { name: 'Bacterial_spot', treatmentKey: 'Pepper,_bell___Bacterial_spot' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "7",
    name: "Strawberry",
    scientificName: "Fragaria × ananassa",
    image: strawberryImage,
    diseases: [
      { name: 'Leaf_scorch', treatmentKey: 'Strawberry___Leaf_scorch' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "8",
    name: "Peach",
    scientificName: "Prunus persica",
    image: peachImage,
    diseases: [
      { name: 'Bacterial_spot', treatmentKey: 'Peach___Bacterial_spot' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "9",
    name: "Cherry_(including_sour)",
    scientificName: "Prunus avium",
    image: cherryImage,
    diseases: [
      { name: 'Powdery_mildew', treatmentKey: 'Cherry_(including_sour)___Powdery_mildew' },
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "10",
    name: "Soybean",
    scientificName: "Glycine max",
    image: soybeanImage,
    diseases: [
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "11",
    name: "Orange",
    scientificName: "Citrus × sinensis",
    image: orangeImage,
    diseases: [
      { name: 'Haunglongbing_(Citrus_greening)', treatmentKey: 'Orange___Haunglongbing_(Citrus_greening)' }
    ]
  },
  {
    id: "12",
    name: "Blueberry",
    scientificName: "Vaccinium corymbosum",
    image: blueberryImage,
    diseases: [
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "13",
    name: "Raspberry",
    scientificName: "Rubus idaeus",
    image: raspberryImage,
    diseases: [
      { name: 'healthy', treatmentKey: 'healthy' }
    ]
  },
  {
    id: "14",
    name: "Squash",
    scientificName: "Cucurbita",
    image: squashImage,
    diseases: [
      { name: 'Powdery_mildew', treatmentKey: 'Squash___Powdery_mildew' }
    ]
  }
]

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [plants, setPlants] = useState(PLANTS_DATA)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState(null)

  const filteredPlants = plants.filter(
    plant =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlantPress = (plant) => {
    setSelectedPlant(plant)
    setModalVisible(true)
  }

  const handleDiseasePress = (disease) => {
    setSelectedDisease(disease)
    setTreatmentModalVisible(true)
  }

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => handlePlantPress(item)}
    >
      <Image
        source={item.image}
        style={styles.plantImage}
        resizeMode="cover"
      />
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{item.name}</Text>
        <Text style={styles.scientificName}>{item.scientificName}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPlants}
          renderItem={renderPlantItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.plantList}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No plants found</Text>
            </View>
          }
        />
      )}


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPlant && (
              <>
                <Text style={styles.modalTitle}>{selectedPlant.name}</Text>
                <Text style={styles.modalSubtitle}>Available Diseases:</Text>
                <FlatList
                  data={selectedPlant.diseases}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleDiseasePress(item)}
                    >
                      <Text style={styles.diseaseItem}>• {item.name.replace(/_/g, ' ')}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Disease Treatment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={treatmentModalVisible}
        onRequestClose={() => setTreatmentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedDisease && (
              <>
                <Text style={styles.modalTitle}>{selectedDisease.name.replace(/_/g, ' ')}</Text>
                <Text style={styles.modalSubtitle}>Treatment Steps:</Text>
                {DISEASE_TREATMENTS[selectedDisease.treatmentKey] ? (
                  <FlatList
                    data={DISEASE_TREATMENTS[selectedDisease.treatmentKey]}
                    renderItem={({ item, index }) => (
                      <Text style={styles.treatmentItem}>{index + 1}. {item}</Text>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : (
                  <Text style={styles.treatmentItem}>No specific treatment information available.</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setTreatmentModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Back to Diseases</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  searchContainer: {
    padding: 16
  },
  searchInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  plantList: {
    padding: 8
  },
  plantCard: {
    flex: 1,
    margin: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: "hidden"
  },
  plantImage: {
    width: "100%",
    height: 150
  },
  plantInfo: {
    padding: 12
  },
  plantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4
  },
  scientificName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    maxHeight: "70%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: "center"
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10
  },
  diseaseItem: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 5,
    paddingLeft: 10
  },
  treatmentItem: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 20
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
})
