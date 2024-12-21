import React from "react";

interface ViewerContextType {
    /**
     * calls the monaco editor undo function
     */
    undo: () => void,
    /**
     * calls the monaco editor redo function
     */
    redo: () => void
}

interface ViewerContextProviderProps {
    children: React.ReactNode,
    value: ViewerContextType
}

const ViewerContext = React.createContext<ViewerContextType>(null!)

export const useViewerContext = () => React.useContext(ViewerContext)

export default function ViewerContextProvider(props: ViewerContextProviderProps) {

    const { children, value } = props

    return (
        <ViewerContext.Provider 
            value={{
                undo: value.undo,
                redo: value.redo
            }}
        >
            {children}
        </ViewerContext.Provider>
    )
}