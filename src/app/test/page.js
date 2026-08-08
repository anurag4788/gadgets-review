"use client";

import { useEffect } from "react";
import api from "@/lib/api";

export default function TestPage() {

    useEffect(() => {

        async function test() {

            try {

                const res =
                    await api.get("/home");

                console.log(res.data);

            } catch (error) {

                console.error(error);

            }

        }

        test();

    }, []);

    return <h1>Axios Working</h1>;
}