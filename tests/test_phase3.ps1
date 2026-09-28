# Suporte e testes automatizados para Fase 3: Motor WhatsApp

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " EXECUTANDO SUITE DE TESTES - FASE 3: MOTOR WHATSAPP     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verificacao de arquivo
$scriptFile = ".\js\whatsapp-cta.js"
if (-not (Test-Path $scriptFile)) {
    Write-Host "  [FAIL] Arquivo js/whatsapp-cta.js nao encontrado!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "  [PASS] Arquivo js/whatsapp-cta.js presente." -ForegroundColor Green
}

# 2. Execucao dos testes unitarios Node.js
Write-Host "`nExecutando testes unitarios via Node.js:" -ForegroundColor Yellow
$nodeResult = node .\tests\test_phase3.js
$nodeExit = $LASTEXITCODE

Write-Host $nodeResult

if ($nodeExit -ne 0) {
    Write-Host "`n[FALHA] Testes da Fase 3 falharam." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`n[SUCESSO] Todos os testes da Fase 3 foram aprovados!" -ForegroundColor Green
    exit 0
}
