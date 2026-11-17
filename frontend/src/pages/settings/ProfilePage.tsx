import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";

function ProfilePage() {
    const { user } = useAuth();

    const [username, setUsername] = useState(user?.name ?? "");
    const [bio, setBio] = useState("");

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wywołaj usersService.updateProfile({ username, bio })
        console.log("Save profile", { username, bio });
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
                    disabled={!username.trim()}>
                        Save
                    </Button>
                </div>
            </form>
        </>
    );
}

export default ProfilePage;