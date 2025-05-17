import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native"
import colors from "../theme/colors"

// Mock data for plants
const PLANTS_DATA = [
  {
    id: "1",
    name: "Apple",
    scientificName: "Epipremnum aureum",
    image:"Plant_Label_Img/Apple.jpg",
  },
  {
    id: "2",
    name: "Blue Berry",
    scientificName: "Sansevieria trifasciata",
    image:"Plant_Label_Img/BlueBerry.jpg",  
  },
  {
    id: "3",
    name: "Aloe Vera",
    scientificName: "Aloe vera",
    image:
      "https://www.thespruce.com/thmb/1g_y9xyi8hLEL4H6tZQXa_xAB_g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-aloe-vera-1902817-hero-0a8f0bb1b0944469b5e7b7be3196a763.jpg"
  },
  {
    id: "4",
    name: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    image:
      "https://www.thespruce.com/thmb/oPvmHXGLLEUXE4RXEHXtL-Uxlao=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-peace-lilies-1902767-hero-31e6b9a2895a4be2ab8c52e6ad4d5c77.jpg"
  },
  {
    id: "5",
    name: "Swiss Cheese Plant",
    scientificName: "Monstera deliciosa",
    image:
      "https://www.thespruce.com/thmb/qrtrVK3yqRYuQyHUZOdQXcNGUBc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-monstera-deliciosa-swiss-cheese-plant-1902774-hero-0a5a5bb3998f4ae0806c15575ce8c4eb.jpg"
  },
  {
    id: "6",
    name: "Corn Plant",
    scientificName: "Dracaena fragrans",
    image:
      "https://www.thespruce.com/thmb/klZBV6Tv1JgdmC2WnrJNL3BgycU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-dracaena-fragrans-indoors-1902748-hero-c66e2decaf404846b55e636127bfbc3d.jpg"
  }
]

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [plants, setPlants] = useState(PLANTS_DATA)
  const [loading, setLoading] = useState(false)

  const filteredPlants = plants.filter(
    plant =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => {
        // In a real app, navigate to plant details
        console.log(`Selected plant: ${item.name}`)
      }}
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
  }
})
