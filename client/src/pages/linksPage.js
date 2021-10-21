import React, { useContext, useState, useCallback, useEffect } from "react";
import { authContext } from "../context/authContext";
import { useHttp } from "../hooks/http.hook";
import { Loader } from "../components/loader";
import { LinksList } from "../components/linksList";

export const LinksPage = () => {
    const [links, setLinks] = useState([]);
    const { loading, request } = useHttp();
    const { token } = useContext(authContext);

    const fetchLinks = useCallback(async () => {
        try {
            const fetched = await request("/api/link", "GET", null, {
                Authorization: `Bearer ${token}`,
            });
            setLinks(fetched);
        } catch (error) {}
    }, [token, request]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    if (loading) {
        <Loader />;
    }
    return <>{!loading && <LinksList links={links} />}</>;
};
