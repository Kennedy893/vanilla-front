import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { handleLogin, loading, error } = useLogin();
    const navigate = useNavigate();

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
        await handleLogin({ username, password });

        // Connexion réussie : aller au tableau de bord
        navigate("/dashboard", { replace: true });
        } catch {
        // L'erreur est déjà stockée dans le hook.
        }
    }

    return (
        <div className="flex min-h-screen bg-stone-50">
        {/* Panneau de marque (masqué sur mobile) */}
        <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-emerald-900 p-12 text-emerald-50 lg:flex">
            <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-200 text-lg font-bold text-emerald-900">
                DV
            </span>
            <span className="text-lg font-semibold tracking-wide">
                Dago Vanilla
            </span>
            </div>

            <div>
            <h2 className="text-4xl font-bold leading-tight">
                De la plantation
                <br />
                à l'expédition.
            </h2>
            <p className="mt-4 max-w-md text-emerald-200">
                Suivez chaque lot de vanille de Madagascar, garantissez son origine
                et valorisez le travail de ceux qui la produisent.
            </p>
            </div>

            <p className="text-sm text-emerald-300">Madagascar · Région SAVA</p>

            {/* Décor discret */}
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-800/60" />
            <div className="pointer-events-none absolute -top-16 -right-8 h-40 w-40 rounded-full bg-amber-200/10" />
        </aside>

        {/* Formulaire */}
        <main className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
            <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
            <h1 className="text-2xl font-bold text-stone-900">Connexion</h1>
            <p className="mt-1 text-sm text-stone-500">
                Connectez-vous à votre espace de traçabilité.
            </p>

            {/* Bloc d'erreur */}
            {error && (
                <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                >
                <svg
                    className="mt-0.5 h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                </svg>
                <span>{error}</span>
                </div>
            )}

            <form className="mt-8 space-y-5"  onSubmit={handleSubmit}>
                <div>
                <label
                    htmlFor="username"
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                    Nom d'utilisateur
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
                </div>

                <div>
                <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                    Mot de passe
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 active:scale-[0.99]"
                >
                Se connecter
                </button>
            </form>
            </div>
        </main>
        </div>
    );
}