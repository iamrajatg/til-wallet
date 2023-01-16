import * as ed from './eddsa';

export const generateKeyPair = async ()=>{
    const privateKey =  ed.utils.randomPrivateKey()
    const publicKey = await ed.getPublicKeyCustom(privateKey);
    return {
        privateKey:ed.utils.bytesToHex(privateKey),
        publicKey:ed.utils.bytesToHex(publicKey)
    }
}