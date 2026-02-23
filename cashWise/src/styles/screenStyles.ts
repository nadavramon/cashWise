import { StyleSheet } from "react-native";

/**
 * Shared screen-level styles for consistent layout across all app screens.
 * 
 * Usage:
 * import { screenStyles } from "../../styles/screenStyles";
 * 
 * <SafeAreaView style={screenStyles.safeArea}>
 *   <View style={screenStyles.container}>
 *     <ScrollView contentContainerStyle={screenStyles.contentContainer}>
 *       ...
 *     </ScrollView>
 *   </View>
 * </SafeAreaView>
 */
export const screenStyles = StyleSheet.create({
    /**
     * SafeAreaView wrapper - ensures content avoids notches/status bars
     */
    safeArea: {
        flex: 1,
    },

    /**
     * Main screen container with standard padding
     */
    container: {
        flex: 1,
        padding: 16,
    },

    /**
     * ScrollView content container with bottom padding for FAB clearance
     */
    contentContainer: {
        paddingBottom: 40,
    },

    /**
     * Centered placeholder for empty states or loading
     */
    placeholderContainer: {
        alignItems: "center",
        marginTop: 40,
    },
});
