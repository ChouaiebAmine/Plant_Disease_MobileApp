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

plant_img_path='../context'

const PLANTS_DATA = [
  {
    id: "1",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "Plant_Label_Img/Tomato.jpg",
    diseases: ['Bacterial_spot', 'Early_blight', 'Late_blight', 'Leaf_Mold', 'Septoria_leaf_spot', 'Spider_mites Two-spotted_spider_mite', 'Target_Spot', 'Tomato_Yellow_Leaf_Curl_Virus', 'Tomato_mosaic_virus', 'healthy']
  },
  {
    id: "2",
    name: "Apple",
    scientificName: "Malus domestica",
    image: "Plant_Label_Img/Apple.jpg",
    diseases: ['Apple_scab', 'Black_rot', 'Cedar_apple_rust', 'healthy']
  },
  {
    id: "3",
    name: "Corn_(maize)",
    scientificName: "Zea mays",
    image: "Plant_Label_Img/Corn.jpg",
    diseases: ['Cercospora_leaf_spot Gray_leaf_spot', 'Common_rust_', 'Northern_Leaf_Blight', 'healthy']
  },
  {
    id: "4",
    name: "Grape",
    scientificName: "Vitis vinifera",
    image: "Plant_Label_Img/Grape.jpg",
    diseases: ['Black_rot', 'Esca_(Black_Measles)', 'Leaf_blight_(Isariopsis_Leaf_Spot)', 'healthy']
  },
  {
    id: "5",
    name: "Potato",
    scientificName: "Solanum tuberosum",
    image: "Plant_Label_Img/Potato.jpg",
    diseases: ['Early_blight', 'Late_blight', 'healthy']
  },
  {
    id: "6",
    name: "Pepper,_bell",
    scientificName: "Capsicum annuum",
    image: "Plant_Label_Img/Pepper.jpg",
    diseases: ['Bacterial_spot', 'healthy']
  },
  {
    id: "7",
    name: "Strawberry",
    scientificName: "Fragaria × ananassa",
    image: "Plant_Label_Img/Strawberry.jpg",
    diseases: ['Leaf_scorch', 'healthy']
  },
  {
    id: "8",
    name: "Peach",
    scientificName: "Prunus persica",
    image: "Plant_Label_Img/Peach.jpg",
    diseases: ['Bacterial_spot', 'healthy']
  },
  {
    id: "9",
    name: "Cherry_(including_sour)",
    scientificName: "Prunus avium",
    image: "Plant_Label_Img/Cherry.jpg",
    diseases: ['Powdery_mildew', 'healthy']
  },
  {
    id: "10",
    name: "Soybean",
    scientificName: "Glycine max",
    image: "Plant_Label_Img/Soybean.jpg",
    diseases: ['healthy']
  },
  {
    id: "11",
    name: "Orange",
    scientificName: "Citrus × sinensis",
    image: "Plant_Label_Img/Orange.jpg",
    diseases: ['Haunglongbing_(Citrus_greening)']
  },
  {
    id: "12",
    name: "Blueberry",
    scientificName: "Vaccinium corymbosum",
    image: "Plant_Label_Img/Blueberry.jpg",
    diseases: ['healthy']
  },
  {
    id: "13",
    name: "Raspberry",
    scientificName: "Rubus idaeus",
    image: "../../Plant_Label_Img/Pepper.jpg",
    diseases: ['healthy']
  },
  {
    id: "14",
    name: "Squash",
    scientificName: "Cucurbita",
    image: "Plant_Label_Img/Squash.jpg",
    diseases: ['Powdery_mildew']
  }
]

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [plants, setPlants] = useState(PLANTS_DATA)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState(null)

  const filteredPlants = plants.filter(
    plant =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlantPress = (plant) => {
    setSelectedPlant(plant)
    setModalVisible(true)
  }

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => handlePlantPress(item)}
    >
      <Image
        source={{ uri: item.image }}
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
                    <Text style={styles.diseaseItem}>• {item.replace(/_/g, ' ')}</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)"
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
