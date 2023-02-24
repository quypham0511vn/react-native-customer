import React from 'react';
import {StyleSheet} from 'react-native';
import VideoPlayer from 'react-native-video-controls';

const PlayVideoScreen = ({navigation, route}:{navigation: any, route: any}) => {

    return <VideoPlayer
        source={{uri: route.params}}
        style={styles.backgroundVideo}
        navigator={navigation}
    />;
    
};

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});

export default PlayVideoScreen;
