import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../../types/models';
import { useCategories } from '../../../context/CategoriesContext';
import { useTransactions } from '../../../context/TransactionsContext';

import { useOverviewCycle } from '../../../context/CycleContext';

interface TransactionListProps {
    // transactions provided by context
}

const AnimatedTransactionRow: React.FC<{
    item: Transaction;
    onDelete: () => void;
}> = ({ item, onDelete }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? '#FFFFFF' : '#333333';
    const { categories } = useCategories();

    // Animation values
    const rowHeight = useRef(new Animated.Value(70)).current; // Approximate height
    const opacity = useRef(new Animated.Value(1)).current;

    const handleDelete = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(rowHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start(() => {
            onDelete();
        });
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        return (
            <View style={styles.rightActionContainer}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                >
                    <Ionicons name="trash" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        );
    };

    const cat = categories.find((c) => c.id === item.categoryId);

    return (
        <Animated.View style={{ opacity, height: rowHeight, overflow: 'hidden' }}>
            <Swipeable
                renderRightActions={renderRightActions}
                containerStyle={styles.swipeableContainer}
            >
                <View style={[styles.row, { backgroundColor: 'transparent' }]}>
                    <View style={styles.rowMain}>
                        <Text style={[styles.rowCategory, { color: textColor }]}>{cat?.name ?? 'Uncategorized'}</Text>
                        {!!item.note && <Text style={styles.rowNote}>{item.note}</Text>}
                    </View>
                    <View style={styles.rowRight}>
                        <Text
                            style={[
                                styles.rowAmount,
                                item.type === 'income' ? styles.incomeText : styles.expenseText,
                            ]}
                        >
                            {item.type === 'income' ? '+' : '-'}
                            {item.amount.toFixed(2)}
                        </Text>
                        <Text style={styles.rowDate}>{item.date}</Text>
                    </View>
                </View>
            </Swipeable>
        </Animated.View>
    );
};

const TransactionList: React.FC<TransactionListProps> = () => {
    const { deleteTransaction } = useTransactions();
    const { transactions } = useOverviewCycle();

    const renderListItem = ({ item }: { item: Transaction }) => {
        return (
            <AnimatedTransactionRow
                item={item}
                onDelete={() => deleteTransaction(item.id, item.date)}
            />
        );
    };

    return (
        <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderListItem}
            contentContainerStyle={styles.scrollContent}
        />
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
    },
    swipeableContainer: {
        // Ensure the container takes full width
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
        height: 70, // Fixed height for smoother animation
        alignItems: 'center',
    },
    rowMain: {
        flex: 1,
        justifyContent: 'center',
    },
    rowCategory: {
        fontSize: 16,
        fontWeight: '500',
    },
    rowNote: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    rowRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    rowAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    incomeText: {
        color: '#4CD964',
    },
    expenseText: {
        color: '#FF3B30',
    },
    rightActionContainer: {
        width: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 12,
    },
});

export default TransactionList;
