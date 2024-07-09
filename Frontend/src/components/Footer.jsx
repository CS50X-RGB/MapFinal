import React from "react"
import logo3 from "../pages/assets/logo.svg";
import { Image, Divider } from "@nextui-org/react";

export default function Footer() {
  return (
    <div className="flex h-[30vh] flex-col bg-inherit justify-center items-center">
      <div className="flex flex-row w-full text-white gap-4 font-poppins justify-center items-center">
        <Image src={logo3} width={100} height={100} />
        <Divider orientation="vertical" className="bg-white h-1/4" />
        <h1 className="text-2xl">All systems operational</h1>
      </div>
      <h1 className="text-white">@ {new Date().getUTCFullYear()} Map-0-Share.All rights reserved </h1>
    </div>
  )
}
