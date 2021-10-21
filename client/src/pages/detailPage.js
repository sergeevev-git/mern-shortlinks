import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { authContext } from "../context/authContext";
import { Loader } from "../components/loader";
import { LinkCard } from "../components/linkCard";

export const DetailPage = () => {
    const { token } = useContext(authContext);
    const { request, loading } = useHttp();
    const [link, setLink] = useState();
    const linkId = useParams().id;
    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, "GET", null, {
                Authorization: `Bearer ${token}`,
            });
            setLink(fetched);
        } catch (error) {}
    }, [token, linkId, request]);

    useEffect(() => {
        getLink();
    }, [getLink]);

    if (loading) {
        return <Loader />;
    }

    return <>{!loading && link && <LinkCard link={link} />}</>;
};
