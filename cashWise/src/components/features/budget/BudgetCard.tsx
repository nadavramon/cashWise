import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
    useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { CATEGORY_REPO } from '../../../data/categoryRepo';
import { PlannedBudgetItem } from '../../../types/budget';

// Enable LayoutAnimation on Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface BudgetCardProps {
    plannedBudgets: PlannedBudgetItem[];
    totalPlannedExpenses: number;
    totalIncome: number;
    currencySymbol: string;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
    plannedBudgets,
    totalPlannedExpenses,
    totalIncome,
    currencySymbol
}) => {
    const isDark = useColorScheme() === 'dark';
    const [isExpanded, setIsExpanded] = useState(false);

    const textColor = isDark ? '#FFFFFF' : '#333333';
    const subTextColor = isDark ? '#CCCCCC' : '#666666';
    const cardBg = isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)';

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    // Chart Data derived from Planned Budgets
    const chartData = useMemo(() => {
        return plannedBudgets.map((item) => {
            const group = CATEGORY_REPO.find(g => g.id === item.groupId);
            return {
                name: item.subCategoryLabel,
                population: item.amount,
                color: group?.color || '#999',
                legendFontColor: textColor,
                legendFontSize: 12,
            };
        });
    }, [plannedBudgets, textColor]);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: cardBg }]}
            activeOpacity={1}
            onPress={isExpanded ? toggleExpand : undefined}
        >
            <View style={styles.cardHeader}>
                {/* Left: Chart */}
                <View style={styles.chartContainer}>
                    <PieChart
                        data={chartData.length > 0 ? chartData : [{ name: 'Empty', population: 1, color: '#ddd', legendFontColor: 'transparent', legendFontSize: 0 }]}
                        width={80}
                        height={80}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="20"
                        hasLegend={false}
                        absolute={false}
                    />
                </View>

                {/* Right: Text Info */}
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardLabel, { color: subTextColor }]}>
                        Total planned expenses
                    </Text>
                    <Text style={[styles.cardAmount, { color: textColor }]}>
                        {currencySymbol}
                        {totalPlannedExpenses.toLocaleString()}
                    </Text>
                </View>

                {/* Far Right: Expand Button (only visible when collapsed) */}
                {!isExpanded && (
                    <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
                        <Ionicons name="chevron-down" size={24} color={subTextColor} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Expanded Content: List */}
            {isExpanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.divider} />
                    {plannedBudgets.map((item) => {
                        const percentageOfIncome = totalIncome > 0
                            ? ((item.amount / totalIncome) * 100).toFixed(1)
                            : '0.0';

                        const group = CATEGORY_REPO.find(g => g.id === item.groupId);
                        const color = group?.color || '#999';

                        return (
                            <View key={item.id} style={styles.listItem}>
                                <View style={styles.listItemLeft}>
                                    <View style={[styles.colorDot, { backgroundColor: color }]} />
                                    <Text style={[styles.itemName, { color: textColor }]}>
                                        {item.subCategoryLabel}
                                    </Text>
                                    <Text style={[styles.itemPercentage, { color: subTextColor }]}>
                                        {percentageOfIncome}%
                                    </Text>
                                </View>
                                <Text style={[styles.itemAmount, { color: textColor }]}>
                                    {currencySymbol}{item.amount.toLocaleString()}
                                </Text>
                            </View>
                        );
                    })}
                    {plannedBudgets.length === 0 && (
                        <Text style={[styles.noDataText, { color: subTextColor }]}>No planned expenses yet.</Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chartContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    cardAmount: {
        fontSize: 24,
        fontWeight: '700',
    },
    expandButton: {
        padding: 8,
    },
    expandedContent: {
        marginTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
        marginBottom: 16,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 6,
        marginRight: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 8,
    },
    itemPercentage: {
        fontSize: 14,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
});

export default BudgetCard;
