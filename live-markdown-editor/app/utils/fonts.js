import { JetBrains_Mono, Lora, Poppins, Fira_Code } from "next/font/google";

export const jetbrains = JetBrains_Mono({
  subsets: ["latin","italic"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const firacode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-firacode",
  display: "swap",
})
