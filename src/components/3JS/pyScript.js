//from https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx

import { useEffect } from 'react';

const LoadScript = (url,type, async=true, head=true) => {
//function PyScript(props){  
    useEffect(() => {
        console.log("???")
        const script = document.createElement('script');
        script.type = type;

        script.src = url;//"/public/test.py";//url;
        script.async = true;
        //script.innerHTML = inner
        if(head){
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            }
        }
        else{
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            }
        }

    }, [url]);//props.
};

export default LoadScript;