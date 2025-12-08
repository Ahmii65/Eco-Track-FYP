// import useTheme from "@/hooks/useColorScheme";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { scale, verticalScale } from "react-native-size-matters";
// import BackButton from "./BackButton";

// const BottomSheetContent = () => {
//   const { theme } = useTheme();
//   return (
//     <View style={{ flex: 1, paddingHorizontal: scale(20) }}>
//       <View style={styles.header}>
//         <BackButton />
//         <View
//           style={{
//             alignItems: "center",
//             flex: 1,
//             marginRight: scale(35),
//           }}
//         >
//           <Text style={[styles.headerText, { color: theme.text }]}>
//             Edit Profile
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default BottomSheetContent;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: verticalScale(30),
//   },
//   headerText: {
//     fontSize: verticalScale(18),
//     fontWeight: "700",
//     letterSpacing: verticalScale(0.5),
//   },
// });
