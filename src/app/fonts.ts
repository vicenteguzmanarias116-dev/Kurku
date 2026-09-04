import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
export const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });
