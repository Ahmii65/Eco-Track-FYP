import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { FileText } from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const TermsAndConditions = () => {
  const { theme, isDark } = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using the Eco Track mobile application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      title: "2. Description of Service",
      content: `Eco Track is a mobile application designed to help users track their spending, understand their environmental impact, and make more sustainable choices. The service includes features for expense tracking, carbon footprint calculation, and personalized recommendations.`,
    },
    {
      title: "3. User Accounts",
      content: `To use certain features of the app, you must register for an account. You agree to:
• Provide accurate, current, and complete information
• Maintain and update your information to keep it accurate
• Maintain the security of your password
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use`,
    },
    {
      title: "4. User Responsibilities",
      content: `You are responsible for:
• All activities that occur under your account
• Maintaining the confidentiality of your account credentials
• Ensuring the accuracy of data you input into the app
• Using the app in compliance with all applicable laws
• Not using the app for any illegal or unauthorized purpose`,
    },
    {
      title: "5. Prohibited Activities",
      content: `You agree not to:
• Violate any laws or regulations
• Infringe upon the rights of others
• Transmit any harmful code or malware
• Attempt to gain unauthorized access to the app
• Interfere with or disrupt the app's functionality
• Use automated systems to access the app without permission`,
    },
    {
      title: "6. Intellectual Property",
      content: `All content, features, and functionality of the Eco Track app, including but not limited to text, graphics, logos, and software, are the exclusive property of Eco Track and are protected by copyright, trademark, and other intellectual property laws.`,
    },
    {
      title: "7. Data and Privacy",
      content: `Your use of the app is also governed by our Privacy Policy. By using the app, you consent to the collection and use of your information as described in the Privacy Policy. We are committed to protecting your data and using it responsibly.`,
    },
    {
      title: "8. Service Availability",
      content: `We strive to provide continuous access to the app, but we do not guarantee that the service will be available at all times. The app may be unavailable due to maintenance, updates, or circumstances beyond our control. We reserve the right to modify or discontinue the service at any time.`,
    },
    {
      title: "9. Limitation of Liability",
      content: `Eco Track shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the app. Our total liability shall not exceed the amount you paid for the app, if any.`,
    },
    {
      title: "10. Disclaimer of Warranties",
      content: `The app is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the app will be uninterrupted, error-free, or free from viruses or other harmful components.`,
    },
    {
      title: "11. Modifications to Terms",
      content: `We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes by updating the "Last Updated" date. Your continued use of the app after changes constitutes acceptance of the modified terms.`,
    },
    {
      title: "12. Termination",
      content: `We may terminate or suspend your account and access to the app immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the app will cease immediately.`,
    },
    {
      title: "13. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved through appropriate legal channels.`,
    },
    {
      title: "14. Contact Information",
      content: `If you have any questions about these Terms and Conditions, please contact us at:
Email: support@ecotrack.com
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
            Terms & Conditions
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
            <FileText size={scale(32)} color={colors.primary} weight="fill" />
          </View>
          <Text style={[styles.introTitle, { color: theme.text }]}>
            Terms of Service
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
            Please read these Terms and Conditions carefully before using the Eco
            Track mobile application. By using our app, you agree to be bound by
            these terms. If you do not agree to these terms, please do not use
            our service.
          </Text>
        </View>

        {/* Terms Sections */}
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
            By using Eco Track, you acknowledge that you have read, understood,
            and agree to be bound by these Terms and Conditions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

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
