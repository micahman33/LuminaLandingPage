import { LandingPage } from "./components/LandingPage";

// Re-render this page at most once per hour so download links stay current
export const revalidate = 3600;

// Used if the GitHub API call fails; update if v1.1.0 is ever removed from releases
const FALLBACK_MAC_URL =
  "https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina-1.1.0-arm64.dmg";
const FALLBACK_WIN_URL =
  "https://github.com/micahman33/lumina/releases/download/v1.1.0/Lumina.Setup.1.1.0.exe";

type GithubAsset = {
  name: string;
  browser_download_url: string;
};

async function getLatestRelease(): Promise<{
  macUrl: string;
  winUrl: string;
}> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/micahman33/lumina/releases/latest",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );

    if (!res.ok) {
      return { macUrl: FALLBACK_MAC_URL, winUrl: FALLBACK_WIN_URL };
    }

    const data = await res.json();
    const assets: GithubAsset[] = data.assets ?? [];

    // Prefer arm64 DMG for Apple Silicon; fall back to any DMG
    const macAsset =
      assets.find((a) => a.name.endsWith("arm64.dmg")) ??
      assets.find((a) => a.name.endsWith(".dmg"));

    // Windows installer (.exe but not the .exe.blockmap file)
    const winAsset = assets.find(
      (a) => a.name.endsWith(".exe") && !a.name.endsWith(".blockmap")
    );

    return {
      macUrl: macAsset?.browser_download_url ?? FALLBACK_MAC_URL,
      winUrl: winAsset?.browser_download_url ?? FALLBACK_WIN_URL,
    };
  } catch {
    return { macUrl: FALLBACK_MAC_URL, winUrl: FALLBACK_WIN_URL };
  }
}

export default async function Home() {
  const { macUrl, winUrl } = await getLatestRelease();
  return <LandingPage macUrl={macUrl} winUrl={winUrl} />;
}
