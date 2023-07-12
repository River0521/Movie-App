import { View, Text, Platform, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useNavigation, useRoute } from '@react-navigation/native'
import { styles } from '../theme'
import MovieList from '../components/movieList'
import Loading from '../components/loading'
import { fetchPersonDetails, fetchPersonMovies, image342, fallbackPersonImage } from '../api/moviedb'

var { width, height } = Dimensions.get('window')
const ios = Platform.OS == ios
const topMargin = ios ? 'px-4' : 'px-2 py-2'

export default function PersonScreen() {
    const { params: item } = useRoute()
    const navigation = useNavigation()
    const [isFavorite, toggleFavorite] = useState(false)
    const [person, setPerson] = useState({})
    const [personMovies, setPersonMovies] = useState([])
    const [loading, isLoading] = useState(false);

    useEffect(() => {
        isLoading(true);
        getPersonDetails(item.id);
        getPersonMovies(item.id);
    }, [item])

    const getPersonDetails = async id => {
        const data = await fetchPersonDetails(id);
        isLoading(false);
        if (data) {
            setPerson(data);
        }
    }
    const getPersonMovies = async id => {
        const data = await fetchPersonMovies(id);
        if (data && data.cast) {
            setPersonMovies(data.cast);
        }

    }

    return (
        <ScrollView className="flex-1 bg-neutral-900"
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <SafeAreaView className={"z-20 w-full flex-row justify-between items-center " + topMargin}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite(!isFavorite)}>
                    <HeartIcon size="35" color={isFavorite ? "red" : "white"} />
                </TouchableOpacity>
            </SafeAreaView>
            {
                loading ? (<Loading />) : (
                    <View>
                        <View className="flex-row justify-center rounded-full"
                            style={{
                                shadowColor: 'gray',
                                shadowRadius: 40,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 1,
                                elevation: 15,
                                backgroundColor: 'transparent',

                            }}
                        >
                            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
                                <Image source={{ uri: image342(person?.profile_path) || fallbackPersonImage }}
                                    style={{ height: height * 0.43, width: width * 0.74 }}
                                />
                            </View>

                        </View>

                        <View className="mt-6">
                            <Text className="text-3xl text-white font-bold text-center">
                                {person?.name}
                            </Text>
                            <Text className="text-base text-neutral-500 text-center">
                                {person?.place_of_birth}
                            </Text>
                        </View>
                        <View className="mx-2 p-3 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
                            <View className="pr-2 border-r-2 border-r-neutral-400 items-center">
                                <Text className=" text-white font-semibold ">Gender</Text>
                                <Text className=" text-neutral-300 text-sm ">{person?.gender == 1 ? 'Female' : 'Male'}</Text>
                            </View>
                            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                <Text className=" text-white font-semibold ">Birthday</Text>
                                <Text className=" text-neutral-300 text-sm ">{person?.birthday}</Text>
                            </View>
                            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                                <Text className=" text-white font-semibold ">Known For</Text>
                                <Text className=" text-neutral-300 text-sm ">{person?.known_for_department}</Text>
                            </View>
                            <View className="px-2 items-center">
                                <Text className=" text-white font-semibold ">Popularity</Text>
                                <Text className=" text-neutral-300 text-sm ">{person?.popularity?.toFixed(2)}%</Text>
                            </View>
                        </View>

                        <View className="my-6 mx-4 space-y-2">
                            <Text className="text-white text-lg">Biography</Text>
                            <Text className="text-neutral-400 tracking-wide">
                                {person?.biography}
                            </Text>
                        </View>

                        <MovieList data={personMovies} title="Movies" hideSeeAll={true} />

                    </View>

                )
            }

        </ScrollView>
    )
}