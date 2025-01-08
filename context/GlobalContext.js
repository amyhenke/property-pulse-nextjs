"use client"
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount"
import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

// create the context
const GlobalContext = createContext()

// create provider (so can access the context from all components)
export function GlobalProvider({ children }) {
    const [unreadCount, setUnreadCount] = useState(0)

    const { data: session } = useSession()

    // we only want to fetch number of unread messages if the user is logged in
    useEffect(() => {
        if (session && session.user) {
            getUnreadMessageCount().then(res => {
                // check if there is a count from getUnreadMessageCount()
                if (res.count) {
                    // save the count in the state
                    setUnreadCount(res.count)
                }
            })
        }
    }, [getUnreadMessageCount, session])

    return (
        <GlobalContext.Provider
            value={{
                unreadCount,
                setUnreadCount,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobalContext() {
    return useContext(GlobalContext)
}
