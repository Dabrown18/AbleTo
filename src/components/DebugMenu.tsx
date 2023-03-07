import React, {FunctionComponent, useCallback, useEffect} from 'react';
import {Dimensions, Pressable} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import RNShake from 'react-native-shake';
import styled from 'styled-components';

import { BodyText } from '@src/core';
import useDevMenu from '@src/hooks/useDevMenu';
import {isDevBuild} from '@src/services/helpers';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DebugMenu: FunctionComponent = () => {
  const translateX = useSharedValue(-SCREEN_WIDTH);
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value),
      },
    ],
  }));

  const showMenu = useCallback(() => (translateX.value = 0), [translateX]);
  const hideMenu = useCallback(() => (translateX.value = -SCREEN_WIDTH), [translateX]);

  const { menuItems} = useDevMenu();

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      if (isDevBuild) {return;}
      showMenu();
    });

    return subscription.remove();
  }, [showMenu]);

  return (
    <PressHandler style={rStyle} onPress={hideMenu}>
      <Container>
        <Pressable>
          <InnerContainer>
            {menuItems.map((item) => {
              return (
                <Pressable key={item.title} onPress={item.callback}>
                  <Tile>
                    <BodyText>{item.title}</BodyText>
                  </Tile>
                </Pressable>
              );
            })}
          </InnerContainer>
        </Pressable>
      </Container>
    </PressHandler>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PressHandler = styled(AnimatedPressable)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Container = styled.View`
  width: 70%;
  height: 100%;
  background-color: ${({theme}) => theme.colors.gray200};
`;

const InnerContainer = styled(Container)`
  width: 100%;
`;

const Tile = styled.View`
  padding: 15px 20px;
  width: 100%;
  
  border-color: ${({theme}) => theme.colors.gray500};
  border-top-width: 1px;
`;

export default DebugMenu;
