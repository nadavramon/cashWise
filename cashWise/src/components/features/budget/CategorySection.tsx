import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_REPO, RepoCategoryGroup } from '../../../data/categoryRepo';
import { PlannedBudgetItem } from '../../../types/budget';

interface CategorySectionProps {
    plannedBudgets: PlannedBudgetItem[];
    currencySymbol: string;
    onAddCategory: (group: RepoCategoryGroup) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
    plannedBudgets,
    currencySymbol,
    onAddCategory
}) => {
    const isDark = useColorScheme() === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#333333';
    const subTextColor = isDark ? '#CCCCCC' : '#666666';
    const cardBg = isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)';
    const themeColor = isDark ? '#02C3BD' : '#007CBE';

    return (
        <View style={styles.sectionsContainer}>
            {CATEGORY_REPO.map((group) => {
                // Filter planned items for this group
                const groupItems = plannedBudgets.filter(item => item.groupId === group.id);
                const groupTotal = groupItems.reduce((sum, item) => sum + item.amount, 0);

                return (
                    <View key={group.id} style={[styles.sectionCard, { backgroundColor: cardBg }]}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={[styles.sectionColorIndicator, { backgroundColor: group.color }]} />
                                <Text style={[styles.sectionTitle, { color: textColor }]}>{group.title}</Text>
                            </View>
                            <Text style={[styles.sectionTotal, { color: subTextColor }]}>
                                {groupTotal > 0 ? `${currencySymbol}${groupTotal.toLocaleString()}` : ''}
                            </Text>
                        </View>

                        {/* List of added budget items for this group */}
                        {groupItems.map(item => (
                            <View key={item.id} style={styles.budgetRow}>
                                <Text style={[styles.budgetLabel, { color: subTextColor }]}>{item.subCategoryLabel}</Text>
                                <Text style={[styles.budgetAmount, { color: textColor }]}>
                                    {currencySymbol}{item.amount.toLocaleString()}
                                </Text>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.addCategoryButton}
                            onPress={() => onAddCategory(group)}
                        >
                            <Ionicons name="add-circle" size={20} color={themeColor} />
                            <Text style={[styles.addCategoryText, { color: themeColor }]}>Add category</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionsContainer: {
        gap: 16,
    },
    sectionCard: {
        borderRadius: 20,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionColorIndicator: {
        width: 4,
        height: 20,
        borderRadius: 2,
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    sectionTotal: {
        fontSize: 16,
        fontWeight: '500',
    },
    budgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingLeft: 16,
    },
    budgetLabel: {
        fontSize: 14,
    },
    budgetAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    addCategoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 8,
    },
    addCategoryText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CategorySection;
