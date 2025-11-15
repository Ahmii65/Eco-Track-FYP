import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { Shield } from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const PrivacyPolicy = () => {
  const { theme, isDark } = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information that you provide directly to us, including:
• Personal identification information (name, email address)
• Profile information and preferences
• Financial transaction data related to your eco-tracking activities
• Device information and usage data`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process transactions and send related information
• Send you technical notices and support messages
• Respond to your comments and questions
• Monitor and analyze trends and usage
• Personalize your experience`,
    },
    {
      title: "3. Data Storage and Security",
      content: `We implement appropriate technical and organizational security measures to protect your personal information. Your data is stored securely using industry-standard encryption and security protocols. However, no method of transmission over the internet is 100% secure.`,
    },
    {
      title: "4. Data Sharing",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only:
• With your explicit consent
• To comply with legal obligations
• To protect our rights and safety
• With service providers who assist in operating our app`,
    },
    {
      title: "5. Your Rights",
      content: `You have the right to:
• Access your personal information
• Correct inaccurate data
• Request deletion of your data
• Object to processing of your data
• Data portability
• Withdraw consent at any time`,
    },
    {
      title: "6. Cookies and Tracking",
      content: `We may use cookies and similar tracking technologies to track activity on our app and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
    },
    {
      title: "7. Children's Privacy",
      content: `Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.`,
    },
    {
      title: "8. Changes to This Policy",
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.`,
    },
    {
      title: "9. Contact Us",
      content: `If you have any questions about this Privacy Policy, please contact us at:
Email: privacy@ecotrack.com
Address: Eco Track Support Team`,
    },
  ];

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
            Privacy Policy
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
                backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              },
            ]}
          >
            <Shield size={scale(32)} color={colors.primary} weight="fill" />
          </View>
          <Text style={[styles.introTitle, { color: theme.text }]}>
            Your Privacy Matters
          </Text>
          <Text style={[styles.introText, { color: theme.text }]}>
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={[styles.introDescription, { color: theme.text }]}>
            At Eco Track, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our mobile application.
          </Text>
        </View>

        {/* Policy Sections */}
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {section.title}
            </Text>
            <Text
              style={[styles.sectionContent, { color: theme.text }]}
              selectable={true}
            >
              {section.content}
            </Text>
          </View>
        ))}

        {/* Footer Note */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: theme.text }]}>
            By using Eco Track, you agree to the collection and use of
            information in accordance with this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

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
  introTitle: {
    fontSize: verticalScale(24),
    fontWeight: "700",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  introText: {
    fontSize: verticalScale(12),
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
    marginBottom: verticalScale(25),
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    marginBottom: verticalScale(12),
    letterSpacing: verticalScale(0.3),
  },
  sectionContent: {
    fontSize: verticalScale(14),
    fontWeight: "400",
    lineHeight: verticalScale(22),
  },
  footerSection: {
    marginTop: verticalScale(20),
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  footerText: {
    fontSize: verticalScale(13),
    fontWeight: "400",
    lineHeight: verticalScale(20),
    textAlign: "center",
    fontStyle: "italic",
  },
});
