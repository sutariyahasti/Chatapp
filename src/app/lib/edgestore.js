"use client";
import { createEdgeStoreProvider } from "@edgestore/react";

// Simply call the function without type arguments as JavaScript does not support TypeScript types
const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider();

export {EdgeStoreProvider,useEdgeStore}
