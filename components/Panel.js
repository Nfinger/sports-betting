import React, {Component} from 'react'
import {StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native'; //Step 1
import Icon from "react-native-vector-icons/FontAwesome";
class Panel extends Component{
    constructor(props){
        super(props);

        this.icons = {     //Step 2
            'up'    : <Icon name="angle-up" size={25} />,
            'down'  : <Icon name="angle-down" size={25} />
        };

        this.state = {
            title       : props.title,
            expanded    : true,
            animation   : new Animated.Value()
        };
    }

    toggle = () => {
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight = (event) => {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    _setMinHeight = (event) => {
        this.setState({
            minHeight: event.nativeEvent.layout.height
        });
    }


    render(){
        console.log(this.state)
        return ( 
            <Animated.View 
                style={[styles.container,{height: this.state.animation}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle}
                    >
                        {this.state.expanded ? this.icons['up'] : this.icons['down']}
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this._setMaxHeight}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}
export default Panel;

var styles = StyleSheet.create({
    container   : {
        // margin:10,
        overflow:'hidden',
        width: '100%'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body        : {
        padding     : 10,
        paddingTop  : 0
    }
});