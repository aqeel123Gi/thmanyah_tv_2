import AsyncStorage from '@react-native-async-storage/async-storage';

// الحفظ
export const saveData = async (key: string, value: any) => {
    await AsyncStorage.setItem(key,value);
};

// الاسترجاع
export const loadData = async (key: string) => {
    return await AsyncStorage.getItem(key);
};
