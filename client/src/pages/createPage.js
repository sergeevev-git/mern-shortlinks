import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { authContext } from "../context/authContext";
import { useHistory } from "react-router-dom";

export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(authContext);
    const { request } = useHttp();
    const [link, setLink] = useState("");

    const pressHandler = async (event) => {
        if (event.key === "Enter") {
            try {
                const data = await request(
                    "/api/link/generate",
                    "POST",
                    {
                        from: link,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                console.log("data", data);
                history.push(`/detail/${data.link._id}`);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    return (
        <div className="row">
            <div className="col s8 offset-s2">
                <div className="input-field">
                    <label htmlFor="link">Введите ссылку</label>
                    <input
                        placeholder="введите ссылку"
                        id="link"
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                </div>
            </div>
        </div>
    );
};
