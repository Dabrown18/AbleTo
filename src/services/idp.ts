import firebase from '@react-native-firebase/app';
import installations from '@react-native-firebase/installations';
import '@react-native-firebase/auth';

export const emailHasIdpPassword = async (email: string) => {
    try {
        const loginMethods = await firebase.app('AUTH').auth().fetchSignInMethodsForEmail(email);
        return loginMethods.some((method) => method === 'password');
    } catch (error) {
        if (error.message === 'auth/invalid-email') {
            throw new Error("Email doesn't exist in Firebase");
        } else {
            throw new Error('general.errors.general');
        }
    }
};

export const idpLogin = async (email: string, password: string) => {
    const res = await firebase.app('AUTH').auth().signInWithEmailAndPassword(email, password);

    return res.user;
};

export const idpRegister = async (email: string, password: string) => {
    const res = await firebase.app('AUTH').auth().createUserWithEmailAndPassword(email, password);
    return res.user;
};

export const idpPasswordReset = async (email: string) =>
    await firebase.app('AUTH').auth().sendPasswordResetEmail(email);

export const getIdpInstanceId = async () => await installations().getId();

export const getIdpUser = () => firebase.app('AUTH').auth().currentUser;
