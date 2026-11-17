import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import { usersService } from "../../services/users.service";

function ProfilePage() {
    const { user, setUser } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const [username, setUsername] = useState(user?.username ?? "");
    const [bio, setBio] = useState("");

    useEffect(() => {
        if (user) setUsername(user.username ?? "");
    }, [user?.username]);

    const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        setError(null);

        try {
            const updated = await usersService.updateUser(user.id, { username: username.trim() });
            setUser((prev) => (prev ? { ...prev, username: updated.username } : prev));
        } catch (error) {
            console.error("Error in handleSave:", error);
            setError("Could not save profile");
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold">Profile and visibility</h1>

            <form onSubmit={handleSave} className="mt-14">
                <h3 className="text-xl font-medium">About us</h3>
                <p className="mt-3 text-sm">
                    Required fields are marked with an asterisk{" "}
                    <span className="text-red-400">*</span>
                </p>

                <div className="mt-6">
                    <label htmlFor="username" className="mb-2 block text-sm font-semibold">
                        Username <span className="text-red-400">*</span>
                    </label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <label htmlFor="bio" className="mb-2 block text-sm font-semibold">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full resize-y rounded-md border border-white/30 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mt-12 flex justify-end">
                    <Button
                    variant="primary"
                    type="submit"
                    disabled={!username.trim()}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </>
    );
}

export default ProfilePage;