import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProps } from '../theme/types';

import CompanyHomeScreen from '../screens/Auth/Company/CompanyHomeScreen';
import AddJobScreen from '../screens/Auth/Company/AddJobScreen';
import CompanyJobDetailScreen from '../screens/Auth/Company/CompanyJobDetailScreen';
import EditJobScreen from '../screens/Auth/Company/EditJobScreen';

import AddEventScreen from '../screens/Auth/Company/AddEventScreen';
import CompanyEventDetailScreen from '../screens/Auth/Company/CompanyEventDetailScreen';
import EditEventScreen from '../screens/Auth/Company/EditEventScreen'; 

import CompanyProfileScreen from '../screens/Auth/Profile/CompanyProfileScreen';

const Stack = createNativeStackNavigator();

const CompanyStack: React.FC<ThemeProps> = ({ activeTheme }) => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: activeTheme.background } 
            }}
            initialRouteName="CompanyHome"
        >
            <Stack.Screen name="CompanyHome" component={CompanyHomeScreen} />
            
            <Stack.Screen name="AddJob" component={AddJobScreen} />
            <Stack.Screen name="CompanyJobDetail" component={CompanyJobDetailScreen} />
            <Stack.Screen name="EditJob" component={EditJobScreen} />
            
            <Stack.Screen name="AddEvent" component={AddEventScreen} />
            <Stack.Screen name="CompanyEventDetail" component={CompanyEventDetailScreen} />
            <Stack.Screen name="EditEvent" component={EditEventScreen} />

            <Stack.Screen name="ProfileDetail" component={CompanyProfileScreen} />

        </Stack.Navigator>
    );
};

export default CompanyStack;