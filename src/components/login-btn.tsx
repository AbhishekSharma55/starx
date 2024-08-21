"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { redirect } from 'next/navigation'

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
        {redirect("/dashboard")}
        </>
      )}
    </div>
  );
}
