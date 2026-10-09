# Run manually by Maycon. Never pass a password as a command argument or paste it in chat.
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot -Parent
$taskSecret = Read-Host 'Senha mestra do painel (mínimo 12 caracteres)' -AsSecureString
$taskPointer = [IntPtr]::Zero
$taskConfirmation = $null
$taskConfirmationPointer = [IntPtr]::Zero
$taskProcess = $null
try {
    $taskConfirmation = Read-Host 'Confirme a senha mestra do painel' -AsSecureString
    $taskPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskSecret)
    $taskConfirmationPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskConfirmation)
    $taskDifference = $taskSecret.Length -bxor $taskConfirmation.Length
    for ($taskIndex = 0; $taskIndex -lt [Math]::Min($taskSecret.Length, $taskConfirmation.Length); $taskIndex++) {
        $taskDifference = $taskDifference -bor (
            [Runtime.InteropServices.Marshal]::ReadInt16($taskPointer, $taskIndex * 2) -bxor
            [Runtime.InteropServices.Marshal]::ReadInt16($taskConfirmationPointer, $taskIndex * 2)
        )
    }
    if ($taskDifference -ne 0) {
        throw 'As senhas não coincidem. A configuração anterior foi preservada. Execute o script novamente.'
    }
    $taskInfo = [Diagnostics.ProcessStartInfo]::new()
    $taskInfo.FileName = 'cargo'
    $taskInfo.Arguments = 'run --quiet --offline --locked --manifest-path src-tauri/Cargo.toml --bin admin-verifier'
    $taskInfo.WorkingDirectory = $taskRoot
    $taskInfo.UseShellExecute = $false
    $taskInfo.CreateNoWindow = $true
    $taskInfo.RedirectStandardInput = $true
    $taskInfo.RedirectStandardOutput = $true
    $taskInfo.RedirectStandardError = $true
    $taskProcess = [Diagnostics.Process]::new()
    $taskProcess.StartInfo = $taskInfo
    [void]$taskProcess.Start()
    $taskOutput = $taskProcess.StandardOutput.ReadToEndAsync()
    $taskError = $taskProcess.StandardError.ReadToEndAsync()
    $taskProcess.StandardInput.WriteLine([Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskPointer))
    $taskProcess.StandardInput.Close()
    $taskProcess.WaitForExit()
    $taskVerifier = $taskOutput.GetAwaiter().GetResult().Trim()
    [void]$taskError.GetAwaiter().GetResult()
    if ($taskProcess.ExitCode -ne 0 -or $taskVerifier -notmatch '^\$argon2id\$v=19\$m=19456,t=2,p=1\$[^\r\n]+$') {
        throw 'Não foi possível gerar o verificador. Confira senha, toolchain e ambiente de build.'
    }
    $taskConfig = @{ version = 1; verifier = $taskVerifier } | ConvertTo-Json
    [IO.File]::WriteAllText((Join-Path $taskRoot 'src-tauri/admin-access.json'), $taskConfig + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
    Write-Host 'Verificador configurado. Gere o próximo candidato pelo fluxo de build habitual. A senha não foi gravada.'
} finally {
    if ($taskConfirmationPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskConfirmationPointer) }
    if ($taskPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskPointer) }
    if ($null -ne $taskConfirmation) { $taskConfirmation.Dispose() }
    $taskSecret.Dispose()
    if ($null -ne $taskProcess) { $taskProcess.Dispose() }
}
