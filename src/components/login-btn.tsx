"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Component() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!session ? (
        <button onClick={() => signIn("google")}>Sign in</button>
      ) : (
        <>
          <button >Sign out</button>
          <div className="flex gap-4 m-10 text-center justify-center">
            <Image
              src={session.user?.image!}
              alt="Picture of the author"
              width={50}
              height={50}
              className="border rounded-full"
            />
            <p>Signed in as {session.user?.email}</p>
          </div>
        </>
      )}
    </div>
  );
}
