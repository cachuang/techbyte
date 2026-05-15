import "./globals.css";
import { Space_Grotesk, Noto_Sans_TC } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";

// Latin 用 Space Grotesk（幾何感、tech vibe）。next/font self-host、display: swap。
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

// CJK 用 Noto Sans TC。CJK 字型 file 較大，只載必要 weights、auto-subset 後實際下載量小很多。
const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-tc",
});

export const metadata = {
  title: "techbyte — A byte a day",
  description: "每天 5–10 分鐘，學一個科技概念，做互動驗證，強化記憶。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-Hant"
      className={`${spaceGrotesk.variable} ${notoSansTC.variable}`}
    >
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
