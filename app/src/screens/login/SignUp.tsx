import { Animated, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Popins } from '../../components/popins'
import Icon from 'react-native-vector-icons/AntDesign'
import { TextInput } from 'react-native'
import { CheckBox, Dialog } from '@rneui/themed'
import { TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import { IPADDRESS } from '../../../network.config'
import { Image } from 'react-native'
import { useDispatch } from 'react-redux'
import DialogRedux from '../../components/dialog/DialogRedux'
import { closeDialog, openDialog } from '../../redux/features/DialogSilce'
import { changeRouteName, removeRouteName } from '../../redux/features/navigatorSilce'
import { StackNavigationProp } from '@react-navigation/stack'
import { hanleCheckEmail, hanleSendOTP } from '../../services/UserAPIService'
import { addEmailOTP, removeCode } from '../../redux/features/OTPCodeSilce'

function generateRandomNumbers() {
    const numbers = [];

    for (let i = 0; i < 6; i++) {
        const randomNumber = Math.floor(Math.random() * 9) + 1;
        numbers.push(randomNumber);
    }

    return numbers;
}

export type RootStackParamList = {
    SignupOTPStack: { id: number } | undefined;
};

const SignUp: React.FC = () => {


    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [checked, setChecked] = React.useState(false);
    const toggleCheckbox = () => setChecked(!checked);


    const route = useRoute();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(changeRouteName(route.name));
    }, [])


    const [email, setemail] = React.useState('');
    const [username, setusername] = React.useState('');

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const register = async () => {
        // if (email.length == 0 || password.length == 0 || confirm.length == 0) {
        //     ToastAndroid.show("Nhập thiếu thông tin", ToastAndroid.SHORT)
        //     return;
        // }
        // if (checked === false) {
        //     ToastAndroid.show("Phải chấp nhận điều khoản của chúng tôi", ToastAndroid.SHORT)

        //     console.log("Phải chấp nhận điều khoản của chúng tôi");
        //     return;
        // }
        if (!emailRegex.test(email)) {
            console.log("Sai email");
            ToastAndroid.show("Sai định dạng email", ToastAndroid.SHORT)
            return;
        }
        // if (!passwordRegx.test(password)) {
        //     console.log("Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt");
        //     ToastAndroid.show("Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt", ToastAndroid.SHORT)
        //     return;
        // }
        // if (!(password === confirm)) {
        //     console.log("Xác nhận mật khẩu sai");
        //     ToastAndroid.show("Xác nhận mật khẩu sai", ToastAndroid.SHORT)
        //     return;
        // }

        try {
            dispatch(openDialog({ choose: 0 }));
            dispatch(removeCode());
            const checkEmail = await hanleCheckEmail(email);
            if (!checkEmail) {
                const sendOTP = await hanleSendOTP(email);
                if (sendOTP) {
                    dispatch(closeDialog());
                    dispatch(addEmailOTP(email));
                    navigation.navigate('SignupOTPStack', { screen: 'CodeVerification', params: { email } } as never);

                } else {
                    dispatch(closeDialog());
                }
            } else {
                dispatch(openDialog({ choose: 2, title: "Failed", content: "Please select a different email as this one is already registered", buttontext: 'Try again' }));
                //ToastAndroid.show("Email đã được đăng ký", ToastAndroid.SHORT)
            }


            // const sendOTP = await axios.post(IPADDRESS + '/api/user/email', { email });
            // if (sendOTP.data) {
            //     dispatch(closeDialog());
            //     navigation.navigate('SignupOTPStack', { screen: 'CodeVerification', params: { email } } as never);
            // } else {
            //     dispatch(closeDialog());
            // }

            //đổi link
            //dispatch(openDialog(0));
            // const result = await axios.post(IPADDRESS + '/api/user/find', {email});
            // if (result.data.user == true) {
            //     console.log("Email đã được đăng ký");
            //     ToastAndroid.show("Email đã được đăng ký", ToastAndroid.SHORT)
            //     return;
            // }
            // else {
            //     //dispatch(loginSuccess(result.data.user));
            //     const result2 = await axios.post(IPADDRESS + '/api/user/email', { email , password , username, link:IPADDRESS});
            //     navigation.navigate('SignIn' as never);
            // }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <View style={styles.container}>
            <DialogRedux />
            <Text style={[styles.textHero, styles.text, { flexGrow: 0 }]}>Create {"\n"}an account</Text>
            <View style={{ flexGrow: 1 }}>
                <View style={[styles.containerInput,]}>
                    <View style={[styles.inputHero, styles.sizeContainerNomal]}>
                        <TextInput keyboardType='email-address' style={styles.inputField} placeholder='Email' cursorColor={'#637899'} onChangeText={text => { setemail(text); setusername(text); }} />
                        <Icon name='user' size={18} color={'#637899'} />
                    </View>
                    {/* <View style={[styles.inputHero, styles.sizeContainerNomal]}>
                    <TextInput secureTextEntry={!isUnlock} style={styles.inputField} placeholder='Password' cursorColor={'#637899'} onChangeText={text => setpassword(text)} />
                    <TouchableOpacity onPress={() => { isUnlock ? setUnlock(false) : setUnlock(true) }}>
                        <Image style={{ tintColor: '#637899', width: 24, height: 24, }} source={isUnlock ? require('../../assets/icon/System/unlock.png') : require('../../assets/icon/System/lock.png')} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputHero, styles.sizeContainerNomal]}>
                    <TextInput secureTextEntry={!isUnlock} style={styles.inputField} placeholder='Confirm Password' cursorColor={'#637899'} onChangeText={text => setconfirm(text)} />
                </View> */}
                </View>
                <TouchableOpacity style={[styles.buttonHero, styles.center, styles.sizeContainerNomal,]} onPress={register}>
                    <Text style={[styles.text500, { color: 'white' }]} >Sign Up</Text>
                </TouchableOpacity>
            </View>


            {/* <View style={{ flexDirection: 'row', marginBottom: 56 }}>
                <CheckBox
                    checked={checked}
                    onPress={toggleCheckbox}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank"
                    uncheckedColor='#E9E9F0'
                    checkedColor="#FF404C"
                    containerStyle={{ padding: 0, margin: 0, }}
                />
                <View style={[styles.center, { flexDirection: 'row' }]}>
                    <Text onPress={toggleCheckbox} style={[styles.text500]}>I have read </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Terms' as never) }} >
                        <Text style={[styles.text500, { color: '#FF404C' }]}>Terms & Agreement </Text>
                    </TouchableOpacity>
                </View>
            </View> */}
            {/* <View style={{ flexGrow: 1, justifyContent: 'center' }}>

                <Text style={[{ width: '100%', marginBottom: 32 }, styles.textCenter]}>Or sign up with</Text>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <TouchableOpacity style={[styles.center, styles.buttonSocial, { flexDirection: 'row', paddingBottom: 2 }]} >
                        <Icon name='google' size={20} />
                        <Text style={[styles.text500, styles.textCenter, { marginLeft: 8 }]} >Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.center, styles.buttonSocial, { flexDirection: 'row', paddingBottom: 2 }]} >
                        <Icon name='apple1' size={20} />
                        <Text style={[styles.text500, styles.textCenter, { marginLeft: 8 }]} >Apple ID</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    )
}



const styles = StyleSheet.create({
    buttonSocial: {
        borderRadius: 20,
        height: 58,
        width: "48%",
        backgroundColor: '#E9E9F0'
    },
    buttonHero: {
        backgroundColor: '#FF404C',
        marginVertical: 16
    },
    inputField: {
        flexGrow: 1,
        height: '100%',
        padding: 0,
        fontSize: 16,
        fontWeight: '400',
        color: '#192e51',
        marginRight: 8
    },
    inputHero: {
        backgroundColor: '#F5F5F8',
        flexGrow: 1,
        flexDirection: 'row',
        margin: 0,
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 16
    },
    containerInput: {
        marginTop: 32,
    },
    textHero: {
        fontFamily: Popins[700],
        fontSize: 32,
        letterSpacing: 0.8,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        backgroundColor: 'white'
    },
    text: {
        color: '#192e51',
    },
    textCenter: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    text400: {
        color: '#192e51',
        fontFamily: Popins[400],
        top: 1.8,
    },
    text500: {
        color: '#192e51',
        fontFamily: Popins[500],
        top: 2,
    },
    text700: {
        color: '#192e51',
        fontFamily: Popins[700],
        top: 2.1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sizeContainerNomal: {
        borderRadius: 20,
        width: "100%",
        height: 64,
    },

});

export default SignUp