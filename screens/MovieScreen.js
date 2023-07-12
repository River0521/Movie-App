import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { styles, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient'
import Cast from '../components/cast'
import MovieList from '../components/movieList'
import Loading from '../components/loading'
import { fetchMovieDetails, image500 } from '../api/moviedb';
import { fallbackMoviePoster, fetchMovieCredits, fetchSimilarMovies } from '../api/moviedb';




var { width, height } = Dimensions.get('window')
const ios = Platform.OS == 'ios'
const topMargin = ios ? 'px-4' : 'px-2 py-2'

export default function MovieScreen() {
    const { params: item } = useRoute();
    const navigation = useNavigation();
    const [isFavorite, toggleFavorite] = useState(false)
    const [cast, setCast] = useState([])
    const [similarMovies, setsimilarMovies] = useState([])
    const [loading, isLoading] = useState(false);
    const [movie, setMovie] = useState({})

    useEffect(
        () => {
            isLoading(true);
            getMovieDetails(item.id);
            getMovieCredits(item.id);
            getSimilarMovies(item.id);
        }, [item]
    )

    const getMovieDetails = async id => {
        const data = await fetchMovieDetails(id);
        if (data) setMovie(data);
        isLoading(false);
    }

    const getMovieCredits = async id => {
        const data = await fetchMovieCredits(id);
        if (data && data.cast) {
            setCast(data.cast);
        }
    }

    const getSimilarMovies = async id => {
        const data = await fetchSimilarMovies(id);
        if (data && data.results) {
            setsimilarMovies(data.results);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            className="flex-1 bg-neutral-900"
        >

            <View className="w-full">
                <SafeAreaView className={"z-20 w-full flex-row justify-between items-center " + topMargin}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFavorite(!isFavorite)}>
                        <HeartIcon size="35" color={isFavorite ? theme.background : "white"} />
                    </TouchableOpacity>
                </SafeAreaView>
                {
                    loading ? (<Loading />) : (<View>
                        <Image source={{ uri: image500(movie?.poster_path) || fallbackMoviePoster }}
                            style={{ width, height: height * 0.55 }}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
                            style={{ width, height: height * 0.40 }}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="absolute bottom-0"
                        />

                    </View>)
                }

            </View>


            <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
                <Text className="text-white text-center text-3xl font-bold tracking-widest">
                    {
                        movie?.title
                    }
                </Text>
                {
                    movie?.id ? (<Text className="text-neutral-400 font-semibold text-base text-center">
                        {movie?.status} • {movie?.release_date?.split('-')[0]} • {movie?.runtime} min
                    </Text>) : null
                }


                <View className="flex-row justify-center mx-4 space-x-2">
                    {
                        movie?.genres?.map((genre, index) => {
                            let showDot = index + 1 != movie.genres.length
                            return (<Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                                {genre?.name} {showDot ? "•" : null}
                            </Text>)
                        })
                    }
                </View>

                <Text className="text-neutral-400 mx-4 tracking-wide">
                    {
                        movie?.overview
                    }
                </Text>

            </View>
            <Cast navigation={navigation} cast={cast} />

            <MovieList
                title='Similar Movies'
                hideSeeAll={true}
                data={similarMovies} />
        </ScrollView>
    )
}