import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import {
  ChartBar,
  CurrencyDollar,
  Info,
  Leaf,
  Wallet,
} from "phosphor-react-native";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const AboutApp = () => {
  const { theme, isDark } = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const features = [
    {
      icon: CurrencyDollar,
      title: "Expense Tracking",
      description: "Track your daily expenses and categorize them for better financial management.",
    },
    {
      icon: Leaf,
      title: "Carbon Footprint",
      description: "Monitor your environmental impact and see how your choices affect the planet.",
    },
    {
      icon: ChartBar,
      title: "Statistics & Insights",
      description: "Get detailed analytics and insights about your spending patterns and eco-impact.",
    },
    {
      icon: Wallet,
      title: "Budget Management",
      description: "Set budgets and track your progress towards your financial and environmental goals.",
    },
  ];

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@ecotrack.com");
  };

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            marginRight: scale(35),
          }}
        >
          <Text style={[styles.headerText, { color: theme.text }]}>
            About App
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: bottom + verticalScale(30),
        }}
      >
        {/* Introduction */}
        <View style={styles.introSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? colors.neutral800
                  : colors.neutral100,
              },
            ]}
          >
            <Info size={scale(32)} color={colors.primary} weight="fill" />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>Eco Track</Text>
          <Text style={[styles.versionText, { color: colors.neutral500 }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.introDescription, { color: theme.text }]}>
            Eco Track is your personal companion for sustainable living. Track
            your expenses, monitor your carbon footprint, and make informed
            decisions that benefit both your wallet and the planet.
          </Text>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Our Mission
          </Text>
          <Text style={[styles.sectionContent, { color: theme.text }]}>
            We believe that small changes can make a big impact. Eco Track
            empowers you to understand the connection between your spending
            habits and environmental impact, helping you make more sustainable
            choices every day.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Key Features
          </Text>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDark
                      ? colors.neutral800
                      : colors.white,
                  },
                ]}
              >
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <IconComponent
                    size={scale(24)}
                    color={colors.primary}
                    weight="fill"
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>
                    {feature.title}
                  </Text>
                  <Text
                    style={[styles.featureDescription, { color: colors.neutral500 }]}
                  >
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            App Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.neutral500 }]}>
              Version:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.neutral500 }]}>
              Platform:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              Android
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.neutral500 }]}>
              Category:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              Finance & Lifestyle
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Get in Touch
          </Text>
          <Text style={[styles.sectionContent, { color: theme.text }]}>
            We'd love to hear from you! Whether you have feedback, suggestions,
            or need support, we're here to help.
          </Text>
          <TouchableOpacity
            style={[
              styles.contactButton,
              {
                backgroundColor: isDark
                  ? colors.neutral800
                  : colors.white,
              },
            ]}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.contactButtonText, { color: colors.primary }]}>
              support@ecotrack.com
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: colors.neutral500 }]}>
            Made with ❤️ for 🌎
          </Text>
          <Text style={[styles.copyrightText, { color: colors.neutral500 }]}>
            © 2025 Eco Track. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutApp;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(25),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
  introSection: {
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  iconContainer: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  appName: {
    fontSize: verticalScale(28),
    fontWeight: "700",
    marginBottom: verticalScale(6),
    textAlign: "center",
  },
  versionText: {
    fontSize: verticalScale(13),
    fontWeight: "400",
    marginBottom: verticalScale(15),
  },
  introDescription: {
    fontSize: verticalScale(15),
    fontWeight: "400",
    lineHeight: verticalScale(22),
    textAlign: "center",
  },
  section: {
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: verticalScale(20),
    fontWeight: "700",
    marginBottom: verticalScale(15),
    letterSpacing: verticalScale(0.3),
  },
  sectionContent: {
    fontSize: verticalScale(14),
    fontWeight: "400",
    lineHeight: verticalScale(22),
  },
  featureCard: {
    flexDirection: "row",
    padding: verticalScale(16),
    borderRadius: scale(16),
    marginBottom: verticalScale(12),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: scale(12),
  },
  featureIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  featureDescription: {
    fontSize: verticalScale(13),
    fontWeight: "400",
    lineHeight: verticalScale(18),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  infoLabel: {
    fontSize: verticalScale(14),
    fontWeight: "500",
  },
  infoValue: {
    fontSize: verticalScale(14),
    fontWeight: "400",
  },
  contactButton: {
    marginTop: verticalScale(12),
    padding: verticalScale(14),
    borderRadius: scale(12),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  contactButtonText: {
    fontSize: verticalScale(14),
    fontWeight: "600",
  },
  footerSection: {
    marginTop: verticalScale(20),
    paddingTop: verticalScale(20),
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  footerText: {
    fontSize: verticalScale(14),
    fontWeight: "400",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  copyrightText: {
    fontSize: verticalScale(12),
    fontWeight: "400",
    textAlign: "center",
  },
});
