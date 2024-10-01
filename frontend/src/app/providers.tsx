"use client";

import { useJwtLocalStorage } from "@/lib/utils";
import theme from "@/theme";
import { MantineProvider } from "@mantine/core";
import { readLocalStorageValue } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    const token = readLocalStorageValue({ key: "jwt" });
    if (!token) router.replace("/login");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
