import {doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import {db} from './firebase'

export async function getGoal(userId) {
    const goalRef = doc(db, 'users', userId, 'goals', 'yearly')
    const snapshot = await getDoc(goalRef)

    if (snapshot.exists()){
        return snapshot.data()
    }
    return null
}

export async function saveGoal(userId, target){
    const goalRef =doc(db, 'users', userId, 'goals', 'yearly')
     await setDoc(goalRef,{
        target: target,
        year: new Date().getFullYear()
     })
}

export async function deleteGoal(userId){
    const goalRef = doc(db, 'users', userId, 'goals', 'yearly')
    await deleteDoc(goalRef)
}