import { useUserRole } from '@/hooks/user-role'
import { auth, db } from '@/server/firebaseConfig'
import { router } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Dimensions, Image, Text, View } from 'react-native'

export default function Home() {
    const [clientName, setClientName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const { role, setRole } = useUserRole()

    const windowWidth = Dimensions.get('window').width

    const clientCollection = collection(db, 'cliente')
    const colaboratorCollection = collection(db, 'colaborador')

    async function fetchClientInfo() {
        setIsLoading(true)

        try {
            const clientq = query(
                clientCollection,
                where('email', '==', auth.currentUser?.email)
            )
            const clientQuerySnapshot = await getDocs(clientq)

            const colaboratorq = query(
                colaboratorCollection,
                where('email', '==', auth.currentUser?.email)
            )

            const colaboratorQuerySnapshot = await getDocs(colaboratorq)

            if (!clientQuerySnapshot.empty) {
                clientQuerySnapshot.forEach((doc) => {
                    setClientName(doc.data().nome)
                })

                setRole('CLIENT')
            }

            if (!colaboratorQuerySnapshot.empty) {
                colaboratorQuerySnapshot.forEach((doc) => {
                    setClientName(doc.data().nome)
                })

                setRole('ADMIN')
            }
        } catch (error) {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchClientInfo()
    }, [])

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Carregando...</Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Erro ao buscar informações</Text>
            </View>
        )
    }

    return (
        <View className="flex-1">
            <Image
                source={require('@/assets/home.png')}
                alt="Logo"
                resizeMode="stretch"
                style={{
                    width: windowWidth,
                    height: 350,
                }}
            />

            <View className="px-6 gap-6 rounded-t-[20px] bg-white -mt-12 flex-1">
                <View className="mt-6">
                    <Text>{role}</Text>
                    <Text className="text-2xl">Bem vindo ao Lili Pizza</Text>
                    <Text className="text-lg text-gray-500">
                        Olá {clientName}
                    </Text>
                </View>

                <View className="mt-6">
                    <View className="flex-row gap-6">
                        <TouchableOpacity
                            onPress={() =>
                                router.replace('/(auth)/home/events')
                            }
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-between px-4 border border-gray-200 rounded-lg h-16"
                        >
                            <Text>Agendar evento</Text>

                            <Image
                                source={require('@/assets/calendar.png')}
                                alt="Logo"
                                resizeMode="stretch"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/home/menu')}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-between px-4 border border-gray-200 rounded-lg h-16"
                        >
                            <Text>Cardápio</Text>

                            <Image
                                source={require('@/assets/pizza-home.png')}
                                alt="Logo"
                                resizeMode="stretch"
                                style={{
                                    width: 50,
                                    height: 50,
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row gap-6 mt-6">
                        <TouchableOpacity
                            onPress={() =>
                                router.replace('/(auth)/home/my-events')
                            }
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-between px-4 border border-gray-200 rounded-lg h-16"
                        >
                            <Text>Meus eventos</Text>

                            <Image
                                source={require('@/assets/map.png')}
                                alt="Logo"
                                resizeMode="center"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {}}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-between px-4 border border-gray-200 rounded-lg h-16"
                        >
                            <Text>Sobre nós</Text>

                            <Image
                                source={require('@/assets/info.png')}
                                alt="Logo"
                                resizeMode="cover"
                                style={{
                                    width: 30,
                                    height: 30,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
