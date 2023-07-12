import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import { styles } from '../theme';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import TrendingMovies from '../components/trendingMovies';
import MovieList from '../components/movieList';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb';

const ios = Platform.OS == 'ios';

export default function HomeScreen() {

    const [trending, setTrending] = useState([]);
    const [Upcoming, setUpcoming] = useState([]);
    const [TopRated, setTopRated] = useState([]);
    const navigation = useNavigation();
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        getTrendingMovies();
        getUpcomingMovies();
        getTopRatedMovies();
    }, [])


    const getTrendingMovies = async () => {
        const data = await fetchTrendingMovies();
        if (data && data.results) {
            setTrending(data.results);
            isLoading(false);
        }
    }

    const getUpcomingMovies = async () => {
        const data = await fetchUpcomingMovies();
        if (data && data.results) {
            setUpcoming(data.results);
        }
    }

    const getTopRatedMovies = async () => {
        const data = await fetchTopRatedMovies();
        if (data && data.results) {
            setTopRated(data.results);
            isLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-neutral-800">

            <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
                <StatusBar style="light" />
                <View className="flex-row justify-between items-center mx-4">
                    <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
                    <Text className="text-white text-3xl font-bold">
                        <Text style={styles.text}>M</Text>ovies
                    </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {
                loading ? (<Loading />) : (<ScrollView showsVerticleScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                >
                    {trending.length > 0 && <TrendingMovies data={trending} />}

                    {Upcoming.length > 0 && <MovieList title="Upcoming" data={Upcoming} />}

                    <MovieList title="Top Rated" data={TopRated} />
                </ScrollView>)
            }

        </View>
    )
}

