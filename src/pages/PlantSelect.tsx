import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';

import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary copy';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { PlantProps } from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { useNavigation } from '@react-navigation/core';

interface EnvironmentProps{
    key: string;
    title: string;
}



export function PlantSelect(){
    
    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlant, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentsSelected, setEnvironmentsSelected ] = useState('all');
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(true);
    const navigation = useNavigation();


    function handleEnvironmentSelected(environment: string){
        setEnvironmentsSelected(environment);

        if(environment == 'all')
        return setFilteredPlants(plants);

        const filtered = plants.filter(plant => 
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);   
    }

    async function fetchPlants(){
        const { data } = await api
        .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoading(true);

        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data]);   
            setFilteredPlants(oldValue => [...oldValue, ...data]); 
        }else{
            setPlants(data);
            setFilteredPlants(data);
        }
        
    setLoading(false);
    setLoadingMore(false);
    }

    function handleFetchMore(distance: number){
        if(distance < 1)
            return;
        setLoadingMore(true);
        setPage(oldValue => oldValue + 1)
        fetchPlants();
    }

    useEffect(()=>{
        async function fetchEnvironment(){
            const { data } = await api
            .get('plants_environments?_sort=title&_order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnvironment();
    },[]);

    function handlePlantSelect(plant: PlantProps){
        navigation.navigate('PlantSave', { plant });
    }

    useEffect(()=>{

        fetchPlants();
    },[]);

    if (loading)
        return <Load />
    return(
        <View style={styles.container} >
            <View style={styles.header} >
                <Header />

                <Text style={styles.title} >
                    Em qual ambiente
                </Text>

                <Text style={styles.subtitle}>
                    voc?? quer colocar sua planta?
                </Text>

            </View>

            <View>
                <FlatList 
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton 
                            title={item.title}
                            active={item.key === environmentsSelected}
                            onPress={()=> handleEnvironmentSelected(item.key)}
                        /> 
                    )}
                    // transforma a flatlist de vertical para horizontal
                    horizontal
                    // remove barra de rolagem
                    showsHorizontalScrollIndicator={false}
                    // Estilo da lista(especifico da lista)
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList 
                    data={filteredPlant}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item })=>(
                        <PlantCardPrimary  
                            data={item} 
                            onPress={()=>handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}    
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) =>
                        handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent = {
                        loadingMore ? 
                        <ActivityIndicator color={colors.green} />
                        :
                        <></>
                    }
                    contentContainerStyle={styles.contentContainerStyle}
                />
            </View>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        paddingHorizontal:30,
    },
    title:{
        fontSize:17,
        color:colors.heading,
        fontFamily: fonts.heading,
        lineHeight:20,
        marginTop:15,
    },
    subtitle:{
        fontFamily: fonts.text,
        fontSize:17,
        lineHeight:20,
        color:colors.heading,
    },
    enviromentList:{
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5, 
        marginLeft: 32,
        marginVertical: 32,
    },
    plants:{
        flex:1,
        paddingHorizontal:32,
        justifyContent: 'center',
    },
    contentContainerStyle:{
        
    },
});