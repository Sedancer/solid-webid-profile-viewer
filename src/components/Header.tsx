import Link from "./Link.tsx";

type Props = {
    webId?: string;
    defaultWebId?: string;
};

const Separator  = () => (
    <>
        <span className="block sm:hidden w-full h-0"></span>
        <span className="hidden sm:inline-block w-[30px] text-center">|</span>
    </>
);

export default function Header({webId, defaultWebId = ''}: Props) {
    return (
        <header
            className="sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
                <div className="text-md font-semibold">
                    <span>Solid Profile Viewer </span>
                    <Separator />
                    <span>{webId}</span>
                    <Separator />
                    <Link href={`/?webid=${encodeURIComponent(defaultWebId)}`}>
                        TimBL
                    </Link>
                </div>
            </div>
        </header>
    )
}