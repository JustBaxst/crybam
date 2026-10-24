import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crybam · 눈물밤 — дневник дорам",
  description: "Личный трекер дорам с эмоциями, отзывами и связями",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var a=localStorage.getItem('accent');if(a&&a!=='violet'){document.documentElement.setAttribute('data-accent',a)}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header user={user} />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        
            <Toaster 
        theme="dark" 
        position="top-right" // ← Изменили на правый верхний угол
        richColors 
        closeButton
        expand={true}        // ← Тосты будут раскрываться, если их несколько
        duration={4000}      // ← Время показа (4 секунды)
        toastOptions={{
          style: {
            padding: "16px",       // ← Больше внутренние отступы
            fontSize: "14px",      // ← Чуть больше шрифт
            minWidth: "360px",     // ← Минимальная ширина окна
            borderRadius: "12px",  // ← Более скругленные углы
          },
        }}
      />
      </body>
    </html>
  );
}