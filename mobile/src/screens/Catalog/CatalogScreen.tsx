import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { productsService } from '../../services/products.service';
import { redemptionsService } from '../../services/redemptions.service';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

const CatalogScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll('active');
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (product: Product) => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para canjear productos');
      return;
    }

    if (user.points_balance < product.points_required) {
      Alert.alert(
        'Puntos insuficientes',
        `Necesitas ${product.points_required} puntos para canjear este producto. Tienes ${user.points_balance} puntos.`,
      );
      return;
    }

    Alert.alert(
      'Confirmar Canjeo',
      `¿Deseas canjear ${product.title} por ${product.points_required} puntos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: async () => {
            try {
              await redemptionsService.create(product.id);
              Alert.alert('Éxito', 'Producto canjeado correctamente');
              await refreshUser();
              await loadProducts();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al canjear el producto');
            }
          },
        },
      ],
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.productImageText}>🛍️</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.productDescription}>{item.description}</Text>
        )}
        <View style={styles.productFooter}>
          <Text style={styles.productPoints}>{item.points_required} puntos</Text>
          <TouchableOpacity
            style={styles.redeemButton}
            onPress={() => handleRedeem(item)}
          >
            <Text style={styles.redeemButtonText}>Canjear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Catálogo de Productos</Text>
      {user && (
        <Text style={styles.pointsBalance}>
          Tus puntos: {user.points_balance}
        </Text>
      )}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  pointsBalance: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingBottom: 10,
    color: '#4CAF50',
  },
  list: {
    padding: 10,
  },
  productItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  productImageText: {
    fontSize: 64,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  redeemButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CatalogScreen;

