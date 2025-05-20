export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/40 backdrop-blur-sm">
            <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute h-full w-full rounded-full border-4 border-[var(--color-primary)] opacity-30 animate-ping" />
                <div className="h-10 w-10 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
        </div>
    );
}
