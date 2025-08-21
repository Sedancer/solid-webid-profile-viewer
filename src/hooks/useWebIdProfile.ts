import { useEffect, useState } from "react";
import * as $rdf from "rdflib";

export interface Profile {
    name: string;
    avatar: string;
    emails: string[];
    tels: string[];
    knows: string[];
    nickname: string;
    org?: string;
    title?: string;
    homepage?: string;
    bio?: string;
}

export function useWebIdProfile(defaultWebId: string) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentWebId, setCurrentWebId] = useState<string>("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let webId = urlParams.get("webid");
        if (window.location.hash && !webId?.includes('#')) {
            webId = webId + window.location.hash;
        }

        if (!webId) {
            const redirectUrl = `${window.location.origin}?webid=${encodeURIComponent(defaultWebId)}`;
            window.location.replace(redirectUrl);
            return;
        }
        webId = decodeURIComponent(webId);
        const safeWebId = encodeURI(webId);

        setCurrentWebId(webId);
        setLoading(true);
        setError(null);

        const fetchProfile = async () => {
            try {
                const store = $rdf.graph();
                const fetcher = new $rdf.Fetcher(store, { fetch: window.fetch.bind(window) });
                await fetcher.load(safeWebId);

                const FOAF = "http://xmlns.com/foaf/0.1/";
                const VCARD = "http://www.w3.org/2006/vcard/ns#";
                const RDFS = "http://www.w3.org/2000/01/rdf-schema#";

                const name = store.any($rdf.sym(webId), $rdf.sym(`${FOAF}name`))?.value || "No name found";

                const img =
                    store.any($rdf.sym(webId), $rdf.sym(`${FOAF}img`))?.value ||
                    store.any($rdf.sym(webId), $rdf.sym(`${VCARD}hasPhoto`))?.value ||
                    "";

                const emails = [
                    ...new Set(
                        store
                            .each($rdf.sym(webId), $rdf.sym(`${VCARD}hasEmail`)) // => Node[]
                            .map((node: $rdf.Node) => {
                                const value = store.any(node, $rdf.sym(`${VCARD}value`)); // => Node | null
                                return (value?.value || node.value || "").replace("mailto:", "");
                            })
                            .filter((s): s is string => Boolean(s)) // type guard
                    ),
                ];

                const tels = [
                    ...new Set(
                        store
                            .each($rdf.sym(webId), $rdf.sym(`${VCARD}hasTelephone`))
                            .map((node: $rdf.Node) => {
                                const value = store.any(node, $rdf.sym(`${VCARD}value`));
                                return (value?.value || node.value || "").replace("tel:", "");
                            })
                            .filter(Boolean)
                    ),
                ];

                const knows = store
                    .each($rdf.sym(webId), $rdf.sym(`${FOAF}knows`))
                    .map((obj: any) => obj.value);

                const nickname = store.any($rdf.sym(webId), $rdf.sym(`${FOAF}nick`))?.value || "";
                const org = store.any($rdf.sym(webId), $rdf.sym(`${VCARD}organization-name`))?.value || "";
                const title = store.any($rdf.sym(webId), $rdf.sym(`${VCARD}title`))?.value || "";
                const homepage = store.any($rdf.sym(webId), $rdf.sym(`${FOAF}homepage`))?.value || "";
                const bio = store.any($rdf.sym(webId), $rdf.sym(`${RDFS}comment`))?.value || "";

                setProfile({
                    name,
                    nickname,
                    avatar: img,
                    emails,
                    tels,
                    knows,
                    org,
                    title,
                    homepage,
                    bio,
                });
            } catch (err: any) {
                setError(err.message || "Error Loading Profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [defaultWebId]);

    return { profile, loading, error, currentWebId };
}