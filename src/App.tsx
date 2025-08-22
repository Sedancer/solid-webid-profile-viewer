import {useEffect} from "react";
import Header from "./components/Header.tsx";
import Divider from "./components/Divider.tsx";
import Card from "./components/Card.tsx";
import KeyValue from "./components/KeyValue.tsx";
import Link from "./components/Link.tsx";
import {useWebIdProfile} from "./hooks/useWebIdProfile";
import {useToasts} from "./components/Toasts";

const DEFAULT_WEBID = "https://timbl.solidcommunity.net/profile/card#me";
//const DEFAULT_WEBID = "https://angelo.veltens.org/profile/card#me";

export default function App() {
    const {profile, loading, error, currentWebId} = useWebIdProfile(DEFAULT_WEBID);
    const {showToast} = useToasts();

    useEffect(() => {
        if (loading) {
            showToast("Loading profile...", "info");
        } else if (error) {
            showToast("Failed to load profile", "error");
        } else if (profile) {
            showToast("Profile loaded successfully", "success");
        }
    }, [loading, error, profile, showToast]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

            <Header webId={currentWebId} defaultWebId={DEFAULT_WEBID}/>

            <main className="w-full p-4 md:p-6">
                {loading && (
                    <div className="text-center text-gray-600">Loading...</div>
                )}

                {!loading && error && (
                    <Card className="border border-red-200 bg-red-50 text-red-900">
                        <div className="font-semibold mb-1">Failed to load profile</div>
                        <div className="text-sm opacity-90">{error}</div>
                    </Card>
                )}

                {!loading && profile && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-6" >
                        <Card>
                            <div className="flex md:flex-row flex-col items-center text-center gap-4">
                                <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-md bg-slate-100 grid place-items-center">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    ) : (
                                        <div className="text-5xl">👤</div>
                                    )}
                                </div>
                                <div className="flex flex-col max-w-[100%]">
                                    <KeyValue label="Name" value={profile.name}/>
                                    <KeyValue label="WebId" value={currentWebId}/>
                                    {profile.nickname && (
                                        <KeyValue label="Nickname" value={profile.nickname}/>
                                    )}
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <h4 className="font-medium mb-1">Email</h4>
                            {profile.emails.length ? (
                                <ul className="space-y-1">
                                    {profile.emails.map((email:string) => (
                                        <li key={email}>
                                            <Link href={`mailto:${email}`}> {email} </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-slate-500">No data</div>
                            )}
                            {!!profile.tels.length && (<>
                                <Divider/>
                                <h4 className="font-medium mb-1">Phone</h4>
                                <ul className="space-y-1">
                                    {profile.tels.map((tel:string) => (
                                        <li key={tel}>
                                            <Link href={`tel:${tel}`}>{tel}</Link>
                                        </li>
                                    ))}
                                </ul>
                                </>
                            )}
                        </Card>
                        {(profile.org || profile.title || profile.homepage || profile.bio) && (
                            <Card className="flex flex-col gap-4">
                                {profile.org && <KeyValue label="Organization" value={profile.org}/>}
                                {profile.title && <KeyValue label="Title" value={profile.title}/>}
                                {profile.homepage && (
                                    <KeyValue
                                        label="Homepage"
                                        value={
                                            <a
                                                href={profile.homepage}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 hover:underline break-all"
                                            >
                                                {profile.homepage}
                                            </a>
                                        }
                                    />
                                )}
                                {profile.bio && <KeyValue label="Bio" value={profile.bio}/>}
                            </Card>
                        )}

                        <Card>
                            <h4 className="text-lg font-semibold mb-3">Connections (foaf:knows)</h4>
                            {profile.knows.length ? (
                                <ul className="list-disc pl-6 space-y-1">
                                    {profile.knows.map((know:string) => (
                                        <li key={know}>
                                            <a
                                                className="text-indigo-600 hover:underline break-all"
                                                href={know}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {know}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-slate-500">No data</div>
                            )}
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
