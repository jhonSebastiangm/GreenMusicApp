import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeMap = {
    small: { icon: 24, fontSize: 16, spacing: 4 },
    medium: { icon: 32, fontSize: 24, spacing: 6 },
    large: { icon: 48, fontSize: 32, spacing: 8 },
  };

  const { icon, fontSize, spacing } = sizeMap[size];

  return (
    <View style={styles.container}>
      {/* Tree Icon - Simplified version */}
      <View style={[styles.treeContainer, { width: icon, height: icon }]}>
        {/* Trunk */}
        <View style={[styles.trunk, { width: icon * 0.15, height: icon * 0.4 }]} />
        {/* Branches */}
        <View style={[styles.branch, styles.branchLeft]} />
        <View style={[styles.branch, styles.branchRight]} />
        {/* Canopy */}
        <View style={[styles.canopy, { width: icon * 0.8, height: icon * 0.6 }]}>
          {/* Leaves represented as circles */}
          <View style={[styles.leaf, { top: '10%', left: '20%' }]} />
          <View style={[styles.leaf, { top: '10%', right: '20%' }]} />
          <View style={[styles.leaf, { top: '30%', left: '10%' }]} />
          <View style={[styles.leaf, { top: '30%', right: '10%' }]} />
          <View style={[styles.leaf, { top: '20%', left: '50%', transform: [{ translateX: -4 }] }]} />
        </View>
      </View>

      {showText && (
        <View style={[styles.textContainer, { marginTop: spacing }]}>
          <Text style={[styles.greenText, { fontSize }]}>green</Text>
          <Text style={[styles.musicText, { fontSize: fontSize * 0.7 }]}>MUSIC</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  trunk: {
    backgroundColor: Colors.primary,
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  branch: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    width: 2,
    height: 8,
    bottom: '40%',
  },
  branchLeft: {
    left: '35%',
    transform: [{ rotate: '-25deg' }],
  },
  branchRight: {
    right: '35%',
    transform: [{ rotate: '25deg' }],
  },
  canopy: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 20,
    bottom: '20%',
    borderStyle: 'solid',
  },
  leaf: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  textContainer: {
    alignItems: 'center',
  },
  greenText: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  musicText: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.secondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: -2,
  },
});

export default Logo;

