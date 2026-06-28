param(
  [string]$WorkDir = "F:\kassadin_illidan_swap_work",
  [string]$RepoDir = "C:\dev\nexus-based-imobiliaria",
  [string]$Name = "Dominated_Illidan_Kassadin_AnimMap_WAD"
)

$ErrorActionPreference = "Stop"

$ExportedAnm = Join-Path $WorkDir "exported_anm"
$OldAnimBin = Join-Path $WorkDir "old_wad_extract_check\data\characters\kassadin\animations\skin0.bin"
$Tree = Join-Path $WorkDir "wad_tree_lol_paths"
$AnimDir = Join-Path $Tree "assets\characters\kassadin\skins\base\animations"
$BinDir = Join-Path $Tree "data\characters\kassadin\animations"
$BuildRoot = Join-Path $WorkDir "fantome_build_wad\Dominated_Illidan_Kassadin_AnimMap"
$WadOut = Join-Path $BuildRoot "WAD\Kassadin.wad.client"
$ZipOut = Join-Path $WorkDir "$Name.zip"
$FantomeOut = Join-Path $WorkDir "$Name.fantome"
$WadPack = Join-Path $RepoDir "tools\wad-pack\target\release\wad-pack.exe"

$Map = @{
  "Animation_Attack1.anm" = "kassadin_attack1.anm"
  "Animation_Attack2.anm" = "kassadin_attack2.anm"
  "Animation_Spell1.anm" = "kassadin_spell1.anm"
  "Animation_Spell2.anm" = "kassadin_spell2.anm"
  "Animation_Spell3.anm" = "kassadin_spell3.anm"
  "Animation_Spell4.anm" = "kassadin_spell4.anm"
  "Animation_Run.anm" = "kassadin_run.anm"
  "Animation_Idle1.anm" = "kassadin_idle1.anm"
  "Animation_Idle2.anm" = "kassadin_idle2.anm"
  "Animation_StandReady.anm" = "kassadin_idlein.anm"
  "Animation_Death1.anm" = "kassadin_death.anm"
}

if (!(Test-Path $WadPack)) {
  cargo build --release --manifest-path (Join-Path $RepoDir "tools\wad-pack\Cargo.toml")
}

Remove-Item -LiteralPath $Tree -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $BuildRoot -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $ZipOut -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $FantomeOut -Force -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Force -Path $AnimDir, $BinDir, (Join-Path $BuildRoot "META"), (Join-Path $BuildRoot "WAD") | Out-Null

foreach ($entry in $Map.GetEnumerator()) {
  $src = Join-Path $ExportedAnm $entry.Key
  $dst = Join-Path $AnimDir $entry.Value
  if (!(Test-Path $src)) {
    throw "Missing exported ANM: $src"
  }
  Copy-Item -LiteralPath $src -Destination $dst -Force
}

if (!(Test-Path $OldAnimBin)) {
  throw "Missing reference animation bin: $OldAnimBin"
}
Copy-Item -LiteralPath $OldAnimBin -Destination (Join-Path $BinDir "skin0.bin") -Force

& $WadPack $Tree $WadOut

$info = [ordered]@{
  Name = "Dominated Illidan Kassadin AnimMap WAD"
  Author = "Codex + usuario"
  Version = "0.2.0"
  Description = "Kassadin animation WAD override using Dominated Illidan retargeted ANM files and skin0 animation bin reference."
  Home = ""
  Heart = ""
}
($info | ConvertTo-Json -Depth 5) | Set-Content -LiteralPath (Join-Path $BuildRoot "META\info.json") -Encoding UTF8

Compress-Archive -LiteralPath (Join-Path $BuildRoot "META"), (Join-Path $BuildRoot "WAD") -DestinationPath $ZipOut -Force
Rename-Item -LiteralPath $ZipOut -NewName "$Name.fantome"

Write-Host "[done] $FantomeOut"
