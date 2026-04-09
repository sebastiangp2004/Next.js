"use client";
import { FingerprintIcon } from "@phosphor-icons/react";
import { UserPlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

export default function HomeInfo() {
    return (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage:
                    "url(/imgs/bg-home.png)",
            }}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                    <Image
                        src="/imgs/logo.png"
                        alt="GameNext.js Logo"
                        width={400}
                        height={200}
                        className="flex mx-auto mb-4"
                    />
                    <p className="my-2 text-justify text-sm">
                        <strong>GameNext.js</strong> is a modern platform to manage and organize
                        videogames. Built with Next.js, it uses Prisma, Neon database, and
                        Stack Auth to provide secure authentication, fast performance, and scalable
                        data management.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="handler/sign-in" className="btn btn-outline hover:bg-white hover:text-black hover:border-white transition-colors duration-200 mt-4">
                            <FingerprintIcon size={24} />
                            Sign In
                        </Link>
                        <Link href="handler/sign-up" className="btn btn-outline hover:bg-white hover:text-black hover:border-white transition-colors duration-200 mt-4">
                            <UserPlusIcon size={24} />
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}