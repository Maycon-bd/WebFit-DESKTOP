param(
    [switch]$Build,
    [string]$DesktopLocalDataRoot = (Join-Path $env:USERPROFILE 'AppData/Local')
)

$ErrorActionPreference = 'Stop'
$workspaceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$artifactRoot = Join-Path $workspaceRoot '.artifacts/visual-test/WEBFIT-14'
$testIdentifier = 'br.webfit.desktop.visualtest.webfit14'
$configPath = Join-Path $artifactRoot 'tauri.visual-test.json'
$candidatePath = Join-Path $artifactRoot 'WebFit-Visual-WEBFIT-14.exe'
$manifestPath = Join-Path $artifactRoot 'manifest.json'
$baseConfigPath = Join-Path $workspaceRoot 'src-tauri/tauri.conf.json'
$baseConfig = Get-Content -LiteralPath $baseConfigPath -Raw | ConvertFrom-Json
if ($baseConfig.identifier -ne 'br.webfit.desktop') {
    throw 'Identificador principal inesperado: revisar isolamento antes de preparar o candidato.'
}

# Tauri 2 resolves app_local_data_dir using the bundle identifier. A separate
# identifier isolates both the real service storage and the WebView profile.
# No production configuration, trust root, authorization or schema is changed.
# The Codex shell can redirect LocalApplicationData into a per-call sandbox.
# The visual plugin launches on the desktop, so record both scopes explicitly.
# DesktopLocalDataRoot can be supplied for a Windows profile with redirection.
$desktopLocalDataPath = [IO.Path]::GetFullPath($DesktopLocalDataRoot)
if (!(Test-Path -LiteralPath $desktopLocalDataPath -PathType Container)) {
    throw 'Diretório local do desktop não encontrado; informar DesktopLocalDataRoot.'
}
$isolatedDataPath = Join-Path $desktopLocalDataPath $testIdentifier
$usageDataPath = Join-Path $desktopLocalDataPath $baseConfig.identifier
if ([IO.Path]::GetFullPath($isolatedDataPath) -eq [IO.Path]::GetFullPath($usageDataPath)) {
    throw 'Armazenamento de teste coincide com a instalação de uso.'
}
New-Item -ItemType Directory -Path $artifactRoot -Force | Out-Null
$testWindow = $baseConfig.app.windows[0]
$testWindow.title = 'WebFit — TESTE ISOLADO WEBFIT-14'
$testConfig = [ordered]@{
    identifier = $testIdentifier
    app = @{ windows = @($testWindow) }
    bundle = @{ active = $false }
    # Keep the test candidate from discovering or installing the usage release.
    plugins = @{ updater = @{ endpoints = @() } }
}
$testConfig | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $configPath -Encoding utf8

if ($Build) {
    $cliPath = Join-Path $workspaceRoot 'node_modules/@tauri-apps/cli/tauri.js'
    if (!(Test-Path -LiteralPath $cliPath)) {
        throw 'Dependências locais ausentes; esta ferramenta não instala dependências.'
    }
    $perlRoot = Join-Path $workspaceRoot '.tools/strawberry'
    $perlExe = Join-Path $perlRoot 'perl/bin/perl.exe'
    if (Test-Path -LiteralPath $perlExe) {
        $env:PERL = $perlExe
        $env:PATH = (Split-Path $perlExe) + ';' + (Join-Path $perlRoot 'c/bin') + ';' + $env:PATH
    }
    $env:LC_ALL = 'C'
    $env:LANG = 'C'
    $env:CARGO_TARGET_DIR = Join-Path $workspaceRoot 'src-tauri/target'
    Push-Location $workspaceRoot
    try {
        & node $cliPath build --debug --no-bundle --config $configPath -- --offline --locked
        if ($LASTEXITCODE -ne 0) { throw 'Build isolado falhou; candidato não foi publicado como válido.' }
        $builtExecutable = Join-Path $env:CARGO_TARGET_DIR 'debug/webfit-desktop.exe'
        if (!(Test-Path -LiteralPath $builtExecutable)) { throw 'Executável do build não encontrado.' }
        Copy-Item -LiteralPath $builtExecutable -Destination $candidatePath
        $head = (& git rev-parse HEAD).Trim()
        if ($LASTEXITCODE -ne 0) { throw 'HEAD não identificado.' }
        [ordered]@{
            workItem = 'WEBFIT-14'
            generatedAtUtc = [DateTime]::UtcNow.ToString('o')
            commitBase = $head
            version = $baseConfig.version
            configuration = $configPath
            configurationSha256 = (Get-FileHash -LiteralPath $configPath -Algorithm SHA256).Hash
            executable = $candidatePath
            executableSha256 = (Get-FileHash -LiteralPath $candidatePath -Algorithm SHA256).Hash
            identifier = $testIdentifier
            isolatedDataPath = $isolatedDataPath
            usageDataPath = $usageDataPath
            buildProcessLocalDataPath = [Environment]::GetFolderPath('LocalApplicationData')
            dataPathStatus = 'expected desktop paths; verify after launch'
            updaterEndpoints = @()
            bundled = $false
            licensed = 'requires valid activation; no bypass'
        } | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $manifestPath -Encoding utf8
    } finally {
        Pop-Location
    }
}

Write-Output "Configuração: $configPath"
Write-Output "Candidato: $candidatePath"
Write-Output "Armazenamento isolado esperado: $isolatedDataPath"
Write-Output 'Nenhum aplicativo foi iniciado. Abrir somente o candidato isolado após conferir manifesto/hash.'
