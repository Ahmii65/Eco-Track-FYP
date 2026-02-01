import BackButton from "@/components/BackButton";
import TouchableButton from "@/components/TouchableButton";
import { cfpCategories } from "@/constants/cfpData";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";

import AndroidKeyboardAvoidingView from "@/components/AndroidKeyboardAvoidingView";
import {
  createOrUpdateActivity,
  deleteActivity,
} from "@/services/carbonService";
import { CarbonActivityType } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { Trash } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const AddActivity = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  const oldActivity: any = useLocalSearchParams(); // Simplified logic for params
  const isUpdate = !!oldActivity?.id;

  const [activity, setActivity] = useState<CarbonActivityType>({
    title: "",
    category: "",
    impact: 0,
    date: new Date(),
    uid: user?.uid,
  });

  const [quantity, setQuantity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    if (isUpdate) {
      setActivity({
        id: oldActivity.id,
        title: oldActivity.title,
        category: oldActivity.category,
        impact: Number(oldActivity.impact),
        date: new Date(oldActivity.date),
        uid: oldActivity.uid,
      });

      const cat = cfpCategories.find((c) => c.value === oldActivity.category);
      if (cat) {
        setSelectedCategory(cat);
        if (oldActivity.impact && cat.factor) {
          setQuantity((Number(oldActivity.impact) / cat.factor).toFixed(1));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCategory && quantity) {
      const q = parseFloat(quantity);
      if (!isNaN(q)) {
        const imp = q * selectedCategory.factor;
        setActivity((prev) => ({
          ...prev,
          impact: parseFloat(imp.toFixed(2)),
        }));
      }
    }
  }, [quantity, selectedCategory]);

  const onSubmit = async () => {
    if (!activity.category || !activity.impact) {
      Alert.alert("Error", "Please select a category and enter a quantity");
      return;
    }

    const finalActivity = {
      ...activity,
      title: activity.title || selectedCategory?.label || "Activity",
      uid: user?.uid,
    };

    setLoading(true);
    const res = await createOrUpdateActivity(finalActivity, oldActivity?.id);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this activity?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleteLoading(true);
          await deleteActivity(oldActivity?.id);
          setDeleteLoading(false);
          router.back();
        },
      },
    ]);
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || activity.date;
    setShowDatePicker(false);
    setActivity({ ...activity, date: currentDate });
  };

  const renderCategoryGrid = () => {
    return (
      <View style={styles.gridContainer}>
        {cfpCategories
          .filter(
            (cat) => cat.value !== "plant_tree" && cat.value !== "volunteer",
          )
          .map((cat, index) => {
            const isSelected = selectedCategory?.value === cat.value;
            const Icon = cat.icon;
            return (
              <Pressable
                key={index}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                        ? colors.neutral800
                        : colors.neutral200,
                    // borderColor: isSelected ? colors.primaryDark : "transparent",
                    // borderWidth: isSelected ? 2 : 0,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setActivity({ ...activity, category: cat.value });
                }}
              >
                <Icon
                  size={verticalScale(28)}
                  color={isSelected ? colors.black : cat.color}
                  weight={isSelected ? "fill" : "regular"}
                />
                <Text
                  style={[
                    styles.gridLabel,
                    {
                      color: isSelected ? colors.black : theme.text,
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                  numberOfLines={2}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5,
          paddingBottom: bottom,
        },
      ]}
    >
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
            {isUpdate ? "Update Activity" : "New Carbon Activity"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AndroidKeyboardAvoidingView extraOffset={0}>
            <Text style={[styles.label, { color: theme.text }]}>
              Select Activity Type
            </Text>
            {renderCategoryGrid()}

            {selectedCategory && (
              <View
                style={{
                  gap: verticalScale(15),
                  marginTop: verticalScale(10),
                  paddingBottom: verticalScale(20),
                }}
              >
                {/* Quantity */}
                <Text style={[styles.label, { color: theme.text }]}>
                  Quantity ({selectedCategory.unit})
                </Text>
                <TextInput
                  value={quantity}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.neutral500}
                  onChangeText={setQuantity}
                  style={[
                    styles.input,
                    { color: theme.text, borderColor: theme.text },
                  ]}
                  autoFocus={!isUpdate} // Auto focus when a category is picked first time
                />

                {/* Impact Display */}
                <View style={styles.impactBox}>
                  <Text
                    style={[
                      styles.label,
                      { color: theme.text, marginBottom: 0 },
                    ]}
                  >
                    Carbon Footprint:
                  </Text>
                  <Text
                    style={{
                      color: colors.rose,
                      fontSize: verticalScale(24),
                      fontWeight: "bold",
                    }}
                  >
                    {activity.impact}{" "}
                    <Text style={{ fontSize: 16 }}>kg CO2</Text>
                  </Text>
                </View>

                {/* Optional Title */}
                <Text style={[styles.label, { color: theme.text }]}>
                  Note / Title (Optional)
                </Text>
                <TextInput
                  value={activity.title}
                  placeholder="e.g. My Morning Commute"
                  placeholderTextColor={colors.neutral500}
                  onChangeText={(t) => setActivity({ ...activity, title: t })}
                  style={[
                    styles.input,
                    { color: theme.text, borderColor: theme.text },
                  ]}
                />

                {/* Date */}
                <Text style={[styles.label, { color: theme.text }]}>Date</Text>
                <Pressable
                  style={[
                    styles.input,
                    { justifyContent: "center", borderColor: theme.text },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: theme.text }}>
                    {(activity.date as Date).toLocaleDateString()}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(activity.date as any)}
                    onChange={onDateChange}
                  />
                )}
              </View>
            )}
          </AndroidKeyboardAvoidingView>
        </ScrollView>

        {/* Sticky Bottom Buttons */}
        {selectedCategory && (
          <View
            style={{
              paddingHorizontal: scale(20),
              paddingTop: verticalScale(10),
              paddingBottom: verticalScale(10),
              backgroundColor: theme.background, // Match background to cover scroll content
              borderTopWidth: 1,
              borderTopColor: isDark ? colors.neutral800 : colors.neutral200,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {isUpdate && (
                <TouchableButton
                  style={{
                    backgroundColor: colors.rose,
                    marginRight: 10,
                    width: 50,
                  }}
                  onPress={handleDelete}
                  loading={deleteLoading}
                >
                  <Trash color="white" />
                </TouchableButton>
              )}
              <TouchableButton
                onPress={onSubmit}
                loading={loading}
                style={{ flex: 1 }}
              >
                <Text style={styles.btnText}>
                  {isUpdate ? "Update" : "Save Activity"}
                </Text>
              </TouchableButton>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddActivity;

const styles = StyleSheet.create({
  main: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    gap: verticalScale(15),
    paddingBottom: verticalScale(40),
  },
  label: {
    fontSize: verticalScale(16),
    fontWeight: "500",
    marginBottom: verticalScale(5),
  },
  input: {
    height: verticalScale(50),
    borderWidth: 1,
    borderRadius: verticalScale(15),
    paddingHorizontal: scale(15),
    fontSize: verticalScale(14),
  },
  impactBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
  },
  btnText: {
    fontSize: verticalScale(16),
    fontWeight: "bold",
    color: "black",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: scale(10),
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: verticalScale(15),
    justifyContent: "center",
    alignItems: "center",
    padding: scale(5),
    gap: verticalScale(5),
  },
  gridLabel: {
    fontSize: verticalScale(11),
    textAlign: "center",
  },
});
