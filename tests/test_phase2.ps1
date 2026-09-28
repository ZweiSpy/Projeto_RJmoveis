# Suporte e testes para Fase 2: Design System e Tokens CSS

$ErrorActionPreference = "Stop"
$testResults = @()

function Assert-Test {
    param(
        [string]$Name,
        [bool]$Condition,
        [string]$Details = ""
    )
    if ($Condition) {
        Write-Host "  [PASS] $Name" -ForegroundColor Green
        $script:testResults += [PSCustomObject]@{ Test = $Name; Status = "PASS"; Details = $Details }
    } else {
        Write-Host "  [FAIL] $Name - $Details" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{ Test = $Name; Status = "FAIL"; Details = $Details }
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " INICIANDO SUITE DE TESTES - FASE 2: DESIGN SYSTEM E CSS " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$tokensFile = ".\css\tokens.css"
$customFile = ".\css\custom.css"

# 1. Verificacao de Arquivos
Write-Host "`n1. Verificacao de Arquivos:" -ForegroundColor Yellow
Assert-Test -Name "Arquivo tokens.css existe" -Condition (Test-Path $tokensFile)
Assert-Test -Name "Arquivo custom.css existe" -Condition (Test-Path $customFile)

$tokensContent = if (Test-Path $tokensFile) { Get-Content $tokensFile -Raw } else { "" }
$customContent = if (Test-Path $customFile) { Get-Content $customFile -Raw } else { "" }

# 2. Verificacao de Tokens Oficiais (Elegance Blue)
Write-Host "`n2. Verificacao de Tokens Oficiais (Elegance Blue):" -ForegroundColor Yellow
$tokensToCheck = @(
    "--color-primary-navy: #1e293b",
    "--color-primary-navy-dark: #0f172a",
    "--color-accent-bronze: #b45309",
    "--color-accent-bronze-hover: #d97706",
    "--color-bg-body: #f8fafc",
    "--color-bg-card: #ffffff",
    "--color-text-main: #0f172a",
    "--color-whatsapp: #25d366"
)

foreach ($token in $tokensToCheck) {
    $found = $tokensContent.Contains($token)
    Assert-Test -Name "Token oficial definido: $token" -Condition $found
}

# 3. Neutralizacao de Cores Antigas (Laranja e Marrom)
Write-Host "`n3. Neutralizacao de Cores Antigas (Laranja e Marrom):" -ForegroundColor Yellow
$hasLegacyOrange = $tokensContent -match "--[a-zA-Z0-9_-]+:\s*#f96a1b"
$hasLegacyBrown  = $tokensContent -match "--[a-zA-Z0-9_-]+:\s*#4a2e22"

Assert-Test -Name "Nenhuma variavel atribuida ao laranja original (#f96a1b)" -Condition (-not $hasLegacyOrange) -Details "Encontrado laranja legado"
Assert-Test -Name "Nenhuma variavel atribuida ao marrom original (#4a2e22)" -Condition (-not $hasLegacyBrown) -Details "Encontrado marrom legado"

# 4. Mapeamento de Sobrescrita de Variaveis Antigas
Write-Host "`n4. Mapeamento de Compatibilidade de Variaveis Legadas:" -ForegroundColor Yellow
$legacyVarsToMap = @(
    "--cor-bg-login",
    "--cor-realce-cb-menu",
    "--cor-txt-menu",
    "--cor-bg-tag-lanc",
    "--cor-bg-tag-exclus",
    "--cor-bg-btn-nwes",
    "--cor-bg-corpo",
    "--cor-txt-nome-prto",
    "--jc-marca",
    "--jc-marca-escuro",
    "--jc-marrom",
    "--jc-texto",
    "--jc-fundo"
)

foreach ($legacyVar in $legacyVarsToMap) {
    $pattern = [regex]::Escape($legacyVar) + ":\s*var\("
    $mapped = $tokensContent -match $pattern
    Assert-Test -Name "Variavel legada mapeada para token: $legacyVar" -Condition $mapped
}

# 5. Regras de Supressao de Valores e Precos
Write-Host "`n5. Regras de Supressao Financeira em custom.css:" -ForegroundColor Yellow
$suppressionSelectors = @(
    ".product-card-price",
    ".currentPrice",
    ".installment-plan",
    ".cdm-pix",
    ".sidebar-filter-block.filter--price",
    "#f-filter-price"
)

foreach ($sel in $suppressionSelectors) {
    $containsSel = $customContent.Contains($sel)
    Assert-Test -Name "Seletor de supressao presente: $sel" -Condition $containsSel
}
$hasDisplayNone = $customContent -match "display:\s*none\s*!important;"
Assert-Test -Name "Regra display: none !important declarada" -Condition $hasDisplayNone

# 6. Componente CTA WhatsApp
Write-Host "`n6. Estilizacao do Botao WhatsApp em custom.css:" -ForegroundColor Yellow
Assert-Test -Name "Classe .btn-whatsapp-cta declarada" -Condition ($customContent.Contains(".btn-whatsapp-cta"))
Assert-Test -Name "Uso do token --color-whatsapp no botao" -Condition ($customContent.Contains("var(--color-whatsapp)"))
Assert-Test -Name "Estado de hover (.btn-whatsapp-cta:hover)" -Condition ($customContent.Contains(".btn-whatsapp-cta:hover"))
Assert-Test -Name "Icone .whatsapp-icon estilizado" -Condition ($customContent.Contains(".whatsapp-icon"))

# Relatorio Final
$totalTests = $testResults.Count
$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " RESULTADO DOS TESTES - FASE 2" -ForegroundColor Cyan
$statusColor = if ($failed -eq 0) { "Green" } else { "Red" }
Write-Host " Total: $totalTests | Aprovados: $passed | Falhas: $failed" -ForegroundColor $statusColor
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
