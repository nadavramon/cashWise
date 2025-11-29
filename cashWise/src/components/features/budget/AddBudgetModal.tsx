import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    Keyboard,
    InputAccessoryView,
    Button,
    useColorScheme,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RepoCategoryGroup, RepoCategoryItem } from '../../../data/categoryRepo';

interface AddBudgetModalProps {
    visible: boolean;
    onClose: () => void;
    activeGroup: RepoCategoryGroup | null;
    currencySymbol: string;
    onSave: (amount: string, subCategory: RepoCategoryItem) => void;
    onOpenSubCategoryModal: () => void;
    selectedSubCategory: RepoCategoryItem | null;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
    visible,
    onClose,
    activeGroup,
    currencySymbol,
    onSave,
    onOpenSubCategoryModal,
    selectedSubCategory
}) => {
    const isDark = useColorScheme() === 'dark';
    const insets = useSafeAreaInsets();
    const [amountInput, setAmountInput] = useState('');

    const textColor = isDark ? '#FFFFFF' : '#333333';
    const subTextColor = isDark ? '#CCCCCC' : '#666666';
    const modalBg = isDark ? '#1E1E1E' : '#FFFFFF';
    const inputBg = isDark ? '#333333' : '#F5F5F5';
    const themeColor = isDark ? '#02C3BD' : '#007CBE';

    // Reset input when modal opens
    useEffect(() => {
        if (visible) {
            setAmountInput('');
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.customModalOverlay}>
            <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => {
                    Keyboard.dismiss();
                    onClose();
                }}
            />

            {/* Modal positioned at the top */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[
                    styles.modalContent,
                    {
                        backgroundColor: modalBg,
                        marginTop: insets.top + 20
                    }
                ]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>
                            Add {activeGroup?.title} Budget
                        </Text>
                        <TouchableOpacity onPress={() => {
                            Keyboard.dismiss();
                            onClose();
                        }}>
                            <Ionicons name="close" size={24} color={subTextColor} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: subTextColor }]}>Amount</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
                            <Text style={[styles.currencyPrefix, { color: textColor }]}>{currencySymbol}</Text>
                            <TextInput
                                style={[styles.textInput, { color: textColor }]}
                                placeholder="0.00"
                                placeholderTextColor={subTextColor}
                                keyboardType="numeric"
                                value={amountInput}
                                onChangeText={setAmountInput}
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={Keyboard.dismiss}
                                inputAccessoryViewID="DoneButton"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: subTextColor }]}>Category</Text>
                        <TouchableOpacity
                            style={[styles.selectButton, { backgroundColor: inputBg }]}
                            onPress={() => {
                                Keyboard.dismiss();
                                onOpenSubCategoryModal();
                            }}
                        >
                            <Text style={[
                                styles.selectButtonText,
                                { color: selectedSubCategory ? textColor : subTextColor }
                            ]}>
                                {selectedSubCategory ? selectedSubCategory.label : 'Select sub-category'}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            { backgroundColor: themeColor, opacity: (!amountInput || !selectedSubCategory) ? 0.5 : 1 }
                        ]}
                        onPress={() => selectedSubCategory && onSave(amountInput, selectedSubCategory)}
                        disabled={!amountInput || !selectedSubCategory}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

            {Platform.OS === 'ios' && (
                <InputAccessoryView nativeID="DoneButton">
                    <View style={[styles.accessoryView, { backgroundColor: modalBg }]}>
                        <Button onPress={Keyboard.dismiss} title="Done" />
                    </View>
                </InputAccessoryView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    customModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        justifyContent: 'flex-start', // Position at top
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        // Shadow for better visibility
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: '600',
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        height: '100%',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    selectButtonText: {
        fontSize: 16,
    },
    saveButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    accessoryView: {
        width: '100%',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
});

export default AddBudgetModal;
