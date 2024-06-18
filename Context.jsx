import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat =()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        try {
            setLoading(true);
            setShowResult(true);
            let response;

            if (prompt !== undefined) {
                response = await run(prompt);
                setRecentPrompt(prompt);
                setPrevPrompts((prev) => [...prev, prompt]);
            } else {
                response = await run(input);
                setRecentPrompt(input);
                setPrevPrompts((prev) => [...prev, input]);
            }

            const responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            const newResponse2 = newResponse.split("*").join("<br>");
            const newResponseArray = newResponse2.split(" ");
            newResponseArray.forEach((nextWord, i) => {
                delayPara(i, nextWord + " ");
            });
        } catch (error) {
            console.error("Error occurred during processing:", error);
            setResultData("An error occurred while processing your request.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
