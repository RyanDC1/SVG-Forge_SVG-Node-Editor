import { useMemo } from 'react'

type Props = {
    /**
     * @description specify the store to be used.
     * 
     * options: 'local', 'session'
     * 
     * @default 'local'
     */
    store: 'local' | 'session'
}

export default function useLocalStore(props?: Props) {
    const { store: defaultStore = 'local' } = props || {}

    const store: Storage = useMemo(() => defaultStore === 'local' ? localStorage : sessionStorage, [])

    const getFromStore = <T>(key: string): T | undefined => {
        try {
            const data = store.getItem(key)
            return data ? JSON.parse(data) : undefined
        }
        catch (error) {
            console.error("An error occurred while fetching from store: ", error)
            return undefined
        }
    }

    const addToStore = <T>(key: string, value: T) => {
        try {
            store.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error("An error occurred while adding to store: ", error)
        }
    }

    const clearStore = (keys?: string[]) => {
        if (keys == null) {
            store.clear()
        }
        else if(Array.isArray(keys)) {
            keys!.forEach(key => {
                store.removeItem(key)
            });
        }
    }

    return { getFromStore, addToStore, clearStore }
}