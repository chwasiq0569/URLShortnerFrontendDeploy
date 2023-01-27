import React, { useState } from "react";
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import './Container.css';

function Container() {
    const [inputTxt, setInputTxt] = useState("");
    const [showTable, setShowTable] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [fetchUrl, setFetchUrl] = useState({});
    const [errStatus, setErrStatus] = useState("");

    function handleChange(event) {
        setInputTxt(event.target.value);
    }

    const is_url = (str) => {
        if (isURL(str)) {
            return true
        } else {
            return false
        }
    };

    const handleSubmit = async () => {
        setErrStatus("")
        setLoading(true);
        console.log('inputTxt', inputTxt)
        const postData = { full: inputTxt };
        if (is_url(inputTxt)) {
            try {
                const res = await axios.post('https://rich-red-zebra-hose.cyclic.app/short', postData)
                console.log("RES", res)
                if (res) {
                    setFetchUrl(res.data);
                    setShowTable(true);
                    setInputTxt("");
                    setErrStatus("")
                }
            } catch (err) {
                if (err.response == 401) setErrStatus(err.response.data.message)
                else setErrStatus("Something went wrong! Please Try Again!")
            }
        } else {
            setErrStatus("Unable to shorten that link. It is not a valid url.")
        }
        setLoading(false);
    }

    return (
        <div className="content__container">
            <input className="url__input" type="text" placeholder="Enter Link Here!" onChange={handleChange} value={inputTxt} />
            <button disabled={inputTxt.length < 5} className="submit_btn" onClick={handleSubmit}>Submit</button>
            {
                isLoading ? <p className="loading">Loading...</p> : errStatus ? <p className="loading">{errStatus}</p> : showTable ? <div className="urls__container">
                    {
                        fetchUrl.short && <>
                            <div className="short__url">
                                <p>Full URL</p>
                                <a href={fetchUrl.full} target="_blank">{fetchUrl.full}</a>
                            </div>
                            <div className="short__url">
                                <p>Short URL</p>
                                <a href={fetchUrl.full} target="_blank">{'https://rich-red-zebra-hose.cyclic.app/' + fetchUrl.short}</a>
                            </div>
                        </>
                    }
                </div> : null
            }
        </div>
    );

}

export default Container;