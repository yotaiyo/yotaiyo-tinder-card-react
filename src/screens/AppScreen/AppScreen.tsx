import * as React from 'react'
import style from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { AppStateType } from './AppScreenContainer'
import SwipeableView from 'react-swipeable-views'

const height = window.innerHeight
const width = window.innerWidth

const Wrapper = style.div`
  font-family: 'Vollkorn', serif;
  width: ${width}px;
  height: ${height}px;
  background-color: #F5F5F5;
  padding-top: 10px;
`

const CardWrapper = style.div`
  width: ${width - 10}px;
  height: ${height - 80}px;
  background: ${(props: { icon: string }) => props.icon ? `linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.3)), url(${props.icon})` : null};
  background-size: cover;
  border-radius: 10px;
  margin: 0 auto; 
`

const Nope = style.div`
  font-size: 40px;
  font-weight: bold;
  top: 50px;
  right: 40px;
  color: red;
  transform: rotate(20deg);
  position: absolute;
  border: solid 3px red;
  padding-left: 5px;
  padding-right: 5px;
`

const Like = style.div`
  font-size: 40px;
  font-weight: bold;
  top: 50px;
  left: 40px;
  color: green;
  transform: rotate(-20deg);
  position: absolute;
  border: solid 3px green;
  padding-left: 5px;
  padding-right: 5px;
`

const UserInfo = style.div`
  color: #fff;
  padding-top: ${height - 130}px;
  padding-left: 20px;
`

const NickName = style.span`
  font-size: 30px;
  font-weight: bold;
`

const Age = style.span`
  font-size: 20px;
  margin-left: 10px;
`

const ButtonWrapper = style.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const CircleButton = style.img`
  width: 25px; 
  margin-top: 15px;
  background: #fff;
  padding: 10px;
  border-radius: 30px;
`

export interface UserType {
    icon: string
    nickName: string
    age: number
}

const LikeOrNopeSquare = ({ isFadeout, isLike, cardHorizontalPosition, isSwipe }) => {
  return(
    <>
      {isFadeout && !isSwipe ? 
        isLike ? 
            <Like>Like</Like>
            : <Nope>Nope</Nope>
      : null
      }
      {!isFadeout && isSwipe &&
        cardHorizontalPosition > 50 ?
            <Like style={{ left: width + 40 }}>Like</Like>
            : null
      }
      {!isFadeout && isSwipe &&   
        cardHorizontalPosition < -50 ?
            <Nope style={{ right: -width + 40 }} >Nope</Nope>
            : null            
      }
    </>
  )
}

interface CardType extends UserType {
    isLike: boolean
    isFadeout: boolean
    cardHorizontalPosition: number | null
    isSwipe: boolean
}

const Card = ({ icon, nickName, age, isLike, isFadeout, cardHorizontalPosition, isSwipe }: CardType) => (
    <CardWrapper icon={icon} id={'card'}>
        <LikeOrNopeSquare isFadeout={isFadeout} isLike={isLike} cardHorizontalPosition={cardHorizontalPosition} isSwipe={isSwipe} />
        <UserInfo>
            <NickName>{nickName}</NickName>
            <Age>{age}</Age>
        </UserInfo>
    </CardWrapper>
)

interface AppPropsType extends AppStateType {
    user: UserType,
    onPressXButton: (cssTransitionIn: boolean, user: UserType, users: UserType[]) => void
    onPressHeartButton: (cssTransitionIn: boolean, user: UserType, users: UserType[]) => void
    handleTouchMove: () => void
    handleTouchEnd: (user: UserType, users: UserType[], cardHorizontalPosition: number | null, index: number) => void
    handleChangeIndex: (index: number) => void
    handleTransitionEnd: (index: number) => void
}

export const AppScreen: React.SFC<AppPropsType> = ({
    cssTransitionIn,
    users,
    isLike,
    isFadeout,
    isOnPress,
    cardHorizontalPosition,
    user,
    onPressXButton,
    onPressHeartButton,
    handleTouchMove,
    isSwipe,
    handleTouchEnd,
    index,
    handleChangeIndex,
    handleTransitionEnd
}) => {
    return (
        <Wrapper>
            <SwipeableView 
              index={index}
              onTouchMove={() => handleTouchMove()} 
              onTouchEnd={() => handleTouchEnd(user, users, cardHorizontalPosition, index)} 
              onChangeIndex={(index) => handleChangeIndex(index)}
              onTransitionEnd={() => handleTransitionEnd(index)}
              hysteresis={1}
            >  
                <div />
                <CSSTransition
                  in={cssTransitionIn}
                  classNames={isLike ? 'like' : 'nope'}
                  timeout={500}
                >
                  <Card 
                    icon={user.icon} 
                    nickName={user.nickName} 
                    age={user.age} 
                    isLike={isLike} 
                    isFadeout={isFadeout} 
                    cardHorizontalPosition={cardHorizontalPosition} 
                    isSwipe={isSwipe}
                  />
                </CSSTransition> 
                <div />
            </SwipeableView> 
            <ButtonWrapper>
                <CircleButton 
                    src={'../../public/images/x_mark_red.png'}
                    onClick={() => isOnPress ? null : onPressXButton(cssTransitionIn, user, users)}
                />
                <CircleButton 
                    src={'../../public/images/heart_green.png'} 
                    style={{ marginLeft: 50 }} 
                    onClick={() => isOnPress ? null : onPressHeartButton(cssTransitionIn, user, users)}
                />
            </ButtonWrapper>
      </Wrapper>
    )
}