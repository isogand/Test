/*
    Created By Hamed Es
    Used for Requests . this custom hook handle loading , errors , and response
    also chack request header and control authentication
*/
import React,{ useState, useCallback } from "react";
import { useSelector } from "react-redux";

//send request input types
interface IRequestConfig {
    url : string;
    method? : 'GET' | 'POST' | 'DELETE' | 'PUT' ;
    body? : any | {} | null ;
    headers? : any | {} | null ;
}

//send request input types
interface IRequestProps {
    requestConfig : IRequestConfig;
    isUpload? : boolean;
}



const useHttp : Function = (applyData ?: any) => {

    const {token} = useSelector((state : any)=> state.authReducer)

    /* Hook States */
    //this state is for loading - if data is fetching value is true , otherwise value is false
    const [loading, setLoading] = useState<boolean>(false);
    //this state showing errors - if error occured this value is error content , otherwise is null
    const [error, setError] = useState<string | null | any>();

    //this function check request header - we have 4 senario for headers
    function checkHeader(config : IRequestConfig){

        //define a header and append content type into it
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization","Bearer " + token);

        //senario 1 -> if header not set in Request : if method is get , header set {} else set content type for header
        if(!config.headers){
            if(config.method === 'GET' && config.url.includes('version') && config.url.includes('verify') && config.url.includes('login') && config.url.includes('cities') && config.url.includes('tickets') && config.url.includes('flightsTodays') && config.url.includes('passengerPrice') )
                return {};

            return myHeaders;
        }

        //senario 2 -> if header set and method is GET : return setted config
        if(config.method === 'GET')
            return config.headers;

        //senario 3 -> if header contain authorization : return setted config
        if(config.headers.has('Authorization'))
            return config.headers;

        //senario 4 -> if
        if(!config.headers.has('Content-Type')) config.headers.append("Content-Type", "application/json");
        config.headers.append("Authorization","Bearer " + token);

        return config.headers;
    }

    /*
        Send Request Function - use from callback for avoid from duplicate method and reduce performance
        we have 2 input -> requestConfig for request config such as url, method, header and body. isUpload for
        determine Request is for Upload or not

    */
    const sendRequest = useCallback( async (requestConfig : IRequestConfig , isUpload = false ) => {
        // console.log("Config",requestConfig)
        //Set Loading true
        setLoading(true)
        //Set Error null
        setError(null)
        //console.log('res1', requestConfig);


        try{

            // console.log(requestConfig.url,
            //     // "http://trasafar.ir/api",
            //     {
            //         method: requestConfig.method ?? 'GET',
            //         body: requestConfig.body ? (isUpload ? requestConfig.body : JSON.stringify(requestConfig.body)) : null,
            //         headers: JSON.stringify(checkHeader(requestConfig))
            //     });

            // console.log('res1', requestConfig);
            const response = await fetch(
                requestConfig.url,
                // "http://trasafar.ir/api",
                {
                    method: requestConfig.method ?? 'GET',
                    body: requestConfig.body ? (isUpload ? requestConfig.body : JSON.stringify(requestConfig.body)) : null,
                    headers: checkHeader(requestConfig)
                }
            )
            setLoading(false)
            // console.log(response)

            //Check Response for error - Request failed or authentication failed
            if(!response.ok){
                if(response.status === 403)
                {
                    setError('Authentication failed!');
                    return;
                }

                setError(response ||'Request Failed!');
                throw {
                    status: response.status,
                    data: ((text) => { try { return JSON.parse(text) } catch { return text } })(await response.text())
                };
            }
            // console.log('res2', response);
            //fetched data
            const data = await response.json();
            //set data into passed function for handle response
            applyData?.(data)

            return {data: data};
        }
        catch(error){
            console.log("error-use-http", error);
            setError(error);
            throw error;
        }
    },[applyData]);

    //Returned parameters for hook
    return {
        loading,
        error,
        sendRequest
    }
}

export default useHttp
