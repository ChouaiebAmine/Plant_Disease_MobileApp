import React from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native"
import colors from "../theme/colors"

// Mock data for blog articles
const BLOG_ARTICLES = [
  {
    id: "1",
    title: "Overwatered vs. Underwatered Plants",
    date: "Feb 27, 2025",
    readTime: "8 min read",
    image:
      "https://www.thespruce.com/thmb/qrtrVK3yqRYuQyHUZOdQXcNGUBc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-monstera-deliciosa-swiss-cheese-plant-1902774-hero-0a5a5bb3998f4ae0806c15575ce8c4eb.jpg",
    excerpt:
      "Learn how to identify the signs of overwatering and underwatering in your houseplants and how to fix these common issues."
  },
  {
    id: "2",
    title: "Checklist: You Bought a New Houseplant",
    date: "Jan 6, 2025",
    readTime: "8 min read",
    image:
      "https://www.thespruce.com/thmb/StjXQe0jmOrBrQ8vOaVTXvvHFN0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/snake-plant-care-guide-4796668-hero-80bc5d2ecc7c4c1abcfa753c5f31ca95.jpg",
    excerpt:
      "Follow these essential steps when bringing a new plant home to ensure it thrives in its new environment."
  },
  {
    id: "3",
    title: "Common Plant Diseases and How to Treat Them",
    date: "Nov 26, 2024",
    readTime: "4 min read",
    image:
      "https://www.thespruce.com/thmb/1g_y9xyi8hLEL4H6tZQXa_xAB_g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-aloe-vera-1902817-hero-0a8f0bb1b0944469b5e7b7be3196a763.jpg",
    excerpt:
      "Identify and treat the most common plant diseases to keep your indoor garden healthy and thriving."
  }
]

export default function BlogScreen() {
  const renderArticleItem = ({ item }) => (
    <TouchableOpacity style={styles.articleCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.articleImage}
        resizeMode="cover"
      />
      <View style={styles.articleInfo}>
        <View style={styles.articleMeta}>
          <Text style={styles.articleDate}>{item.date}</Text>
          <Text style={styles.articleReadTime}> • {item.readTime}</Text>
        </View>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleExcerpt}>{item.excerpt}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Articles</Text>
      </View>

      <FlatList
        data={BLOG_ARTICLES}
        renderItem={renderArticleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.articleList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    padding: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary
  },
  articleList: {
    padding: 16
  },
  articleCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden"
  },
  articleImage: {
    width: "100%",
    height: 150
  },
  articleInfo: {
    padding: 16
  },
  articleMeta: {
    flexDirection: "row",
    marginBottom: 8
  },
  articleDate: {
    fontSize: 14,
    color: colors.textSecondary
  },
  articleReadTime: {
    fontSize: 14,
    color: colors.textSecondary
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8
  },
  articleExcerpt: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20
  }
})
