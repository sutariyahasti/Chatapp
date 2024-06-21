"use client";

import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_API_URL;
export const socket = io.connect(url);