export default {
  expo: {
    name: "Green Music",
    slug: "green-music",
    version: "1.0.0",
    orientation: "portrait",
    // icon: "./assets/icon.png", // Comentado temporalmente para evitar warning
    userInterfaceStyle: "light",
    splash: {
      // image: "./assets/splash.png", // Comentado temporalmente
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.greenmusic.app"
    },
    android: {
      adaptiveIcon: {
        // foregroundImage: "./assets/adaptive-icon.png", // Comentado temporalmente
        backgroundColor: "#ffffff"
      },
      package: "com.greenmusic.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-av"
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000",
      firebase: {
        apiKey: "AIzaSyBCnkGDRCfoWFkEZ2J98GH_p1DwAQpJpu0",
        authDomain: "greenmusic-6cd99.firebaseapp.com",
        projectId: "greenmusic-6cd99",
        storageBucket: "greenmusic-6cd99.firebasestorage.app",
        messagingSenderId: "967106270070",
        appId: "1:967106270070:web:c27e2cecebd4ff3beee057",
      }
    }
  }
};

