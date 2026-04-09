"use client";
import { HouseIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function BackHomeButton(){
    return (
        <Link className="btn btn-outline mt-10 w-full hover:bg-white/20" href="/">
          <HouseIcon size={24} />
          Go Back Home
        </Link>
    )
}