'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { AppBar, Toolbar, Typography, Container, CssBaseline, ThemeProvider } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">
                Freight Delay Notification
              </Typography>
            </Toolbar>
          </AppBar>
          <Container sx={{ py: 4 }}>
            {children}
          </Container>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
